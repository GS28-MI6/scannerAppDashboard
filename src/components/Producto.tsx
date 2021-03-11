import React from "react";
import { Product } from "../actions/Productos";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UserItemProps {
  producto: Product;
  onEdit: () => void;
}

export default function Producto(props: UserItemProps) {
  const { barcode, nombre, precio, stock, categoria } = props.producto;
  return (
    <tr className="table-row text-center">
      <td>{barcode}</td>
      <td className="text-justify">{nombre}</td>
      <td>$ {precio}</td>
      <td>{stock}</td>
      <td>{categoria}</td>
      <td>
        <Button onClick={() => props.onEdit()}>
          <FontAwesomeIcon icon="edit" />
        </Button>
      </td>
    </tr>
  );
}
