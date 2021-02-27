import React from "react";
import { useHistory } from "react-router-dom";
import { Product } from "../actions/Productos";

interface UserItemProps {
  producto: Product;
}

export default function Producto(props: UserItemProps) {
  const history = useHistory();
  const {
    barcode,
    nombre,
    precio,
    stock,
    categoria,
    id_producto,
  } = props.producto;
  return (
    <tr
      className="table-row text-center cursor-pointer"
      onClick={() => history.push("/producto", { id: id_producto })}
    >
      <th>{barcode}</th>
      <th className="text-justify">{nombre}</th>
      <th>$ {precio}</th>
      <th>{stock}</th>
      <th>{categoria}</th>
    </tr>
  );
}
