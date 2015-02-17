(function () {
    var React = require('react'),
        injectTapEventPlugin = require("react-tap-event-plugin"),
        Login = require('./components/login.jsx'), // Login component
        Register = require('./components/register.jsx'), // Register component
        PreActive = require('./components/preactive.jsx'),
        Active = require('./components/active.jsx'),
        Router = require('react-router'),
        Route = Router.Route,
        RouteHandler = Router.RouteHandler,
        DefaultRoute = Router.DefaultRoute,
        NotFoundRoute = Router.NotFoundRoute;

    //Needed for React Developer Tools
    window.React = React;

    //Needed for onTouchTap
    //Can go away when react 1.0 release
    //Check this repo:
    //https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    var App = React.createClass({
        render: function() {
            return (
                <RouteHandler key="name" {...this.props}/>
            )
        }
    });

    var routes = (
        <Route path="/" handler={App}>
            <Route name="login/:redirectURL" handler={Login}/>
            <Route name="register" handler={Register}/>
            <Route name="preactive/:uid" handler={PreActive}/>
            <Route name="active/:activeID" handler={Active}/>
            <DefaultRoute handler={Login}/>
        </Route>
    );

    Router.run(routes, function(Handler, state){
        var params = state.params;
        React.render(<Handler params={params}/>, document.body);
    })
})();