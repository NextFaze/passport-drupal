var util = require('util')
var Strategy = require('passport-strategy');

function MockStrategy (options, verify) {
    this._verify = verify;
    Strategy.call(this);
}

util.inherits(CustomStrategy, Strategy);

CustomStrategy.prototype.authenticate = function(req, options) {
    this._verify_verify(req, 'token', 'tokenSecret', {}, {}, true);
}