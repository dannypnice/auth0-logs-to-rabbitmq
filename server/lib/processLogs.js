const amqp = require('amqplib');

const async = require('async');
const moment = require('moment');
const loggingTools = require('auth0-log-extension-tools');

const config = require('../lib/config');
const logger = require('../lib/logger');

module.exports = (storage) =>
    (req, res, next) => {
        const wtBody = (req.webtaskContext && req.webtaskContext.body) || req.body || {};
        const wtHead = (req.webtaskContext && req.webtaskContext.headers) || {};
        const isCron = (wtBody.schedule && wtBody.state === 'active') || (wtHead.referer === `${config('AUTH0_MANAGE_URL')}/` && wtHead['if-none-match']);

        if (!isCron) {
            return next();
        }

        const now = Date.now();

        let uriconfig = {
            hostname: config('RABBITMQ_URI_HOSTNAME'),
            protocol: config('RABBITMQ_URI_PROTOCOL'),
            port: config('RABBITMQ_URI_PORT'),
            username: config('RABBITMQ_URI_USER'),
            password: config('RABBITMQ_URI_PASSWORD'),
            locale: config('RABBITMQ_URI_LOCALE'),
            frameMax: config('RABBITMQ_URI_FRAMEMAX'),
            heartbeat: config('RABBITMQ_URI_HEARTBEAT'),
            vhost: config('RABBITMQ_URI_VHOST')
        };

        let exchangename = config('RABBITMQ_EXCHANGE_NAME');
        let routingkey = config('RABBITMQ_ROUTINGKEY');
        let exchangetype = config('RABBITMQ_EXCHANGE_TYPE');
        let exchangedurability = config('RABBITMQ_EXCHANGE_DURABILITY');

        const sendLog = async function (log, callback) {
            if (!log) {
                return callback();
            }

            const data = {
                post_date: now,
                type_description: loggingTools.logTypes.get(log.type)
            };

            Object.keys(log).forEach((key) => {
                data[key] = log[key];
            });

            data.message = JSON.stringify(log);

            const connection = await amqp.connect(uriconfig);
            const channel = await connection.createChannel();
            await channel.assertExchange(exchangename, exchangetype, { durable: exchangedurability });
            await channel.publish(exchangename, routingkey, Buffer.from(message));
            await channel.close();
            await connection.close();
        };


        const onLogsReceived = (logs, callback) => {
            if (!logs || !logs.length) {
                return callback();
            }

            logger.info(`Sending ${logs.length} logs to RabbitMQ.`);

            async.eachLimit(logs, 10, sendLog, callback);
        };

        const slack = new loggingTools.reporters.SlackReporter({ hook: config('SLACK_INCOMING_WEBHOOK_URL'), username: 'auth0-logs-to-rabbitmq', title: 'Logs To RabbitMQ' });

        const options = {
            domain: config('AUTH0_DOMAIN'),
            clientId: config('AUTH0_CLIENT_ID'),
            clientSecret: config('AUTH0_CLIENT_SECRET'),
            batchSize: parseInt(config('BATCH_SIZE'), 10),
            startFrom: config('START_FROM'),
            logTypes: config('LOG_TYPES'),
            logLevel: config('LOG_LEVEL')
        };

        if (!options.batchSize || options.batchSize > 100) {
            options.batchSize = 100;
        }

        if (options.logTypes && !Array.isArray(options.logTypes)) {
            options.logTypes = options.logTypes.replace(/\s/g, '').split(',');
        }

        const auth0logger = new loggingTools.LogsProcessor(storage, options);

        const sendDailyReport = (lastReportDate) => {
            const current = new Date();

            const end = current.getTime();
            const start = end - 86400000;
            auth0logger.getReport(start, end)
                .then(report => slack.send(report, report.checkpoint))
                .then(() => storage.read())
                .then((data) => {
                    data.lastReportDate = lastReportDate;
                    return storage.write(data);
                });
        };

        const checkReportTime = () => {
            storage.read()
                .then((data) => {
                    const now = moment().format('DD-MM-YYYY');
                    const reportTime = config('DAILY_REPORT_TIME') || 16;

                    if (data.lastReportDate !== now && new Date().getHours() >= reportTime) {
                        sendDailyReport(now);
                    }
                })
        };

        return auth0logger
            .run(onLogsReceived)
            .then(result => {
                if (result && result.status && result.status.error) {
                    slack.send(result.status, result.checkpoint);
                } else if (config('SLACK_SEND_SUCCESS') === true || config('SLACK_SEND_SUCCESS') === 'true') {
                    slack.send(result.status, result.checkpoint);
                }
                checkReportTime();
                res.json(result);
            })
            .catch(err => {
                slack.send({ error: err, logsProcessed: 0 }, null);
                checkReportTime();
                next(err);
            });
    };
