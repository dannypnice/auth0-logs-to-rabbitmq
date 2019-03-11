const rabbitconfig = require('../config/rabbit-dev.js')
const clientdetails = require('../localscripts/personal-client-details.js')

const auth0Retriever = require('./auth0-retriever.js')(clientdetails)
const auth0Token = require('./auth0-token.js')(clientdetails)
const rabbitsender = require('./rabbit-sender.js')(rabbitconfig);

auth0Token
.then(auth0Retriever)
.then (rabbitsender)
.catch(function(error){
    console.log(error);
})
