// This passport implementation (files in this directory) is heavily based on the following example:
// https://github.com/RisingStack/nodehero-authentication

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models')

// Bcrypt for password hashing
const bcrypt = require('bcrypt')

// Define Passport's authentication strategy (local username/password)
// Straight from the docs other than using bcrypt password hashing
function initPassport() {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({where: { username: username }}).then((user) => {
                // Error messages displayed to the user are identical for
                // security, so they have no indication of whether or not a
                // username even exists
                if (!user) {
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
                return done(null, user);
            });
        }
    ));

    // Configure Passport authenticated session persistence.
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.

    // This is called *after* the user has been authenticated using the strategy
    // above, so the <user> value passed into this function is the <user> object
    // that's passed to the done() method inside the strategy above
    // (This took many hours to figure out; the documentation is lacking)
    passport.serializeUser((user, done) => {
            done(null, user.id);
    });

    // This is called every time isAuthenticated() is called
    // <id> is stored in the user's session (as per the serialize function above)
    // This function returns the full user object associated with that id
    passport.deserializeUser((id, done) => {
        User.findByPk(id).then((user) => {
            done(null, user);
        });
    });
}

module.exports = initPassport
