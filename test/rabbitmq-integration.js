var assert = require('assert');
var config = require('../config/dev.js')
var rabbitsender = require('../src/rabbit-sender.js')(config);
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});




describe('Integration Tests', function () {
    describe('Sends message to rabbit', function () {
        it('should post a log to rabbit, i be flaky', (done) => {
            var messages = [{ "Message1": "Test" }, 'Hello World!', 'Hello World2!'];
            rabbitsender(messages)
            .then(function () { return console.log("success") })
            .then(assert.ok(true))
            .then(function(){done()})
        });
    });
});