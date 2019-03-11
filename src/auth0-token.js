var https = require('https');

module.exports = function (clientdetails) {

    var postData = JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientdetails.id,
        client_secret: clientdetails.secret,
        audience: 'https://' + clientdetails.url + '/api/v2/'
    });

    var options = {
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
        var req = https.request(options, (res) => {
            res
                .on('data', (d) => {
                    response += d;
                })
                .on('end', () => {
                    var responseObject = JSON.parse(response);
                    resolve(responseObject.access_token);
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