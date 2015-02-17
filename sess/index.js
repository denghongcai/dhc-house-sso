/**
 * Created by dhc on 15-2-12.
 */

var sessions = require('./sessions')
    ,uuid = require('node-uuid')
    ,config = require('../config');

var verify = function(token) {
    var sessArray = sessions.find({token: token});
    if(sessArray.length > 0){
        var session = sessArray[0];
        if(session.expireTime < new Date().getTime()) {
            remove(token);
            return null;
        }
        else {
            var expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + config.sess.holdtime);
            session.expireAt = expireTime.getTime();
            session.update(session);
            return session;
        }
    }
    else {
        return null;
    }
};

exports.verify = verify;

var add = function(sessData) {
    return sessions.insert({
        token: uuid.v1(),
        data: sessData,
        createAt: new Date().getTime(),
        expireAt: new Date().getTime()
    }).token;
};

exports.add = add;

var remove = function(token) {
    return sessions.removeWhere({token: token});
};

exports.remove = remove;
