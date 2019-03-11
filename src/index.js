var rabbitconfig = require('../config/rabbit-dev.js')
var clientdetails = require('../localscripts/personal-client-details.js')

var auth0Retriever = require('./auth0-retriever.js')(clientdetails)
var auth0Token = require('./auth0-token.js')(clientdetails)
var rabbitsender = require('./rabbit-sender.js')(rabbitconfig);

auth0Token
.then(auth0Retriever)
.then (rabbitsender)