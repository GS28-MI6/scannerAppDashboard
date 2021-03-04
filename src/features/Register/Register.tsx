import React, { useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Container, Card, Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "../../components/loader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  tokenSelector,
  loadingSelector,
  errorsSelector,
  clearErrors,
  registerClient,
} from "./userRegisterSlice";
import Input from "../../components/input";

library.add(fas, fab);

interface FormData {
  user: string;
  email: string;
  password: string;
  phone: number;
}
const schema = yup.object().shape({
  user: yup.string().required("Usuario requerido."),
  email: yup.string().required("Email requerido."),
  phone: yup
    .number()
    .required("Telefono requerido.")
    .min(11111111, "Telefono inválido."),
  password: yup.string().required("Contraseña requerida."),
});

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const loadingLogin = useSelector(loadingSelector);
  const errorsRegister = useSelector(errorsSelector);
  const token = useSelector(tokenSelector);

  const location = useLocation<{ from: string }>();
  const { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (token !== "") {
      history.replace(from);
    }
  }, [token, from, history]);

  const { register, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    dispatch(registerClient(data));
    if (errorsRegister.length === 0) {
      history.replace({ pathname: "/login" });
    }
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
            show={errorsRegister.length > 0}
          >
            {errorsRegister}
          </Alert>
          <h2 className="mb-5 font-weight-normal text-center">Registro</h2>
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
                label="Email"
                name="email"
                register={register}
                containerStyle="mb-4"
                error={errors.email?.message || ""}
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
              <Input
                label="Telefono"
                name="phone"
                register={register}
                containerStyle="mb-4"
                error={
                  errors.phone?.message?.includes("NaN")
                    ? "Teléfono inválido."
                    : errors.phone?.message || ""
                }
                type="text"
              />
              <div className="text-center mb-4">
                <Button
                  type="submit"
                  value="iniciar sesión"
                  variant="outline-primary"
                  className="w-50"
                >
                  Registrarse
                </Button>
              </div>
              <div className="text-center">
                <p>
                  ¿Ya tenés una cuenta?, <Link to="/login">Iniciá sesión</Link>.
                </p>
              </div>
            </Form>
          </div>
        </Card>
      )}
    </Container>
  );
}
