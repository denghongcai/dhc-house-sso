var React = require('react'),
    mui = require('material-ui'),
    $ = require('zepto-browserify').$,
    RaisedButton = mui.RaisedButton;

var Main = React.createClass({

    getInitialState: function() {
        return {
            submitBtnText: 'Send',
            submitBtnStatus: true
        }
    },

    render: function() {

        return (
            React.createElement("div", {className: "active-page"},
                React.createElement("div", {className: "login-register-active-panel"},
                    React.createElement("h4", null, "To send an activation E-mail"),
                    React.createElement("h5", null, "Press the button"),
                    React.createElement(RaisedButton, {
                        className: "enlarge-btn",
                        label: this.state.submitBtnText,
                        primary: true,
                        disabled: !this.state.submitBtnStatus,
                        onClick: this.handleSubmit
                    })
                )
            )
        )
    },

    handleSubmit: function() {
        var uid = this.props.params.uid;
        $.ajax({
            type: 'post',
            url: './user/preactive',
            data: JSON.stringify({
                uid: uid
            }),
            contentType: 'application/json',
            beforeSend: function() {
                this.submitTimer = setTimeout(function(){
                    this.setState({
                        submitBtnText: 'Send',
                        submitBtnStatus: true
                    })
                }.bind(this), 60000);
                this.setState({
                    submitBtnStatus: false
                });
            }.bind(this),
            success: function(data) {
                if(data.err) {
                    this.setState({
                        submitBtnText: data.err
                    })
                }
                else {
                    this.setState({
                        submitBtnText: 'Sent'
                    })
                }
            }.bind(this),
            error: function() {
                clearTimeout(this.submitTimer);
                this.setState({
                    submitBtnStatus: true
                })
            }.bind(this)
        })
    }

});

module.exports = Main;
