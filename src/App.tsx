import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Header from "./features/Header";
import Login from "./features/Login";
//import Stadistics from "./features/Stadistics";
//import UserList from "./features/UserList";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider, connect } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { store } from "./app/store";
//import Ventas from "./features/Ventas";
//import Agregar from "./features/Agregar";

library.add(fas, fab);

const PrivateRoute = ({ component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
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
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Header />
          <Switch>
            {/* <PrivateRoute exact path="/" component={Ventas} />
            <PrivateRoute exact path="/ingreso" component={Agregar} />
            <PrivateRoute exact path="/estadisticas" component={Stadistics} />
            <PrivateRoute exact path="/productos" component={UserList} /> */}
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.posts.currentUser,
});

export default connect(mapStateToProps, null)(App);
