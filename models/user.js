/**
 * Created by dhc on 15-2-13.
 */

var models = require('../storage/models')
    ,bcrypt = require('bcrypt');

exports.Validate = function(data, cb) {
    models.Users.findOne({
        where: {
            email: data.email
        }
    }).complete(function(err, user){
        if(!!err) {
            cb(err);
        }
        else if(!user) {
            cb('not found');
        }
        else {
            bcrypt.compare(data.password, user.password, function(err, res){
                res ? cb(undefined, user) : cb(err);
            });
        }
    });
};

exports.Get = function(data, cb) {
    models.Users.findOne({
        where: {
            uid: data.uid
        }
    }).complete(function(err, user){
        if(!!err) {
            cb(err);
        }
        else if(!user) {
            cb('not found');
        }
        else {
            cb(undefined, user);
        }
    });
};

exports.Active = function(data, cb) {
    models.UserActiveCredentials.findOne({
        where: {
            activeID: data.activeID
        }
    }).complete(function(err, credential){
        if(!!err) {
            cb(err);
        }
        else if(!credential) {
            cb('not found');
        }
        else {
            var expiredAt = (new Date(credential.updatedAt));
            expiredAt.setDate(expiredAt.getDate() + 3);
            if(expiredAt.getTime() > new Date().getTime()) {
                models.Users.findOne({
                    where: {
                        uid: credential.uid
                    }
                }).complete(function (err, user) {
                    if (!!err) {
                        cb(err);
                    }
                    else if (!credential) {
                        cb('not found');
                    }
                    else {
                        user.active = true;
                        user.save().then(function () {
                            cb(undefined);
                        }).catch(function (err) {
                            cb(err)
                        });
                    }
                });
            }
            else {
                cb('expired');
            }
        }
    });
};

exports.Preactive = function(data, cb) {
    models.Users.findOne({
        where: {
            uid: data.uid
        }
    }).complete(function(err, user){
        if(!!err) {
            cb(err);
        }
        else if(!user) {
            cb('not found');
        }
        else {
            user.getActiveCredential().then(function(credential){
                if(credential !== null) {
                    var expiredAt = (new Date(credential.updatedAt));
                    expiredAt.setTime(expiredAt.getTime() + 60000);
                    if (expiredAt.getTime() < new Date().getTime()) {
                        credential.updatedAt = new Date();
                        user.setActiveCredential(credential).then(function () {
                            cb(undefined, credential.activeID);
                        });
                    }
                    else {
                        cb('retry');
                    }
                }
                else {
                    models.UserActiveCredentials.create({}).then(function (credential) {
                        user.setActiveCredential(credential).then(function () {
                            cb(undefined, credential.activeID);
                        });
                    });
                }
            });
        }
    });
};

exports.Create = function(data, cb) {
    models.Users.create({
        fullname: data.fullname,
        email: data.email,
        password: bcrypt.hashSync(data.password, 8),
        originIP: data.ip
    }).then(function(instance){
        cb(undefined, instance.uid);
    }).catch(function(err){
        cb(err);
    });
};
