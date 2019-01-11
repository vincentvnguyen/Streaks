// Just exports the modules in this directory so we can require('./authentication')
// elsewhere in the application

var MiddlewareMethods = require('./middleware');

module.exports = {
    init: require('./init'),
    ownsResource: MiddlewareMethods.ownsResource,
    isSignedIn: MiddlewareMethods.isSignedIn,
    isAdmin: require('./authorization')
}
