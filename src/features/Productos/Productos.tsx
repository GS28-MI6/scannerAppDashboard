import React, { useEffect } from "react";
import Producto from "../../components/Producto";
import * as yup from "yup";
import InputSelect from "../../components/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Input from "../../components/input";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";
import { useReduxDispatch } from "../../app/store";
import {
  clearErrors,
  errorsSelector,
  getProducts,
  loadingSelector,
  productosAllSelector,
} from "./productosSlice";
import { Product } from "../../actions/Productos";
import { useSelector } from "react-redux";
import Loader from "../../components/loader";
import { tokenSelector } from "../Login/userSlice";

const options = [
  { _id: "Comestibles", name: "Comestibles" },
  { _id: "Galletitas", name: "Galletitas" },
  { _id: "Infusiones", name: "Infusiones" },
  { _id: "Lacteos", name: "Lacteos" },
  { _id: "Limpieza", name: "Limpieza" },
  { _id: "Bebidas con alcohol", name: "Bebidas con alcohol" },
  { _id: "Bebidas sin alcohol", name: "Bebidas sin alcohol" },
  { _id: "Golosinas", name: "Golosinas" },
];

interface FormData {
  nombre: string;
  tipo: string;
}
const schema = yup.object().shape({
  nombre: yup.string(),
  tipo: yup.string(),
});

export default function Productos() {
  const dispatch = useReduxDispatch();

  const productos = useSelector(productosAllSelector);
  const loading = useSelector(loadingSelector);
  const errorsProducts: string[] = useSelector(errorsSelector);

  const token = useSelector(tokenSelector);

  const { register, handleSubmit, errors, watch } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      tipo: "",
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const submitForm = async (data: FormData) => {
    dispatch(getProducts({ ...data, token }));
  };

  useEffect(() => {
    if (productos === [])
      dispatch(getProducts({ nombre: "", tipo: "", token }));
  }, [dispatch, token, productos]);

  return (
    <Container className="py-5">
      <h2 className="mb-3">Filtrado de Productos</h2>
      <Loader loading={loading} />
      <Alert
        variant="danger"
        onClose={() => dispatch(clearErrors())}
        dismissible
        show={errorsProducts.length > 0 && !loading}
      >
        {errorsProducts.join(". ")}
      </Alert>
      {!loading && errorsProducts.length === 0 && (
        <>
          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              label="Nombre:"
              name="nombre"
              register={register}
              error={errors.nombre?.message || ""}
            />
            <InputSelect
              name="tipo"
              register={register}
              label="Categoría:"
              options={options}
              optionDefault={watch("tipo")}
              error={errors.tipo?.message || ""}
            />
            <Button type="submit" variant="info">
              Filtrar
            </Button>
          </Form>

          <Table>
            <thead>
              <tr className="table-row initial">
                <th className="N">Barcode</th>
                <th className="XG">Nombre</th>
                <th className="S">Precio</th>
                <th className="S">Stock</th>
                <th className="N">Categoria</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p: Product) => (
                <Producto key={p.id_producto} producto={p} />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
