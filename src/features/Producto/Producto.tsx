import React, { useEffect } from "react";
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
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMoney from "../../components/inputMoney";
import { formatValue } from "react-currency-input-field";

interface FormData {
  nombre: string;
  tipo: string;
  precio: string;
  stock: number;
}
const schema = yup.object().shape({
  nombre: yup.string().required("Nombre requerido."),
  tipo: yup.string().required("Categoría requerida."),
  precio: yup.string().required("Precio requerido."),
  stock: yup
    .string()
    .required("Stock requerido.")
    .matches(/^[0-9]*$/),
});

export default function Producto() {
  const dispatch = useReduxDispatch();
  const id = useLocation<{ id: string } | undefined>().state?.id;

  const token = useSelector(tokenSelector);

  const producto = useSelector((state: RootState) =>
    productosByIdSelector(state, id || "")
  );

  const { register, handleSubmit, errors, control } = useForm<FormData>({
    resolver: yupResolver(schema),
    shouldUnregister: false,
    defaultValues: {
      nombre: producto?.nombre,
      tipo: producto?.categoria,
      precio: String(
        formatValue({
          value: String(producto?.precio),
          groupSeparator: ".",
          decimalSeparator: ",",
          prefix: "$",
        })
      ),
      stock: producto?.stock,
    },
  });

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

  const onSubmit = () => {
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
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              containerStyle="align-items-center"
              name="nombre"
              label="Nombre"
              register={register}
              error={errors.nombre?.message || ""}
            />
            <Controller
              control={control}
              name="tipo"
              render={({ onChange, value, name, ref }) => (
                <InputSelect
                  containerStyle="align-items-center"
                  label="Categoría"
                  optionDefault="Elegir"
                  register={ref}
                  options={categories}
                  value_id={value}
                  name={name}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onChange(e.target.value)
                  }
                  error={errors.tipo?.message || ""}
                />
              )}
            />
            <InputMoney
              containerStyle="align-items-center"
              name="precio"
              label="Precio"
              register={register}
              error={errors.precio?.message || ""}
            />
            <Input
              containerStyle="align-items-center"
              name="stock"
              label="Stock"
              type="text"
              register={register}
              error={
                errors.stock?.message?.includes("match")
                  ? "Stock inválido."
                  : errors.stock?.message || ""
              }
            />
            <div className="align-items-center text-center">
              <Button type="submit" variant="info" className="w-25">
                Guardar
              </Button>
            </div>
          </Form>
        )}
    </Container>
  );
}
