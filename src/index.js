var config = require('../config/rabbit-dev.js')
var rabbitsender = require('./rabbit-sender.js')(config);


var messages = require('../test/data/testdata.js');
rabbitsender(messages).then(function(){return console.log("success")})