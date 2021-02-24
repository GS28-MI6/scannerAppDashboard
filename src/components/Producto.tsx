import React from "react";

interface producto {
  barcode: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}
interface UserItemProps {
  producto: producto;
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
