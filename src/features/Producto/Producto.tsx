import React, { useEffect } from "react";
import { Alert, Container, Form, Button, Card } from "react-bootstrap";
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

interface FormData {
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}
const schema = yup.object().shape({
  nombre: yup.string().required("Nombre requerido."),
  tipo: yup.string().required("Categoría requerida."),
  precio: yup
    .number()
    .required("Precio requerido.")
    .min(0.1, "Precio inválido."),
  stock: yup.number().required("Stock requerido.").min(0, "Stock inválido."),
});

export default function Producto() {
  const dispatch = useReduxDispatch();
  const id = useLocation<{ id: string } | undefined>().state?.id;

  const token = useSelector(tokenSelector);

  const producto = useSelector((state: RootState) =>
    productosByIdSelector(state, id || "")
  );

  const {
    register,
    handleSubmit,
    errors,
    control,
    clearErrors,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: producto?.nombre,
      tipo: producto?.categoria,
      precio: producto?.precio,
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

  const onSubmit = (data: FormData) => {
    clearErrors();
    console.log(data);
  };

  return (
    <Container className="py-5">
      <Card className="p-5">
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
                defaultValue={watch("tipo")}
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
              <Controller
                control={control}
                name="precio"
                defaultValue={null}
                render={({ onChange, value, name, ref }) => (
                  <InputMoney
                    containerStyle="align-items-center"
                    name={name}
                    label="Precio"
                    register={ref}
                    error={
                      errors.precio?.message?.includes("NaN")
                        ? "Precio inválido."
                        : errors.precio?.message || ""
                    }
                    value={value}
                    onChange={(value: number) => onChange(value)}
                  />
                )}
              />
              <Input
                containerStyle="align-items-center"
                name="stock"
                label="Stock"
                type="text"
                register={register}
                error={
                  errors.stock?.message?.includes("NaN")
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
      </Card>
    </Container>
  );
}
