'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

app.use(function (req, res, next) {
  app.currentUser = null;

  // Retrieve the access token used in this request
  var AccessTokenModel = app.models.AccessToken;
  AccessTokenModel.findForRequest(req, {}, function (err, token) {
    if (err) return next(err);
    if ( ! token) return next(); // No need to throw an error here

    // Logic borrowed from user.js -> User.logout() to get access token object
    var UserModel = app.models.User;
    UserModel.relations.accessTokens.modelTo.findById(token.id, function(err, accessToken) {
      if (err) return next(err);
      if ( ! accessToken) return next(new Error('could not find the given token'));

      // Look up the user associated with the access token
      UserModel.findById(accessToken.userId, function (err, user) {
        if (err) return next(err);
        if ( ! user) return next(new Error('could not find a valid user with the given token'));

        app.currentUserId = user.id;
        next();
      });
    });
  });
});


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
