/**
 * Module dependencies.
 */
var util = require('util'),
    OAuthStrategy = require('passport-oauth1');

/**
 * `DrupalStrategy` constructor.
 *
 * The Drupal authentication strategy authenticates requests by delegating to
 * a Drupal website using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `providerURL`           URL of provider Drupal website
 *   - `providerBackendURL`    URL used for server to server requests such as token verification and profile requests, defaults to providerURL
 *   - `resourceEndpoint`      Services endpoint for getting current user data (optional, defaults to 'rest/system/connect')
 *   - `consumerKey`           Identifies client to service provider
 *   - `consumerSecret`        Secret used to establish ownership of the consumer key
 *
 * Examples:
 *
 *     passport.use(new DrupalStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret',
 *         providerURL: 'http://drupal.example.com',
 *         resourceEndpoint: 'oauthlogin/api/user/info'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         profile.oauth = { token: token, token_secret: tokenSecret };
 *         done(null, profile);
 *       }
 *     ));
 *
 * @constructor
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function DrupalStrategy(options, verify) {
  options = options || {};

  if (!options.providerURL) { throw new TypeError('DrupalStrategy requires a providerURL option'); }
  if (!options.consumerKey) { throw new TypeError('DrupalStrategy requires a consumerKey option'); }
  if (options.consumerSecret === undefined) { throw new TypeError('DrupalStrategy requires a consumerSecret option'); }

  // Remove trailing slash and store
  this._providerURL = options.providerURL.replace(/\/$/, '');
  if (options.providerBackendURL) {
    this._providerBackendURL = options.providerBackendURL.replace(/\/$/, '');
  } else {
    this._providerBackendURL = this._providerURL;
  }

  // Determine all necessary OAuth options
  var oauthOptions = {
    requestTokenURL: this._providerBackendURL + '/oauth/request_token',
    accessTokenURL: this._providerBackendURL + '/oauth/access_token',
    userAuthorizationURL: this._providerURL + '/oauth/authorize',
    consumerKey: options.consumerKey,
    consumerSecret: options.consumerSecret
  };

  OAuthStrategy.call(this, oauthOptions, verify);

  // Format URL for getting user data
  options.resourceEndpoint = options.resourceEndpoint || 'rest/system/connect';
  this._resourceURL = this._providerBackendURL + '/' + options.resourceEndpoint;

  this.name = 'drupal';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(DrupalStrategy, OAuthStrategy);

/**
 * Retrieve user profile from Drupal
 *
 * This function constructs a normalized profile, along with Drupal user roles
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
DrupalStrategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  var providerURL = this._providerURL;
  this._oauth.post(this._resourceURL, token, tokenSecret, {}, function (err, body, res) {
    if (err) { return done(err); }
    try {
      var json = JSON.parse(body),
          user = json.user || json;

      // Create normalized user profile
      var profile = {
        provider: 'drupal',
        id: Number(user.uid),
        displayName: user.name,
        emails: [{value: user.mail}],
        profileURL: providerURL + '/user/' + user.uid
      };

      // Add Drupal user roles
      profile.roles = [];
      for (role in user.roles) {
        profile.roles.push(user.roles[role]);
      }

      profile._raw = body;
      profile._json = json;
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `DrupalStrategy`.
 */
module.exports = DrupalStrategy;
