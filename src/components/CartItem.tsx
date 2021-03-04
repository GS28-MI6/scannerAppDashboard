import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cart } from "../actions/Ventas";
import { cartSelector, totalSelector, removeItem, updateQuantity } from "../features/Ventas/ventasSlice";

interface CartProps {
  cart: Cart;
}

export default function CartItem(props: CartProps) {
  const { barcode, nombre, precio, stock, quantity } = props.cart;

  const stateCart = useSelector(cartSelector)
  const stateTotal = useSelector(totalSelector)


   const changeCantidad = (type: string, quantity: number, barcode: number) => {
    if (type === "plus") quantity = quantity + 1;
    else if (quantity !== 1) quantity = quantity - 1;
    updateQuantity(stateCart, barcode, quantity, stateTotal);
  }


    const precioVisible = precio * quantity;
    return (
      <tr className="table-row">
        <th className="N">{barcode}</th>
        <th className="XG">{nombre}</th>
        <th className="S">${precioVisible}</th>
        <th className="S">{stock}</th>
        <th className="N">
          {quantity}{" "}
          <FontAwesomeIcon
            icon="plus-circle"
            onClick={() => changeCantidad("plus", quantity, barcode)}
          />{" "}
          <FontAwesomeIcon
            icon="minus-circle"
            onClick={() => changeCantidad("minus", quantity, barcode)}
          />
        </th>
        <th className="S">
          {" "}
          <FontAwesomeIcon
            icon="times-circle"
            style={{ color: "red" }}
            onClick={() =>
              removeItem(stateCart, barcode, precioVisible)
            }
          />{" "}
        </th>
      </tr>
    );
}