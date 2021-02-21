import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Header from "./components/Header";
import Login from "./features/Login/Login";
//import Stadistics from "./features/Stadistics";
//import UserList from "./features/UserList";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import Loader from "./components/loader";
import Ventas from "./features/Ventas/Ventas";
//import Agregar from "./features/Agregar";
import { ReduxDispatch, useReduxDispatch } from "./app/store";
import axios from "axios";
import { useSelector } from "react-redux";
import { logout, tokenSelector } from "./features/Login/userSlice";

// Add a request interceptor
// To add token before calling API if token exists
function addRequestInterceptorAndDefaults() {
  //axios.defaults.headers["Accept"] = "application/json";
  //axios.defaults.headers["Content-Type"] = "application/json";
  return axios.interceptors.request.use(
    (config) => {
      /*const access_token = confStore.store.getState().user.token;
      if (access_token) {
        config.headers["Authorization"] = "Bearer " + access_token;
      }*/
      //config.headers["Content-Type"] = "application/json";
      config.baseURL = "http://177.71.157.129:4100";
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
}

// Temporary solution to fix CORS problem
function addResponseInterceptor(dispatch: ReduxDispatch) {
  axios.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (typeof error.response === "undefined") {
        console.log("Posible CORS");
        dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
}

library.add(fas, fab);

const PrivateRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const routeComponent = (props: any) =>
    isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/login" }} />
    );
  return <Route {...rest} render={routeComponent} />;
};

export default function App() {
  const dispatch = useReduxDispatch();
  const [loading, setLoading] = useState(false);
  const token = useSelector(tokenSelector);
  const isAuthenticated = token !== "";

  // Add necessary loaders for app here
  useEffect(() => {
    //initI18n().then((t) => {
    addRequestInterceptorAndDefaults();
    addResponseInterceptor(dispatch);
    /*loadOperationsTranslations(t);
      loadMovementStatusTranslations(t);
      loadUserTypesTranslations(t);*/
    setLoading(false);
    //});
  }, [dispatch]);
  return loading ? (
    <Loader loading={loading} />
  ) : (
    <BrowserRouter>
      <Header />
      <Switch>
        <PrivateRoute
          exact
          path="/"
          isAuthenticated={isAuthenticated}
          component={Ventas}
        />
        <PrivateRoute exact path="/" component={Ventas} />
        {/* <PrivateRoute exact path="/ingreso" component={Agregar} />
            <PrivateRoute exact path="/estadisticas" component={Stadistics} />
            <PrivateRoute exact path="/productos" component={UserList} /> */}
        <Route exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}
