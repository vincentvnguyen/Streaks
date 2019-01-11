const express = require('express');
const router = express.Router();

// Use express-validator to validate user input
const { check, validationResult } = require('express-validator/check');

// Import models
const { User } = require('../models')

// Authentication and authorization middleware
const { isAdmin, isSignedIn, ownsResource } = require('../authentication')

// BCrypt for password hashing
const bcrypt = require('bcrypt')

// All requests in this router require the user to be signed in
router.all('*', isSignedIn(), (req, res, next) => {
    next()
})

// Delete a user (only admins can delete users)
router.get('/delete/:id', isAdmin(), (req, res, next) => {
    // Get this user from the database by req.user.id and delete the instance
    // Make sure admins can't delete themselves!
    // Then redirect the admin to the /admin page
    if (ownsResource()) {
        return res.redirect('/admin')
    }

    User.findByPk(req.params.id).then((user) => {
        user.destroy({ force: true })
    }).then(() => {
    return res.redirect('/admin')
  })
})

// Admin editing a user's profile
// Note the isAdmin() middleware, to make sure this user is an admin
router.get('/edit/:id', ownsResource(), (req, res, next) => {
    // Get this user from the database based on the req.params.id parameter
    // and display their data in the form
    const errors = req.flash('errors')
    User.findByPk(req.params.id).then((userData) => {
        return res.render('editAccount', {
            title: 'streaks | ' + userData.username,
            user: req.user, // Logged in user, not what we're editing
            userData: userData, // The user this admin is editing
            errors: errors,
        })
    })

})

// Handle the edit form submission
router.post('/edit/save', [
    // Input validation copied directly from signup form
    check('name')
        .trim()
        .isString()
        .not().isEmpty()
        .withMessage('Please enter a name'),
    check('username')
        .trim()
        .isString()
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
        .isString() // Don't check if it's empty, because empty just means no change
        .withMessage('Please enter a valid password'),
    check('passwordConfirm')
        // .trim()
        // .isString() // Don't check if it's empty, because empty just means no change
        // .not().isEmpty()
        .custom((value, { req, loc, path }) => {
            // see routes/index.js for documentation on this custom validator
            if (value !== req.body.password && value != '') {
                return false
            } else {
                return true
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
        // Flash errors to form
        // A bit too much of a pain to flash old input here so don't bother
        req.flash('errors', errors.array())
        if (req.body.id == req.user.id) {
            // Return to edit form for this user
            return res.redirect('/users/edit/' + req.body.id)
        } else {
            // Return to edit form for another user
            return res.redirect('/users/edit/' + req.body.id)
        }
    }

    // Only admins can update other users' profiles
    if (req.body.id != req.user.id && req.user.userType != 'admin') {
        return res.status(403).send('You are not authorized to access that resource.')
    }

    // Retrieve the user model with findByPk
    User.findByPk(req.body.id).then((user) => {
      // Update the user model
      user.name = req.body.name
      user.username = req.body.username
      user.email = req.body.email

      // We only want to update the user's password if it has been changed
      if (req.body.password != '') {
          user.password = bcrypt.hashSync(req.body.password, 5)
      }

      // Save the user model
      user.save().then(() => {
          // Redirect the user to their dashboard and flash a success message
          return res.redirect('/')
      })
    })

})


module.exports = router;
