const config = require('./config.js');
const amqp = require('amqplib');

let exchange = config.exchange.name;
let routingkey = config.exchange.routingkey;
let exchangetype = config.exchange.type;
let exchangedurability = config.exchange.durability;
let uriconfig = config.uri;

module.exports = async function (messages) {
    const connection = await amqp.connect(uriconfig);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, exchangetype, { durable: exchangedurability });
    await processMessages(messages, channel);
    await channel.close();
    await connection.close()
}

async function processMessages(messages, channel) {
    for (const position in messages) {
        var message = JSON.stringify(messages[position])
        channel.publish(exchange, routingkey, Buffer.from(message));
    }
}
