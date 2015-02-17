/**
 * Created by dhc on 15-2-16.
 */

var validator = require('validator');

exports.fullnameValidator = function(value) {
    if( value.length > 32)
        return 'Must less than 32 characters.';
    else if(value.length === 0) {
        return 'This field is required.';
    }
    else {
        return '';
    }
};

exports.emailValidator = function(value) {
    if( value.length > 320)
        return 'Must less than 320 characters.';
    else if(value.length === 0) {
        return 'This field is required.';
    }
    else if(validator.isEmail(value)) {
        return '';
    }
    else {
        return 'Invalid E-mail address.';
    }
};

exports.passwordValidator = function(value) {
    if( value.length > 42)
        return 'Must less than 42 characters.';
    else if(value.length === 0) {
        return 'This field is required.'
    }
    else {
        return '';
    }
};
