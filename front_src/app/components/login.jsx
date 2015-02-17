var React = require('react'),
    Link = require('react-router').Link,
    mui = require('material-ui'),
    $ = require('zepto-browserify').$,
    utilities = require('../utilities'),
    TextField = mui.TextField,
    RaisedButton = mui.RaisedButton,
    Checkbox = mui.Checkbox;

var Main = React.createClass({

    getInitialState: function() {
        return {
            usernameErrText: '',
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
                        errorText: this.state.emailErrText,
                        floatingLabelText: "E-mail",
                        onChange: this.handleEmailErrorInputChange,
                        ref: 'emailInput'
                    }),
                    React.createElement(TextField, {
                        hintText: "Input here.",
                        errorText: this.state.passwordErrText,
                        floatingLabelText: "Password",
                        type: "password",
                        onChange: this.handlePasswordErrorInputChange,
                        ref: 'passwordInput'
                    }),
                    React.createElement(Checkbox, {
                        value: "remember",
                        label: "Remember me",
                        defaultChecked: true,
                        className: 'remember-checkbox',
                        ref: 'rememberCheck'
                    }),
                    React.createElement("div", {className: "login-register-btn-group"},
                        React.createElement(RaisedButton, {
                            className: "enlarge-btn",
                            label: "Login",
                            primary: true,
                            disabled: !this.state.submitBtnStatus,
                            onClick: this.handleSubmit
                        })
                    ),
                    React.createElement("div", {className: "login-footer"},
                        //React.createElement("p", {className: "clearfix"},
                        //    React.createElement(Link, {to: "forgot-password"}, "forgot your password?")
                        //),
                        React.createElement("p", {className: "clearfix"},
                            React.createElement(Link, {to: "register"}, "Want to register?")
                        )
                    )
                )
            )
        )
    },

    handleEmailErrorInputChange: function(e) {
        this.setState({
            usernameErrText: utilities.emailValidator.call(this, e.target.value)
        });
    },

    handlePasswordErrorInputChange: function(e) {
        this.setState({
            passwordErrText: utilities.passwordValidator.call(this, e.target.value)
        });
    },

    handleSubmit: function() {
        var email = this.refs.emailInput.getValue();
        var password = this.refs.passwordInput.getValue();
        var remember = this.refs.rememberCheck.isChecked();
        var redirectURL = decodeURIComponent(this.props.params.redirectURL);
        redirectURL = redirectURL !== 'undefined' ? redirectURL : '';
        if(email && password) {
            $.ajax({
                type: 'post',
                url: './auth/login',
                data: JSON.stringify({
                    email: email,
                    password: password,
                    remember: remember,
                    redirectURL: redirectURL
                }),
                contentType: 'application/json',
                beforeSend: function() {
                    this.setState({
                        submitBtnStatus: false
                    })
                }.bind(this),
                success: function(data, status, xhr) {
                    location.href = data.redirectURL;
                }.bind(this),
                error: function() {
                    this.setState({
                        passwordErrText: 'Check your password.'
                    })
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