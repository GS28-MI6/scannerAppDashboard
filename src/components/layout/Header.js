import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { validateUser } from "../../actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "./header.css";
import { Nav, Navbar } from "react-bootstrap";

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
    return (
      <Navbar
        className="sticky-top"
        bg="dark"
        variant="dark"
        style={{ height: "5vh" }}
      >
        <Navbar.Brand className="align-items-center">My Business</Navbar.Brand>
        {this.props.currentUser && (
          <>
            <Nav className="mr-auto align-items-center">
              <Link to="/" className="d-flex align-items-center ml-4 nav-link">
                <FontAwesomeIcon icon="cash-register" className="mr-2" />
                Realizar Venta
              </Link>
              <Link
                to="/ingreso"
                className="d-flex align-items-center ml-4 nav-link"
              >
                <FontAwesomeIcon icon="plus" className="mr-2" />
                Añadir Producto
              </Link>
              <Link
                to="/stadistics"
                className="d-flex align-items-center ml-4 nav-link"
              >
                <FontAwesomeIcon icon="chart-bar" className="mr-2" />
                Estadística
              </Link>
              <Link
                to="/lists/productos"
                className="d-flex align-items-center ml-4 nav-link"
              >
                <FontAwesomeIcon icon="list" className="mr-2" />
                Lista de Productos
              </Link>
            </Nav>
            <Nav>
              <Navbar.Text className="mr-4">
                Usuario: {this.props.currentUser.usuario}
              </Navbar.Text>
              <a
                onClick={() => logOut()}
                style={{ cursor: "pointer" }}
                className="d-flex align-items-center"
              >
                Salir
                <FontAwesomeIcon icon="sign-out-alt" className="ml-2" />
              </a>
            </Nav>
          </>
        )}
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.posts.currentUser.decode,
  pendingUsers: state.posts.pendingUsers,
});

export default connect(mapStateToProps, { validateUser })(Header);
