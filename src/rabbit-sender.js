const config = require('./config.js');
const amqp = require('amqplib');

let exchange = config.exchange;
let routingkey = config.routingkey;
let uriconfig = config.uriconfig;

module.exports = async function (messages) {
    const connection = await amqp.connect(uriconfig);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'direct', { durable: true });
    await processMessages(messages, channel);
    await channel.close();
    await connection.close()
}

async function processMessages(messages, channel){
    for (const position in messages) {
        var message = JSON.stringify(messages[position])
        await channel.publish(exchange, routingkey, Buffer.from(message));
    }
}
