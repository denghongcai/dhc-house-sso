var path = require('path');

var config = {
    tls: {
        privateKey: path.join(__dirname, 'certs/privatekey.pem'),
        certificate: path.join(__dirname, 'certs/certificate.pem'),
        ca: path.join(__dirname, 'certs/ca.pem')
    },
    db: {
        storage: './data.sqlite3',
        dialect: 'sqlite'

    },
    mail: {
        from: 'no-reply@xx.xx',
        options: {
            auth: {
                api_key: '',
                domain: 'xx.xx'
            }
        }
    },
    sess: {
        holdtime: 1
    },
    root_url: 'https://localhost:3000', // root url of your website
    trust_url: [/\.xx\.xx$/i, /localhost/i], // referrer you can trust
    port: 3000
};

module.exports = config;
