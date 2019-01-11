// Middleware for allowing only admin users to access a route
// Returns a 403 unauthorized response if the user attempts to access
// an unauthorized resource
function isAdmin() {
    return function (req, res, next) {
        if (req.user.userType == 'admin') {
            return next()
        } else {
            return res.status(403).send('You are not authorized to access that resource.')
        }
    }
}

module.exports = isAdmin
