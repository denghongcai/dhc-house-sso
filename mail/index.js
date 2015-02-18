var config = require('../config')
    ,log = require('../log')
    ,events = require('events')
    ,nodemailer = require('nodemailer')
    ,mailgunTransport = require('nodemailer-mailgun-transport');

var transport = nodemailer.createTransport(
    mailgunTransport(config.mail.options)
);

var emitter = new events.EventEmitter();

emitter.on('send', function(mailOptions){
    mailOptions.from = config.mail.from;
    transport.sendMail(mailOptions, function(err, info){
        if(err) {
            log.error(err);
        }
        else {
            log.info('E-mail sent: ', info);
        }
    });
});

module.exports = emitter;
