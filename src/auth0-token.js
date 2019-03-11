const https = require('https');

module.exports = function (clientdetails) {

    let postData = JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientdetails.id,
        client_secret: clientdetails.secret,
        audience: 'https://' + clientdetails.url + '/api/v2/'
    });

    let options = {
        hostname: clientdetails.url,
        port: 443,
        path: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };
    return new Promise(function (resolve, reject) {
        let response = '';
        let req = https.request(options, (res) => {
            res
                .on('data', (d) => {
                    response += d;
                })
                .on('end', () => {
                    if (res.statusCode != 200) {
                        reject("Token response was not 200, response was: " + response)
                    }
                    else {
                        let responseObject = JSON.parse(response);
                        resolve(responseObject.access_token);
                    }
                });
        });


        req.on('error', (error) => {
            console.error(error);
            reject(error)
        });

        req.write(postData);
        req.end();
    })
}