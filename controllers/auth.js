/**
 * Created by dhc on 15-2-9.
 */
var express = require('express')
    ,router = express.Router()
    ,sess = require('../sess')
    ,cors = require('cors')
    ,user = require('../models/user')
    ,config = require('../config')
    ,url = require('url');

var corsOptions = {
    origin: function(origin, cb){
        cb(null, validateReferrer(url.parse(origin)));
    }
};

router.use(function(req, res, next){
    var referrer = req.get('Referrer') ? req.get('Referrer') : '';
    validateReferrer(url.parse(referrer)) ? next() : res.sendStatus(403);
});

router.get('/verify', cors(corsOptions), function(req, res){
    if(typeof req.query.token !== 'undefined') {
        var response = sess.verify(req.query.token);
        response ? res.json(response) : res.sendStatus(403);
    }
    else {
        res.sendStatus(401);
    }
});

router.get('/logout', cors(corsOptions), function(req, res){
    var redirectURL = req.query.redirectURL ? req.query.redirectURL : '';
    if(typeof req.body.token !== 'undefined') {
        sess.remove(req.query.token.toString());
        var urlObject = url.parse(redirectURL, true);
        if(validateReferrer(urlObject)) {
            res.redirect(url.format(urlObject));
        }
        else {
            res.sendStatus(403);
        }
    }
    else {
        res.sendStatus(401);
    }
});

router.use(function(req, res, next) {
    if(req.is('json')) {
        next();
    }
    else {
        res.sendStatus(406);
    }
});

router.post('/login', function(req, res){
    var redirectURL = req.body.redirectURL ? req.body.redirectURL : '';
    var urlObject = url.parse(redirectURL, true);
    if(validateReferrer(urlObject) || redirectURL === '') {
        user.Validate({
            email: req.body.email,
            password: req.body.password
        }, function(err, data){
            if(err)
                res.sendStatus(401);
            else {
                if(data.active === false) {
                    res.json({
                        redirectURL: '#preactive/' + data.uid
                    })
                }
                else if(data.active === true){
                    urlObject.query.token = sess.add(data);
                    res.json({
                        token: urlObject.query.token,
                        redirectURL: url.format(urlObject)
                    });
                }
            }
        });
    }
    else {
        res.sendStatus(403);
    }
});

function validateReferrer(urlObject) {
    var hostname = urlObject.hostname;
    return config.trust_url.some(function(element) {
        if(hostname === null)
            return false;
        else
            return hostname.match(element);
    });
}

module.exports = router;