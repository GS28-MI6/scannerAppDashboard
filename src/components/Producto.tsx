import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../actions/Productos";

interface UserItemProps {
  producto: Product;
}

export default function Producto(props: UserItemProps) {
  const { barcode, nombre, precio, stock, categoria } = props.producto;
  return (
    <tr className="table-row text-center cursor-pointer">
      <th>{barcode}</th>
      <th className="text-justify">
        <Link to={`/producto?${barcode}`}>{nombre}</Link>
      </th>
      <th>$ {precio}</th>
      <th>{stock}</th>
      <th>{categoria}</th>
    </tr>
  );
}
