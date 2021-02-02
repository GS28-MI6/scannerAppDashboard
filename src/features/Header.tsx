import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Nav, Navbar } from "react-bootstrap";
import { usernameSelector, clearUser } from "./userSlice";

library.add(fas, fab);

export default function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user: string = useSelector(usernameSelector);
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
      {user && (
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
            <Navbar.Text className="mr-4">Usuario: {user}</Navbar.Text>
            <a
              onClick={() => {
                dispatch(clearUser());
                history.replace("/login");
              }}
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
