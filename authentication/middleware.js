// Middleware to verify that the user is signed in, or redirect them
// to the signin page
function isSignedIn() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            return res.redirect('/signin')
        }
    }
}

function ownsResource() {
    return function (req, res, next) {
        if ( (req.user.id == req.params.id) || (req.user.userType == 'admin') ) {
            return next()
        } else {
            return res.status(403).send('You are not authorized to access that resource.')
        }
    }
}


module.exports = {
  isSignedIn : isSignedIn,
  ownsResource : ownsResource
}
