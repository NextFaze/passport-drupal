var util = require('util')
var Mock = require('chance');
var DrupalStrategy = require('./strategy');

let mock = new Mock();
/**
 * Mock A
 */
function MockStrategy (options, verify) {
    this._verify = verify;
    Strategy.call(this);
}

util.inherits(MockStrategy, DrupalStrategy);

module.exports = MockStrategy;