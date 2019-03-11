var https = require('https');

module.exports = function (clientdetails) {
    _clientdetails = clientdetails;
    return function (token) {
        return new Promise(function (resolve, reject) {
            var options = {
                hostname: _clientdetails.url,
                port: 443,
                path: '/api/v2/logs?' + 'from=90020190307161110316936377421990542364809456317487906818',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            };

            var req = https.request(options, (res) => {
                let response = '';
                res
                    .on('data', (d) => {
                        response += d;
                    })
                    .on('end', () => {
                        var responseObject = JSON.parse(response);
                        resolve(responseObject);
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


