/**
 * Created by dhc on 15-2-9.
 */

var fs = require('fs')
    ,express = require('express')
    ,path = require('path')
    ,favicon = require('serve-favicon')
    ,logger = require('morgan')
    ,bodyParser = require('body-parser')
    ,helmet = require('helmet')
    ,https = require('https')
    ,log = require('./log')
    ,routes = require('./routes')
    ,models = require('./storage/models')
    ,config = require('./config');

var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Security middleware
app.use(helmet.xssFilter()); // X-XSS-Protection
app.use(helmet.frameguard('sameorigin')); // X-Frame
app.use(helmet.hsts({maxAge: 1})); // HSTS
app.use(helmet.noSniff()); // don't infer the MIME type
app.use(helmet.noCache()); // disable cache but retain ETag

// Middleware for block legacy IE
app.use(function(req, res, next){
    var version = -1;
    var ua = req.headers['user-agent'];
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if(re.exec(ua) != null)
        version = parseFloat(RegExp.$1);
    if(version > -1) {
        if(version < 9) {
            res.redirect('http://outdatedbrowser.com/cn');
        }
    }
    next();
});

routes(app);

app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res){
    res.status(err.status || 500);
    res.end(err.message);
});

app.set('port', config.port);
app.set('x-powered-by', false); // disable 'x-powered-by' in header

var privateKey = fs.readFileSync(path.join(__dirname, 'certs/privatekey.pem'));
var certificate = fs.readFileSync(path.join(__dirname, 'certs/certificate.pem'));
var ca = fs.readFileSync(path.join(__dirname, 'certs/ca.pem'));

var server = https.createServer({
    key: privateKey,
    cert: certificate,
    ca: ca
}, app);

models.sequelize.sync().then(function(){
    server.listen(config.port)
});

server.on('error', function(err){
    if(err.syscall !== 'listen') {
        throw err;
    }
    switch (err.code) {
        case 'EACCES':
            log.error(config.port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(config.port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', function(){
    var addr = server.address();
    log.info('Listening on ' + addr.port);
});
