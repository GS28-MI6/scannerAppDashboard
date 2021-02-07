import React, { useEffect, useState } from "react";
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
  errorSelector,
  clearError,
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

  const loadingCurrentUser = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const token = useSelector(tokenSelector);

  const location = useLocation<{ from: string }>();
  const { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (token !== "") {
      history.replace(from);
    }
  }, [token]);

  const { register, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await dispatch(authenticateLogin(data));
  };

  return (
    <div style={{ height: "95vh" }}>
      <Container className="d-flex justify-content-center pt-5">
        <Loader containerStyle="mt-5 pt-5" loading={loadingCurrentUser} />
        {!loadingCurrentUser && (
          <Card className="p-5 my-5 w-50">
            {error && (
              <Alert
                dismissible
                variant="danger"
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            )}
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
    </div>
  );
}
