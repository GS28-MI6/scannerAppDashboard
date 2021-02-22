import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Button, Nav, Navbar } from "react-bootstrap";
import { userSelector, logout } from "../features/Login/userSlice";

library.add(fas, fab);

export default function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { usuario } = useSelector(userSelector);
  return (
    <Navbar
      className="sticky-top"
      bg="dark"
      variant="dark"
      style={{ height: "5vh" }}
    >
      <Navbar.Brand className="align-items-center">
        Pymes Dashboard
      </Navbar.Brand>
      {usuario ? (
        <>
          <Nav className="mr-auto align-items-center">
            <Link
              to="/ventas"
              className="d-flex align-items-center ml-4 nav-link"
            >
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
              to="/estadisticas"
              className="d-flex align-items-center ml-4 nav-link"
            >
              <FontAwesomeIcon icon="chart-bar" className="mr-2" />
              Estadística
            </Link>
            <Link
              to="/productos"
              className="d-flex align-items-center ml-4 nav-link"
            >
              <FontAwesomeIcon icon="list" className="mr-2" />
              Lista de Productos
            </Link>
          </Nav>
          <Nav>
            <Navbar.Text className="mr-4">Usuario: {usuario}</Navbar.Text>
            <Button
              variant="outline-light"
              onClick={() => {
                dispatch(logout());
                history.replace("/");
                history.replace("/login");
              }}
              style={{ cursor: "pointer" }}
              className="d-flex align-items-center"
            >
              Salir
              <FontAwesomeIcon icon="sign-out-alt" className="ml-2" />
            </Button>
          </Nav>
        </>
      ) : (
        <Nav className="ml-auto">
          <Button
            variant="outline-light"
            onClick={() => history.push("/login")}
            style={{ cursor: "pointer" }}
            className="d-flex align-items-center"
          >
            Ingresar
            <FontAwesomeIcon icon="sign-in-alt" className="ml-2" />
          </Button>
        </Nav>
      )}
    </Navbar>
  );
}
