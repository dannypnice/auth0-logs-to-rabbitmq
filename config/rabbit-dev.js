module.exports = {
    uri: {
        hostname: process.env.RABBITMQ_URI_HOSTNAME || "localhost",
        protocol: process.env.RABBITMQ_URI_PROTOCOL || "amqp",
        port: process.env.RABBITMQ_URI_PORT || 5672,
        username: process.env.RABBITMQ_URI_USER || "guest",
        password: process.env.RABBITMQ_URI_PASSWORD || "guest",
        locale: process.env.RABBITMQ_URI_LOCALE || "en_US",
        frameMax: process.env.RABBITMQ_URI_FRAMEMAX || 0,
        heartbeat: process.env.RABBITMQ_URI_HEARTBEAT || 0,
        vhost: process.env.RABBITMQ_URI_VHOST || "/",
    },
    exchange: {
        name: process.env.RABBITMQ_EXCHANGE_NAME || "amq.direct",
        routingkey: process.env.RABBITMQ_EXCHANGE_ROUTINGKEY || "",
        type: process.env.RABBITMQ_EXCHANGE_TYPE || 'direct',
        durability: process.env.RABBITMQ_EXCHANGE_DURABILITY || 'true',
    }
}