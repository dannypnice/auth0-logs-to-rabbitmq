const amqp = require('amqplib');

let exchangename;
let routingkey;
let exchangetype;
let exchangedurability;
let uriconfig;

module.exports = function (config) {
    exchangename = config.exchange.name;
    routingkey = config.exchange.routingkey;
    exchangetype = config.exchange.type;
    exchangedurability = config.exchange.durability;
    uriconfig = config.uri;

    return logToRabbit;
}

async function logToRabbit(messages) {
    const connection = await amqp.connect(uriconfig);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangename, exchangetype, { durable: exchangedurability });
    await publishMessages(messages, channel);
    await channel.close();
    await connection.close();
}

async function publishMessages(messages, channel) {
    for (const position in messages) {
        let message = JSON.stringify(messages[position]);
        channel.publish(exchangename, routingkey, Buffer.from(message));
    }
}
