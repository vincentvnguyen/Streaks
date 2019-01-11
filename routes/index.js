const express = require('express')
const router = express.Router()

// Use express-validator to validate user input
const { check, validationResult } = require('express-validator/check');

// BCrypt for password hashing
const bcrypt = require('bcrypt')

// Import models
const { db, User, Streak, StreakHistory } = require('../models/index.js')
// const { Streak } = require('../models/streak.js')

// Passport for authentication
const passport = require('passport')
// Our own custom middleware
const { isSignedIn } = require('../authentication')

const date = require('date-and-time')

// Attempt to connect to database and report status
router.get('/status', (req, res, next) => {
    db.sequelize.authenticate().then(() => {
        res.json({ "status": "ok", "database": "Connected" })
    }).catch(err => {
        res.json({ "status": "error", "database": "Error" })
    });
})

// Dashboard
router.get('/',
    isSignedIn(),
    (req, res, next) => {

        // Get flashed errors/data
        const errors = req.flash('errors')
        const oldDataId = req.flash('oldDataId')
        const loginMessage = (req.flash('loginMessage').length > 0)

        // Fetch streaks
        Streak.findAll({
            where: {
                userId: req.user.id
            },
            // Fetch all streak history for every streak
            include: {
                model: StreakHistory,
                as: 'streakHistory',
            }
        }).then((streaks) => {
            // Render dashboard view

            // Aggregate for dashboard
            let totalSuccesses = 0
            let totalFailures = 0
            let failuresThisMonth = 0

            const now = new Date()

            streaks.forEach((streak) => {
                // Calculate aggregate streaks for all failures
                totalSuccesses += streak.totalSuccesses
                totalFailures  += streak.totalFailures

                // Iterate over each streak's history
                console.log("History for streak " + streak.id)
                streak.streakHistory.forEach((historyRow) => {

                    const startDate = new Date(historyRow.startDate)
                    let endDate = new Date(historyRow.endDate)

                    const lengthInDays = date.subtract(endDate, startDate).toDays()

                    // Log for debugging
                    console.log('\t- ',historyRow.outcome, '(' + lengthInDays + ' days)', historyRow.startDate, ' -> ', historyRow.endDate)

                    // Add up all failures in the current month
                    // This will reset at the beginning of every month, which
                    // should be more motivating (a fresh start!) than using
                    // the last 30 days on a rolling basis
                    if (now.getMonth() == endDate.getMonth()) {
                        failuresThisMonth += historyRow.failures
                    }
                })
            })

            // Overall success rate shown on dashboard (expressed as a number, not a decimal)
            let overallSuccessRate = Math.round(100 * (totalSuccesses / (totalSuccesses + totalFailures)))

            return res.render('dashboard', {
                title: 'streaks',
                user: req.user,
                streaks: streaks,
                overallSuccessRate: overallSuccessRate,
                failuresThisMonth: failuresThisMonth,
                errors: errors,
                oldDataId: oldDataId,
                loginMessage: loginMessage,
                date: date, // Give the streakForm access to date.format
            })
        })
})

// Signin
router.get('/signin', (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("Found authenticated user: " + req.user.username)
        // Redirect signed-in users to the dashboard
        res.redirect('/')
    } else {
        // Any flashed error messages from authentication failure are stored
        // Thanks to this post for pointing that out: https://www.raymondcamden.com/2016/06/23/some-quick-tips-for-passport
        const error = req.flash('error')

        res.render('signin', {
            title: 'streaks | sign in',
            error: error,
            user: false
        })
    }
})

// Signin form handler
// Sets req.user property
router.post('/signin',
    // This middleware performs the actual authentication
    passport.authenticate('local', { session: true, failureRedirect: '/signin', failureFlash: true }),
    (req, res, next) => {
        // User is authenticated at this point
        // Flash the login message
        req.flash('loginMessage', true)
        res.redirect('/')
})

// Signs user out
// Destroys req.user property
router.get('/signout', isSignedIn(), (req, res, next) => {
        req.logout()
        res.redirect('/signin')
})

// Signup
router.get('/signup', (req, res, next) => {
    // Ensure user is not authenticated
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    // Display old input and errors in form (if applicable)
    // oldInput is an array with one object in it so take the first element
    const oldInput = req.flash('oldInput')[0]
    const errors = req.flash('errors')

    return res.render('signup', {
        title: 'streaks | sign up',
        errors: errors,
        oldInput: oldInput || false,
        user: false
    })
})

// Signup form handler
router.post('/signup', [
    check('name')
        .trim()
        .isString()
        .not().isEmpty()
        .withMessage('Please enter a name'),
    check('username')
        .trim()
        .not().isEmpty()
        .isAlphanumeric()
        .withMessage('Please enter an alphanumeric username'),
    check('email')
        .not().isEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    check('password')
        .trim()
        .isString()
        .not().isEmpty()
        .withMessage('Please enter a valid password'),
    check('passwordConfirm')
        .trim()
        .isString()
        .not().isEmpty()
        .withMessage('Please enter your password again in the confirm field')
        .custom((value, { req, loc, path }) => {
            // express-validator doesn't allow body fields to be compared using
            // .equals(), so found this custom validator approch to compare the
            // input fields in the following StackOverflow answer:
            // https://stackoverflow.com/questions/46011563/access-request-body-in-check-function-of-express-validator-v4/46013025#46013025
            if (value !== req.body.password) {
                throw new Error()
            } else {
                return value
            }
        })
        .withMessage('Passwords do not match'),
], (req, res, next) => {
    // Check for errors during validation
    const errors = validationResult(req);

    // If there were validation errors, return the form again with the
    // current input flashed (convenient for the user!) along with the
    // error message(s)
    if (!errors.isEmpty()) {
        // Flash old input body to the session as oldInput, so it's still
        // in the signup form after the user is redirected
        req.flash('oldInput', req.body)
        req.flash('errors', errors.array())
        return res.redirect('/signup')
    }

    // Generate a hashed password synchronously
    // Only using 5 salt rounds - we don't to slow down the service *that*
    // much in favour of a ton of security for this application
    const hashedPassword = bcrypt.hashSync(req.body.password, 5)

    // Create a new user model
    User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        userType: 'user', // Don't allow creation of admin users from signup page
        password: hashedPassword,
    }).then((user) => {
        if (user) {
            // Successfully created user
            console.log("Created user: ", user.username)
            // Authenticate new user
            req.login(user, function(err) {
                if (err) { return next(err); }
                // Redirect them to the dashboard
                return res.redirect('/')
            })
        } else {
            console.log('User not created')
            res.json({ 'status': 'error' })
        }
    })
})

module.exports = router
