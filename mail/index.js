var config = require('../config')
    ,log = require('../log')
    ,events = require('events')
    ,nodemailer = require('nodemailer')
    ,smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(
    smtpTransport(config.mail.options)
);

var emitter = new events.EventEmitter();

emitter.on('send', function(mailOptions){
    mailOptions.from = config.mail.from;
    transport.sendMail(mailOptions, function(err, info){
        if(err) {
            log.error(err);
        }
        else {
            log.info('E-mail sent: ', info.response);
        }
    });
});

module.exports = emitter;
