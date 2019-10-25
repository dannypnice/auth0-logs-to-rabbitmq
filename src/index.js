const rabbitconfig = require('../config/rabbit-dev.js')
const clientdetails = require('../localscripts/personal-client-details.js')

const logcheckpoint = require('./file-logcheckpoint');
const auth0Retriever = require('./auth0-retriever.js')(clientdetails)
const auth0Token = require('./auth0-token.js')(clientdetails)
const rabbitsender = require('./rabbit-sender.js')(rabbitconfig);
const filesender = require('./file-sender.js');
let _logCheckpoint = "90020190311161036399142550165864073177670012189666181122";

auth0Token
    .then(token => auth0Retriever(token, _logCheckpoint))
    .then(rabbitsender)
    .then(filesender)
    .catch(function (error) {
        console.log(error);
    })

logcheckpoint.getCheckpoint("./src/filecheckpoint")
