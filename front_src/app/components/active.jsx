var React = require('react'),
    mui = require('material-ui'),
    $ = require('zepto-browserify').$;

var Main = React.createClass({

    getInitialState: function() {
        return {
            activeText: "Activating..."
        }
    },

    componentDidMount: function() {
        this.handleSubmit()
    },

    render: function() {

        return (
            React.createElement("div", {className: "active-page"},
                React.createElement("div", {className: "login-register-active-panel"},
                    React.createElement("h2",
                        {
                            className: "active-text"
                        }, this.state.activeText
                    )
                )
            )
        )
    },

    handleSubmit: function() {
        var activeID = this.props.params.activeID;
        $.ajax({
            type: 'post',
            url: './user/active',
            data: JSON.stringify({
                activeID: activeID
            }),
            contentType: 'application/json',
            success: function() {
                this.setState({
                    activeText: 'Activated'
                });
                setTimeout(function() {
                    location.href = '#/';
                }, 3000);
            }.bind(this),
            error: function() {
                this.setState({
                    activeText: 'Error'
                })
            }.bind(this)
        })
    }

});

module.exports = Main;
