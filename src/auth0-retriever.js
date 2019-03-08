var request = require("request");
var getToken = require("./auth0-token.js");

function requestLog(token) {
      
    var options = {
        method: 'GET',
        url: 'https://slummock.eu.auth0.com/api/v2/logs',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        json: true,
        qs: {
            from: '90020190307161110316936377421990542364809456317487906818'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}


getToken.then(token => requestLog(token));