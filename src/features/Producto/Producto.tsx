import React, { useEffect, useState } from "react";
import { Alert, Container, Form, Button } from "react-bootstrap";
import { RootState, useReduxDispatch } from "../../app/store";
import {
  clearErrors,
  errorsSelector,
  getProducts,
  loadingSelector,
  productosByIdSelector,
} from "../Productos/productosSlice";
import { getCategories } from "../../actions/Productos";
import { useSelector } from "react-redux";
import Loader from "../../components/loader";
import { tokenSelector } from "../Login/userSlice";
import { useLocation } from "react-router-dom";
import Input from "../../components/input";
import InputSelect from "./../../components/select";

export default function Producto() {
  const dispatch = useReduxDispatch();
  const id = useLocation<{ id: string } | undefined>().state?.id;

  const token = useSelector(tokenSelector);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorsCategories, setErrorsCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");

  const producto = useSelector((state: RootState) =>
    productosByIdSelector(state, id || "")
  );
  const loading = useSelector(loadingSelector);
  const errorsProducts: string[] = useSelector(errorsSelector);

  useEffect(() => {
    dispatch(getProducts({ nombre: "", tipo: "", token }));
  }, [dispatch, token]);

  useEffect(() => {
    let unmounted = false;
    async function onMount() {
      try {
        if (!unmounted) {
          const categoriesResponse = await getCategories(token);
          if (categoriesResponse.Errors.length === 0) {
            const categorias: { _id: string; name: string }[] = [];
            categoriesResponse.Categorias.forEach((c) =>
              categorias.push({ _id: c.categoria, name: c.categoria })
            );
            setCategories(categorias);
          } else {
            setErrorsCategories(categoriesResponse.Errors);
          }
          setLoadingCategories(false);
        }
      } catch (ex) {
        if (!unmounted) {
          setErrorsCategories(["No se pudieron obtener las categorías."]);
          setLoadingCategories(false);
        }
      }
    }
    onMount();
    return () => {
      unmounted = true;
    };
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(getProducts({ nombre: "", tipo: "", token }));
  }, [dispatch, token]);

  const handleSubmit = () => {
    dispatch(getProducts({ nombre, tipo, token }));
  };

  return (
    <Container className="py-5">
      <h2 className="mb-5 text-center">
        {producto?.nombre || "Crear Producto"}
      </h2>
      <Loader loading={loading || loadingCategories} />
      <Alert
        variant="danger"
        onClose={() => dispatch(clearErrors())}
        dismissible
        show={errorsProducts.length > 0 && !loading}
      >
        {errorsProducts.join(". ")}
      </Alert>
      <Alert
        variant="danger"
        onClose={() => setErrorsCategories([])}
        dismissible
        show={errorsCategories.length > 0 && !loadingCategories}
      >
        {errorsCategories.join(". ")}
      </Alert>
      {!loading &&
        !loadingCategories &&
        errorsProducts.length === 0 &&
        errorsCategories.length === 0 && (
          <Form
            className="justify-content-center mb-4"
            onSubmit={() => handleSubmit()}
          >
            <Input
              containerStyle="d-flex justify-content-center align-items-center"
              name="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNombre(e.target.value)
              }
            />
            <InputSelect
              containerStyle="d-flex justify-content-center align-items-center"
              name="tipo"
              options={categories}
              optionDefault="Todas"
              optionDefaultIsNotDisabled
              value_id={tipo}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTipo(e.target.value)
              }
            />
            <div className="d-flex justify-content-center align-items-center form-group">
              <Button type="submit" variant="info" className="w-100">
                Guardar
              </Button>
            </div>
          </Form>
        )}
    </Container>
  );
}
