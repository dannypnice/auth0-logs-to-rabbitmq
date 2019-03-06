var assert = require('assert');
var rabbitsender = require('../src/index.js')
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});




describe('Integration Tests', function () {
    describe('Sends message to rabbit', function () {
        it('should post a log to rabbit, i be flaky', function () {
            console.log(rabbitsender);
            rabbitsender({ test: "message" }, null)
        });
    });
});