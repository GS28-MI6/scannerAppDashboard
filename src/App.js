import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/login";
import Stadistics from "./components/Stadistics";
// eslint-disable-next-line no-unused-vars
import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import store from "./store";
import { connect } from "react-redux";
import io from "socket.io-client";
import jwtDecode from "jwt-decode";
import Ventas from "./components/Ventas";
import Agregar from "./components/Agregar";
import Productos from "./components/Productos";

library.add(fas, fab);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.token !== undefined ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const socket = io("http://18.230.143.84:4000", {
  transports: ["websocket", "polling"],
});

class App extends Component {
  componentDidMount() {
    if (localStorage.token !== undefined) {
      const token = localStorage.token;
      var decode = jwtDecode(token);
      socket.on("connect", () => {
        socket.emit("username", decode.email);
      });
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Header />
            <Switch>
              <PrivateRoute exact path="/" component={Ventas} />
              <PrivateRoute exact path="/ingreso" component={Agregar} />
              <PrivateRoute exact path="/stadistics" component={Stadistics} />
              <PrivateRoute
                exact
                path="/lists/productos"
                component={Productos}
              />
              <Route exact path="/login" component={Login} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.posts.currentUser,
});

export default connect(mapStateToProps, null)(App);
