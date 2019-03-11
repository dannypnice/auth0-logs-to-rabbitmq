const https = require('https');

let _clientdetails;
let _token;
let _logCheckpoint;

module.exports = function (clientdetails) {
    _clientdetails = clientdetails;
    return function (token, logCheckpoint) {
        _logCheckpoint = logCheckpoint
        _token = token;
        return new Promise(getLogs)
    }
}


function getLogs(resolve, reject) {
    let options = {
        hostname: _clientdetails.url,
        port: 443,
        path: '/api/v2/logs?' + 'from=' + _logCheckpoint,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token
        }
    };

    let req = https.request(options, (res) => {
        console.log(req);
        let response = '';
        res
            .on('data', (d) => {
                response += d;
            })
            .on('end', () => {
                if (res.statusCode != 200) {
                    reject("Log retrieve response was not 200, response was: " + response)
                }
                else {
                    let responseObject = JSON.parse(response);
                    resolve(responseObject);
                }
            });
    })

    req.on('error', (error) => {
        console.error(error);
        reject(error)
    });

    req.end();
}