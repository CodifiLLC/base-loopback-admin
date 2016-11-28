'use strict';
module.exports = function() {
	return function tracker(req, res, next) {
		//if there is no token, then we won't be able to find a user. Skip
		if (!req.accessToken) return next();

		//lookup the user by token on request
		req.app.models.User.findById(req.accessToken.userId, (err, user) => {
			//if we ran into an error, pass it on
			if (err) return next(err);

			//if we couldn't find the user for the token, throw an error
			if (!user) {
				return next(
					new Error('No user with this access token was found.')
				);
			}

			//if we found the user, set it in places that can be accessed throughout the request
			res.locals.currentUser = user;
			var loopbackContext = require('loopback-context').getCurrentContext();
			if (loopbackContext) loopbackContext.set('currentUser', user);
			next();
		});
	};
};
