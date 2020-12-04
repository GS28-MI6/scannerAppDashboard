import React, { Component, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Header from "./components/layout/Header";
import Login from "./login";
import Stadistics from "./Stadistics";
import UserList from "./UserList";
import WebApp from "./WebApp";
// eslint-disable-next-line no-unused-vars
import "./App.css";
import { Provider } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import store from "./store";
import { connect } from "react-redux";
import io from "socket.io-client";
import jwtDecode from "jwt-decode";
import UIfx from "uifx";
import bellAudio from "./resources/Alert.mp3";

library.add(fas, fab);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.token !== undefined ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const PrivateRouteManual = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.token !== undefined ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login_ingreso_manual",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const socket = io("http://18.230.143.84:4000", {
  transports: ["websocket", "polling"]
});

class App extends Component {
  constructor(props) {
    super(props);
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.bell = new UIfx(bellAudio);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    socket.on("alerta_enviada", datosAlerta => {
      console.log("alerta fking emitida!!!!!!");
      console.log(datosAlerta);
      var input = document.getElementById("myInput");
      input.click();
    });
    socket.on("alerta_mapa", () => {
      console.log("alerta fking emitida!!!!!!");
      // const eventData = JSON.parse(event.data)
      this.props.fetchPosts();
    });
    // this.mapAlert.onmessage = event => {
    //   const eventData = JSON.parse(event.data)
    //   this.props.fetchPosts()
    // }
    socket.on("mapa_actualizado", datosAlerta => {
      console.log("mapa fking actualizado!!!!!!");
      console.log(datosAlerta);
      this.props.fetchPosts();
    });
    if (localStorage.token !== undefined) {
      const token = localStorage.token;
      var decode = jwtDecode(token);
      socket.on("connect", () => {
        console.log("im inside connect");
        socket.emit("username", decode.email);
      });
    }

    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    var heightHolder = window.innerHeight - 50;
    this.stateheight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
  }
  handleClick() {
    const bell = new UIfx(bellAudio);
    bell.play(0.3);
  }

  // getData(dataFound) {
  //   var test = dataFound;
  //   this.setState({alertDataHolder:test})
  // }

  render() {
    let node;
    console.log(localStorage);
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <div style={{ height: this.stateHeight.height }}>
              <Header />
              <input
                onClick={this.handleClick}
                ref={input => (this.inputElement = input)}
                id="myInput"
                style={{
                  width: "0",
                  height: "0",
                  border: "0",
                  position: "absolute"
                }}
              />
              <PrivateRoute exact path="/" component={WebApp} />
              <PrivateRoute exact path="/ingreso" component={WebApp} />
              <PrivateRoute exact path="/stadistics" component={Stadistics} />
              <PrivateRoute exact path="/lists/productos" component={UserList} />
              <Route path="/login" render={props => <Login />} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.posts.currentUser
});

export default connect(mapStateToProps, null )(App);
