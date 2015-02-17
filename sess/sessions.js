/**
 * Created by dhc on 15-2-12.
 */

var loki = require('lokijs');

var db = new loki('session.loki');

var sessions = db.addCollection('sessions', {indices: 'updateAt'});

module.exports = sessions;