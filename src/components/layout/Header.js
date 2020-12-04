import React, { Component } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  validateUser
} from "../../actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "./header.css";

library.add(fas, fab);

function logOut() {
  localStorage.removeItem("token");
  console.log(localStorage);
  window.location.href = "/login";
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.props.validateUser();
  }


  render() {
    if (this.props.currentUser !== undefined) {
      var { email, usuario } = this.props.currentUser;
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
                Productos
              </div>{" "}
            </div>
          </div>
          <div className="info">
            <div className="userInfo">
              <h3>{email}</h3>
              <h3>{usuario}</h3>
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

export default connect(mapStateToProps, { validateUser })(
  Header
);
