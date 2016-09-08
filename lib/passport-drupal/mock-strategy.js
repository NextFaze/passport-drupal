var util = require('util')
var Strategy = require('passport-strategy');

function MockStrategy (options, verify) {
    this._verify = verify;
    Strategy.call(this);
}

util.inherits(MockStrategy, Strategy);

MockStrategy.prototype.authenticate = function(req, options) {
    this._verify(req, 'token', 'tokenSecret', {}, {}, true);
}
MockStrategy.prototype.userProfile = function(token, tokenSecret, params, done) {
    debugger
    done(null, {displayName: 'Paul Robinson'})
}

module.exports = MockStrategy;