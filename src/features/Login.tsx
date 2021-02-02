import React, { Component } from "react";
import { connect } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Container, Card, Alert, Button, Form } from "react-bootstrap";

library.add(fas, fab);

class Login extends Component {
  state = {
    user: "",
    password: "",
    url: window.location.pathname,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.userLoginPost(this.state);
  };

  render() {
    return (
      <div style={{ height: "95vh" }}>
        <Container className="d-flex justify-content-center">
          <Card className="p-5 my-5 w-50">
            {!this.props.loginErr.error && (
              <Alert variant="danger">Usuario y/o contraseña inválido/s</Alert>
            )}
            {/*<div className="text-center">
              <img class="mb-5" src={Logo} alt="Ciudad Segura" width="150" />
            </div>*/}
            <h2 class="mb-5 font-weight-normal text-center">Iniciar sesión</h2>
            <div className="d-flex justify-content-center w-100">
              <Form onSubmit={this.handleSubmit} className="w-100">
                <Form.Group controlId="formBasicUser">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    id="inputUser"
                    name="email"
                    className="form-control mb-3"
                    placeholder="Usuario"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="inputPassword"
                    name="password"
                    className="form-control mb-3"
                    placeholder="Contraseña"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <div className="text-center">
                  <Button
                    type="submit"
                    value="iniciar sesión"
                    variant="outline-primary"
                    className="w-50"
                  >
                    Ingresar
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginErr: state.posts.loginErr,
});

const mapDispatchToProps = (dispatch) => ({
  userLoginPost: (userInfo) => dispatch(userLoginPost(userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
