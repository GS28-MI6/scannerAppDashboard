import React from "react";
import Producto from "../../components/Producto";
import * as yup from "yup";
import InputSelect from "../../components/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Input from "../../components/input";
import { Button, Form } from "react-bootstrap";
import { useReduxDispatch } from "../../app/store";
import { getProductsFiltered } from "./productosSlice";

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
  name: string;
  category: string;
}
const schema = yup.object().shape({
  name: yup.string(),
  category: yup.string(),
});

export default function Productos() {
  const dispatch = useReduxDispatch();

  const { register, handleSubmit, errors, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const submitForm = async (data: FormData) => {
    const { name, category } = data;
    dispatch(getProductsFiltered(name, category));
  };
  return (
    <div className="tabla">
      <h2>Filtrado de Productos</h2>
      <Form onSubmit={handleSubmit(submitForm)} className="w-100">
        <Input
          label="Nombre:"
          name="name"
          register={register}
          error={errors.name?.message || ""}
        />
        <InputSelect
          name="category"
          register={register}
          label="Categoría:"
          options={options}
          optionDefault={watch("category")}
        />
        <Button type="submit" variant="info">
          Filtrar
        </Button>
      </Form>
      <div className="heighter">
        <table className="table-container">
          <tr className="table-row initial">
            <th className="N">Barcode</th>
            <th className="XG">Nombre</th>
            <th className="S">Precio</th>
            <th className="S">Stock</th>
            <th className="N">Categoria</th>
          </tr>
          <div className="scroller">
            {productos.map(
              (
                p: {
                  barcode: string;
                  nombre: string;
                  precio: number;
                  stock: number;
                  categoria: string;
                },
                id: string
              ) => (
                <Producto key={id} producto={p} />
              )
            )}
          </div>
        </table>
      </div>
    </div>
  );
}
