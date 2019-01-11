const express = require('express')
const router = express.Router()

// Use express-validator to validate user input
const { check, validationResult } = require('express-validator/check');

// Import models
const { User } = require('../models/index.js')

// Authentication and authorization middleware
const { isAdmin, isSignedIn } = require('../authentication')

// All requests in this router require the user to be signed in
router.all('*', isSignedIn(), isAdmin(), (req, res, next) => {
    next()
})

// Attempt to connect to database and report status
router.get('/', (req, res, next) => {
    // Fetch users from database
    User.findAll().then((users) => {
        // Render admin view
        res.render('admin', {
            title: 'streaks | admin',
            user: req.user,
            users: users
        })
    })
})


module.exports = router
