import React from "react";
import "../css/react-confirm.css";
import "../css/users.css";

interface UserItemProps {
  barcode: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

export default function UserItem(props: UserItemProps) {
  const { barcode, nombre, precio, stock, categoria } = props;
  return (
    <tr className="table-row">
      <th className="N">{barcode}</th>
      <th className="XG">{nombre}</th>
      <th className="S">${precio}</th>
      <th className="S">{stock}</th>
      <th className="N">{categoria}</th>
    </tr>
  );
}
