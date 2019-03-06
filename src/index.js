var rabbitsender = require ('./rabbit-sender.js')


var messages = [{"Message1":"Test"}, 'Hello World!', 'Hello World2!'];
rabbitsender(messages).then(function(){return console.log("success")})