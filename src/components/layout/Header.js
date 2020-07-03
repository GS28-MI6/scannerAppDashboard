import React, { Component } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  validateUser,
  usersNotification,
  countAlerts
} from "../../actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import io from "socket.io-client";
import "./header.css";

library.add(fas, fab);

const socket = io("http://18.230.143.84:4000", {
  transports: ["websocket", "polling"]
});

function logOut() {
  localStorage.removeItem("token");
  console.log(localStorage);
  window.location.href = "/login";
}

class Header extends Component {
  constructor(props) {
    super(props);
    // this.notifyUser = new EventSource("http://18.230.143.84:4000/events_users");
    this.props.validateUser();
    this.props.usersNotification();
  }

  componentDidMount() {
    // this.notifyUser.onmessage = event => {
    //   this.props.usersNotification()
    //   console.log("notifyUser")
    // };
    socket.on("usuario_registrado", datosAlerta => {
      console.log("usuario fking registrado!!!!!!");
      console.log(datosAlerta);
      this.props.usersNotification();
    });
  }

  render() {
    var { counted_users } = this.props.pendingUsers;
    if (this.props.currentUser !== undefined) {
      var { email, nombre_completo } = this.props.currentUser;
      return (
        <header className="header">
          <div className="links">
            <div
              className="button"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <FontAwesomeIcon
                icon="home"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  color: "white"
                }}
              />{" "}
              Inicio
            </div>
            <div
              className="button"
              onClick={() => {
                window.open('/stadistics', '_blank');
              }}
            >
              <FontAwesomeIcon
                icon="chart-bar"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  color: "white"
                }}
              />
              Graficos
            </div>
            <div
              className="button notiBtn"
              onClick={() => {
                window.open('/lists/productos', '_blank');
              }}
            >
              <div className="notification">
                <FontAwesomeIcon
                  icon="bell"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: "white"
                  }}
                />{" "}
                Usuarios
              </div>{" "}
            </div>
          </div>
          <div className="info">
            <div className="userInfo">
              <h3>{email}</h3>
              <h3>{nombre_completo}</h3>
            </div>
            <div className="logOut" onClick={() => logOut()}>
              <div>
                <FontAwesomeIcon
                  icon="power-off"
                  style={{ display: "flex", flexDirection: "row" }}
                />
              </div>
              <h3>Salir</h3>
            </div>
          </div>
        </header>
      );
    } else {
      return (
        <header
          className="header"
          style={{ padding: "0 10px", fontSize: "20px" }}
        >
          {" "}
          Login
        </header>
      );
    }
  }
}

// const headerStyle = {
//   display: "flex",
//   width: "100%",
//   height: "50px",
//   background: "#3fb0ac",
//   color: "#fff",
//   justifyContent: "flex-end",
//   alignItems: "center",
//   padding: "0 10px"
// };

const mapStateToProps = state => ({
  currentUser: state.posts.currentUser.decode,
  pendingUsers: state.posts.pendingUsers
});

export default connect(mapStateToProps, { validateUser, usersNotification })(
  Header
);
