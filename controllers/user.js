/**
 * Created by dhc on 15-2-14.
 */

var express = require('express')
    ,router = express.Router()
    ,validator = require('validator')
    ,log = require('../log')
    ,xss = require('xss')
    ,mail = require('../mail')
    ,config = require('../config')
    ,user = require('../models/user');

router.use(function(req, res, next) {
    if(req.is('json')) {
        next();
    }
    else {
        res.sendStatus(406);
    }
});

router.post('/register', function(req, res){
    var fullname = req.body.fullname ? xss(req.body.fullname) : '';
    var email = req.body.email;
    var password = req.body.password;
    if(typeof password !== 'undefined') {
        if(password.length < 42) {
            user.Create({
                fullname: fullname,
                email: email,
                password: password,
                ip: req.ip
            }, function(err, uid){
                if(err) {
                    log.debug(err);
                    res.json({
                        err: 'E-mail already exists.'
                    });
                }
                else {
                    res.status(201).json({
                        uid: uid
                    })
                }
            })
        }
        else {
            res.json({
                err: 'Password must less than 42 characters.'
            })
        }
    }
    else {
        res.json({
            err: 'Not a valid E-mail address.'
        })
    }
});

router.post('/preactive', function(req, res) {
    var uid;
    if(typeof req.body.uid !== 'undefined') {
        uid = req.body.uid;
        user.Get({uid: uid}, function(err, row){
            if(err)
                res.sendStatus(401);
            else {
                if(row.active === false) {
                    user.Preactive({
                        uid: uid
                    }, function(err, activeID){
                        if(err) {
                            log.error('Preactive err: ', err);
                            res.sendStatus(500);
                        }
                        else {
                            var mailOptions = {
                                to: row.email,
                                subject: 'Activation',
                                text: 'Thanks for register, ' +
                                'please using hyperlink followed to active your user.\n' +
                                config.root_url + '/#/active/' + activeID
                            };
                            mail.emit('send', mailOptions);
                            res.json({});
                        }
                    });
                }
                else
                    res.json({
                        err: 'Already activated.'
                    })
            }
        })
    }
    else {
        res.sendStatus(403);
    }
});

router.post('/active', function(req, res) {
    var activeID;
    if(typeof req.body.activeID !== 'undefined') {
        activeID = req.body.activeID;
        user.Active({activeID: activeID}, function(err){
            if(err)
                res.sendStatus(401);
            else {
                res.json({});
            }
        })
    }
    else {
        res.sendStatus(403);
    }
});

module.exports = router;
