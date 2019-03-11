const https = require('https');

module.exports = function (clientdetails) {
    let _clientdetails = clientdetails;
    return function (token) {
        return new Promise(function (resolve, reject) {
            let options = {
                hostname: _clientdetails.url,
                port: 443,
                path: '/api/v2/logs?' + 'from=90020190307161110316936377421990542364809456317487906818',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            };

            let req = https.request(options, (res) => {
                let response = '';
                console.log(res.statusCode)
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
        })
    }
}


