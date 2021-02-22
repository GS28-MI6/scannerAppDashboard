import React, { useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Container, Card, Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "../../components/loader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  tokenSelector,
  loadingSelector,
  errorsSelector,
  clearErrors,
  authenticateLogin,
} from "./userSlice";
import Input from "../../components/input";

library.add(fas, fab);

interface FormData {
  user: string;
  password: string;
}
const schema = yup.object().shape({
  user: yup.string().required("Usuario requerido."),
  password: yup.string().required("Contraseña requerida."),
});

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const loadingLogin = useSelector(loadingSelector);
  const errorsLogin = useSelector(errorsSelector);
  const token = useSelector(tokenSelector);

  const location = useLocation<{ from: string }>();
  const { from } = location.state || { from: { pathname: "/ventas" } };

  useEffect(() => {
    if (token !== "") {
      history.replace(from);
    }
  }, [token, from, history]);

  const { register, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    dispatch(authenticateLogin(data));
  };

  return (
    <Container className="d-flex justify-content-center pt-5">
      <Loader containerStyle="mt-5 pt-5" loading={loadingLogin} />
      {!loadingLogin && token === "" && (
        <Card className="p-5 my-5 w-50">
          <Alert
            dismissible
            variant="danger"
            className="mb-4"
            onClose={() => dispatch(clearErrors())}
            show={errorsLogin.length > 0}
          >
            {errorsLogin}
          </Alert>
          <h2 className="mb-5 font-weight-normal text-center">
            Iniciar sesión
          </h2>
          <div className="d-flex justify-content-center w-100">
            <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
              <Input
                label="Usuario"
                name="user"
                register={register}
                containerStyle="mb-4"
                error={errors.user?.message || ""}
                type="text"
              />
              <Input
                label="Contraseña"
                name="password"
                register={register}
                containerStyle="mb-4"
                error={errors.password?.message || ""}
                type="password"
              />
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
      )}
    </Container>
  );
}
