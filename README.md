# Passport-Drupal

[Passport](http://passportjs.org/) strategy for authenticating with [Drupal](http://drupal.org/)
websites that use the [Services](http://drupal.org/project/services) and
[OAuth](http://drupal.org/project/oauth) modules.

This module lets you authenticate using a Drupal website in your Node.js
applications. By plugging into Passport, Drupal authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-drupal

## Usage

#### Configure Strategy

The Drupal OAuth authentication strategy authenticates users using a Drupal
account and OAuth tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a consumer key, consumer secret, and callback URL.

    passport.use(new Strategy({
        consumerKey: DRUPAL_CONSUMER_KEY,
        consumerSecret: DRUPAL_CONSUMER_SECRET,
        providerURL: "http://drupal.example.com",
        providerBackendURL: "http://private.drupal.example.com", // <---- Used for server to server requests such as token verification and profile requests. Defaults to providerURL.
        resourceEndpoint: "oauthlogin/api/user/info" // <---- optional. Defaults to `rest/system/connect`
      },
      function(token, tokenSecret, profile, done) {
        profile.oauth = { token: token, token_secret: tokenSecret };
        done(null, profile);
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'drupal'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

````JavaScript
app.get('/auth/drupal',
  passport.authenticate('drupal'),
  function(req, res) {
    // The request will be redirected to the Drupal website for
    // authentication, so this function will not be called.
});

app.get('/auth/drupal/callback',
  passport.authenticate('drupal', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});
````

If you want to store access tokens locally (e.g. in a persistent session store),
you can add something like the following to prevent requesting new ones every
time:

````JavaScript
app.get('/auth/drupal/login', function(req, res, next) {
  var tokens = req.session['my-session-key'];
  if (req.cookies['my-cookie-key'] && tokens) {
    // If all the data is there, load user profile
    strategy.userProfile(tokens.oauth_token, tokens.oauth_token_secret, {}, function(err, user) {
      if (err) return res.redirect('/auth/drupal');
      req.session.user = user;
      res.redirect('/');
    });
  } else {
    // If not, start OAuth authentication
    res.redirect('/auth/drupal');
  }
});
````

## Drupal configuration

_These instructions are for Drupal 7. For Drupal 6, refer to this issue: [https://github.com/mixmarket/passport-drupal/issues/1](https://github.com/mixmarket/passport-drupal/issues/1#issuecomment-19986969)_

* Install the following modules:
    - oauth_common (bundled with [OAuth](http://drupal.org/project/oauth))
    - oauth_common_providerui (bundled with [OAuth](http://drupal.org/project/oauth))
    - [Services](http://drupal.org/project/services)
    - rest_server (bundled with [Services](http://drupal.org/project/services))
    - services_oauth (bundled with [Services](http://drupal.org/project/services))
* Go to `admin/config/services/oauth` and check on _Enable the oauth provider_.
* On that same page, click on Add Context
    - Under _Signature Methods_, check _HMAC-SHA1_ only
    - Under _Authorization Options_, check on _Disable authorization level selection_.
    - Add an _Authorization Level_ and check on _Selected by default_.
* Go to `admin/structure/services` and click _Add_
    - Enter an endpoint path as both your machine name and path (_rest_ is a good option).
    - Select _REST_ as your Server.
    - Under _Authentication_, check _OAuth authentication_.
    - Save
* On the resulting page, click to Edit your new Service
    - On the _Server_ tab
        * Under _Response formatters_, select _json_.
        * Under _Request parsing_, select _application/json_ and _application/x-www-form-urlencoded_.
    - On the _Authentication_ tab
        * OAuth context: select context created above
        * Default required OAuth Authorization level: select level created above
        * Default required authentication: _Consumer key and access token, also known as 3-legged OAuth_
    - On the _Resources_ tab
        * Check on _system > connect_
        * Select _Default_ for the authentication options
* Go to `user/1/oauth/consumer` and click _Add consumer_
    - On _Callback url_, enter your node.js callback URL (typically _http://node.example.com/auth/drupal/callback_)
    - On _Application context_, select the context created above
* Go back to `user/1/oauth/consumer` and click _Edit_ on the new consumer to view the consumer Key and Secret.

## Credits

This module is developed by [Victor Kareh](http://github.com/vkareh) and is
heavily based on work by [Jared Hanson](http://github.com/jaredhanson)

## License

(The MIT License)

Copyright (c) 2011 Victor Kareh

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
