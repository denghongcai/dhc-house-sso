/**
 * Created by dhc on 15-2-9.
 */

var auth = require('./controllers/auth');
var user = require('./controllers/user');

module.exports = function(app){
    app.use('/auth', auth);
    app.use('/user', user);
};
