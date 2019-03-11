const fs = require('fs');

module.exports = function (logs) {
    return new Promise(function (resolve, reject) {
        fs.writeFile("./logs/" + Date.now() + ".json", JSON.stringify(logs), { flag: 'w' }, function (err) {
            if (err) reject(err);
            else resolve(logs);
        });
    })
}