const express = require('express')
const router = express.Router()

// Use express-validator to validate user input
const { check, validationResult } = require('express-validator/check')

// Import models
const { User, Streak, StreakHistory } = require('../models/index.js')

// Authentication and authorization middleware
const { isSignedIn } = require('../authentication')

const date = require('date-and-time')

// All requests in this router require the user to be signed in
router.all('*', isSignedIn(), (req, res, next) => {
    next()
})

// Save create/edit streak form submission
// Optional id parameter for saving an edit form
router.post('/save/:id?', [
    // Input validation copied directly from signup form
    check('name')
        .trim()
        .isString()
        .not().isEmpty()
        .withMessage('Please enter a streak name'),
    check('frequency')
        .isInt({ min: 1 })
        .withMessage('Please enter a valid frequency number'),
    check('period')
        .not().isEmpty()
        .isIn(['day', 'week']) // Makes sure supplied period is one of these
        .withMessage('Invalid period (valid periods are daily, weekly)'),
    check('startDate')
        .custom((value, { req, loc, path }) => {
            // see routes/index.js for documentation on this custom validator
            if (req.body.startDate >= req.body.endDate) {
                return false
            } else {
                return true
            }
        })
        .withMessage('Streak start date must be before end date')
      ], (req, res, next) => {
          // Check for errors during validation
          const errors = validationResult(req);

          // Return user to form with flashed error messages
          if (!errors.isEmpty()) {
              // Flash old input body to the session as oldInput, so it's still
              // in the signup form after the user is redirected
              req.flash('errors', errors.array())
              req.flash('oldDataId', req.params.id ? req.params.id : '-1')
              // TODO: Flash old input data back to form
              // Scroll user down to the right form
              return res.redirect('/#streak-' + req.params.id)
          }

          if (req.params.id > 0) {
              // Update an existing streak
              Streak.findByPk(req.params.id).then((streak) => {
                  streak.name = req.body.name
                  streak.frequency = req.body.frequency
                  streak.period = req.body.period
                  streak.startDate = date.format(new Date(req.body.startDate), 'YYYY-MM-DD HH:mm:ss')
                  streak.endDate = date.format(new Date(req.body.endDate), 'YYYY-MM-DD HH:mm:ss')
                  streak.save().then(() => {
                      // Successfully updated streak
                      return res.redirect('/')
                  }).catch((err) => {
                      // There was an error
                      req.flash('errors', [err])
                      return res.redirect('/')
                  })
              })
          } else {
              // Create a new one
              // Not using the findOrCreate method because we can't figure out
              // how to use it properly
              Streak.create({
                  name: req.body.name,
                  userId: req.user.id,
                  frequency: req.body.frequency,
                  period: req.body.period, // Don't allow creation of admin users from signup page
                  startDate: date.format(new Date(req.body.startDate), 'YYYY-MM-DD HH:mm:ss'),
                  endDate: date.format(new Date(req.body.endDate), 'YYYY-MM-DD HH:mm:ss'),
              }).then((streak) => {
                  // Successfully created streak
                  return res.redirect('/')
              }).catch((err) => {
                  // There was an error
                  req.flash('errors', [err])
                  return res.redirect('/')
              })
          }
})

// Record a successful streak history entry
// Ya, there's a bit of callback hell here
router.get('/update/:id/:outcome', (req, res, next) => {
    // Find streak
    Streak.findByPk(req.params.id).then((streak) => {
        // Find the most recent row
        StreakHistory.max('id', {where : {'streakId': streak.id }})
        .then((row) => {
            // If the max row couldn't be found, i.e. if there are none yet
            if (!(row > 0)) {
                // Need to create a new streak history row
                StreakHistory.create({
                    streakId: req.params.id,
                    userId: req.user.id,
                    outcome: req.params.outcome,
                    successes: req.params.outcome == 'success' ? 1 : 0,
                    failures: req.params.outcome == 'failure' ? 1 : 0,
                    startDate: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    endDate: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                }).then((row) => {
                    // Update parent streak
                    if (req.params.outcome == 'success') {
                        streak.totalSuccesses += 1
                    } else if (req.params.outcome == 'failure') {
                        streak.totalFailures += 1
                    }

                    // Save streak
                    streak.save().then((streak) => {
                        console.log('Created new streak history row')
                        return res.redirect('/')
                    }).catch((err) => {
                        req.flash('errors', [err])
                        console.log("ERROR: ", err)
                        return res.redirect('/')
                    })
                })
            }

            // Found the max row id for this streak
            // ...now, find the actual row
            StreakHistory.findByPk(row).then((row) => {
                // Found the most recent row
                // Always update its end date to today
                row.endDate = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')

                // Update counters appropriately
                if (req.params.outcome == 'success') {
                    row.successes += 1
                    streak.totalSuccesses += 1
                } else if (req.params.outcome == 'failure') {
                    row.failures += 1
                    streak.totalFailures += 1
                }

                // If this streak is not the same outcome as the event being
                // recorded, create a new one
                if (row.outcome == req.params.outcome) {
                    // Save streak and row and return to dashboard
                    row.save().then((row) => {
                        streak.save().then(() => {
                            console.log('Updated streak history and streak')
                            return res.redirect('/')
                        }).catch((err) => {
                            req.flash('errors', [err])
                            console.log("ERROR: ", err)
                            return res.redirect('/')
                        })
                    }).catch((err) => {
                        req.flash('errors', [err])
                        console.log("ERROR: ", err)
                        return res.redirect('/')
                    })
                } else {
                    // Need to create a new streak history row
                    StreakHistory.create({
                        streakId: req.params.id,
                        userId: req.user.id,
                        outcome: req.params.outcome,
                        successes: req.params.outcome == 'success' ? 1 : 0,
                        failures: req.params.outcome == 'failure' ? 1 : 0,
                        startDate: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                        endDate: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    }).then((row) => {
                        // Save streak
                        streak.save().then((streak) => {
                            console.log('Created new streak history row')
                            return res.redirect('/')
                        }).catch((err) => {
                            req.flash('errors', [err])
                            console.log("ERROR: ", err)
                            return res.redirect('/')
                        })
                    })
                }
            }).catch((err) => {
                req.flash('errors', [err])
                console.log("ERROR: ", err)
                return res.redirect('/')
            })
        })
    }).catch((err) => {
        req.flash('errors', [err])
        console.log("ERROR: ", err)
        return res.redirect('/')
    })
})

// Delete a streak
router.get('/delete/:id', (req, res, next) => {
    Streak.findByPk(req.params.id).then((streak) => {
        // Destroy this streak
        streak.destroy().then(() => {
            return res.redirect('/')
        })
    })
})

module.exports = router;
