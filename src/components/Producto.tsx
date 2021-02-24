import React from "react";
import { Product } from "../actions/Productos";

interface UserItemProps {
  producto: Product;
}

export default function Producto(props: UserItemProps) {
  const { barcode, nombre, precio, stock, categoria } = props.producto;
  return (
    <tr className="table-row">
      <th className="N">{barcode}</th>
      <th className="XG">{nombre}</th>
      <th className="S">$ {precio}</th>
      <th className="S">{stock}</th>
      <th className="N">{categoria}</th>
    </tr>
  );
}
