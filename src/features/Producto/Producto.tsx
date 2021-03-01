import React, { useEffect, useState } from "react";
import { Alert, Container, Form, Button } from "react-bootstrap";
import { RootState, useReduxDispatch } from "../../app/store";
import {
  clearErrorsProductos,
  errorsProductosSelector,
  getProducts,
  loadingProductosSelector,
  productosByIdSelector,
  clearErrorsCategorias,
  errorsCategoriasSelector,
  getCategorias,
  loadingCategoriasSelector,
  productosAllSelector,
} from "../Productos/productosSlice";
import { useSelector } from "react-redux";
import Loader from "../../components/loader";
import { tokenSelector } from "../Login/userSlice";
import { useLocation } from "react-router-dom";
import Input from "../../components/input";
import InputSelect from "./../../components/select";
import { categoriasSelector } from "./../Productos/productosSlice";

export default function Producto() {
  const dispatch = useReduxDispatch();
  const id = useLocation<{ id: string } | undefined>().state?.id;

  const token = useSelector(tokenSelector);

  const producto = useSelector((state: RootState) =>
    productosByIdSelector(state, id || "")
  );

  const [nombre, setNombre] = useState(producto?.nombre || "");
  const [tipo, setTipo] = useState(producto?.categoria || "");
  const [precio, setPrecio] = useState(producto?.precio || 0);
  const [stock, setStock] = useState(producto?.stock || 0);

  const loadingProducts = useSelector(loadingProductosSelector);
  const errorsProducts: string[] = useSelector(errorsProductosSelector);

  const loadingCategories = useSelector(loadingCategoriasSelector);
  const errorsCategories: string[] = useSelector(errorsCategoriasSelector);

  const categories = useSelector(categoriasSelector);
  const productos = useSelector(productosAllSelector);

  useEffect(() => {
    if (categories.length === 0) dispatch(getCategorias({ token }));
  }, [dispatch, token, categories]);

  useEffect(() => {
    if (productos.length === 0)
      dispatch(getProducts({ nombre: "", tipo: "", token }));
  }, [dispatch, token, productos]);

  const handleSubmit = () => {
    //Crear o editar
  };

  return (
    <Container className="py-5">
      <h2 className="mb-5 text-center">
        {producto?.nombre || "Crear Producto"}
      </h2>
      <Loader loading={loadingProducts || loadingCategories} />
      <Alert
        variant="danger"
        onClose={() => dispatch(clearErrorsProductos())}
        dismissible
        show={errorsProducts.length > 0 && !loadingProducts}
      >
        {errorsProducts.join(". ")}
      </Alert>
      <Alert
        variant="danger"
        onClose={() => dispatch(clearErrorsCategorias())}
        dismissible
        show={errorsCategories.length > 0 && !loadingCategories}
      >
        {errorsCategories.join(". ")}
      </Alert>
      {!loadingProducts &&
        !loadingCategories &&
        errorsProducts.length === 0 &&
        errorsCategories.length === 0 &&
        categories.length > 0 && (
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
            {/* CREAR INPUT DE DINERO
            <Input
              containerStyle="d-flex justify-content-center align-items-center"
              name="precio"
              placeholder="Precio"
              value={precio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrecio(e.target.value)
              }
            />*/}
            <Input
              containerStyle="d-flex justify-content-center align-items-center"
              name="stock"
              placeholder="Stock"
              type="number"
              value={stock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStock(Number(e.target.value))
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
