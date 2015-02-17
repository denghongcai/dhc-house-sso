var React = require('react'),
    mui = require('material-ui'),
    $ = require('zepto-browserify').$,
    utilities = require('../utilities'),
    TextField = mui.TextField,
    RaisedButton = mui.RaisedButton;

var Main = React.createClass({

    getInitialState: function() {
        return {
            fullnameErrText: '',
            emailErrText: '',
            passwordErrText: '',
            submitBtnStatus: true
        }
    },

    render: function() {

        return (
            React.createElement("div", {className: "login-register-page"},
                React.createElement("div", {className: "login-register-active-panel"},
                    React.createElement(TextField, {
                        hintText: "Input here.",
                        errorText: this.state.fullnameErrText,
                        floatingLabelText: "Full Name",
                        onChange: this.handleFullnameErrorInputChange,
                        ref: 'fullnameInput'
                    }),
                    React.createElement(TextField, {
                        hintText: "Input here.",
                        errorText: this.state.emailErrText,
                        floatingLabelText: "E-mail",
                        onChange: this.handleEmailErrorInputChange,
                        ref: 'emailInput'
                    }),
                    React.createElement(TextField, {
                        hintText: "Input here.",
                        errorText: this.state.passwordErrText,
                        floatingLabelText: "Password",
                        onChange: this.handlePasswordErrorInputChange,
                        ref: 'passwordInput'
                    }),
                    React.createElement("div", {className: "login-register-btn-group"},
                        React.createElement(RaisedButton, {
                            className: "enlarge-btn",
                            label: "Register",
                            primary: true,
                            disabled: !this.state.submitBtnStatus,
                            onClick: this.handleSubmit
                        })
                    )
                )
            )
        )
    },

    handleFullnameErrorInputChange: function(e) {
        this.setState({
            fullnameErrText: utilities.fullnameValidator.call(this, e.target.value)
        })
    },

    handleEmailErrorInputChange: function(e) {
        this.setState({
            emailErrText: utilities.emailValidator.call(this, e.target.value)
        });
    },

    handlePasswordErrorInputChange: function(e) {
        this.setState({
            passwordErrText: utilities.passwordValidator.call(this, e.target.value)
        });
    },

    handleSubmit: function() {
        var fullname = this.refs.fullnameInput.getValue();
        var email = this.refs.emailInput.getValue();
        var password = this.refs.passwordInput.getValue();
        if(email && password) {
            $.ajax({
                type: 'post',
                url: './user/register',
                data: JSON.stringify({
                    fullname: fullname,
                    email: email,
                    password: password
                }),
                contentType: 'application/json',
                beforeSend: function() {
                    this.setState({
                        submitBtnStatus: false
                    })
                }.bind(this),
                success: function(data) {
                    if(data.err) {
                        this.setState({
                            emailErrText: data.err
                        })
                    }
                    else {
                        location.href = '#preactive/' + data.uid;
                    }
                }.bind(this),
                complete: function() {
                    this.setState({
                        submitBtnStatus: true
                    })
                }.bind(this)
            })
        }
    }

});

module.exports = Main;
