/**
 * Module dependencies.
 */
var DrupalStrategy = require('./strategy');
var MockStrategy = require('./mock-strategy');

/**
 * Expose `DrupalStrategy` directly from package.
 */
exports = module.exports = DrupalStrategy;

/**
 * Export constructors.
 */
exports.DrupalStrategy = DrupalStrategy;
exports.MockStrategy = MockStrategy;
