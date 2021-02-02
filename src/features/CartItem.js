import React, { Component } from "react";
import { connect } from "react-redux";
import { cantidadChange, erraseItem } from "../actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/react-confirm.css";
import "../css/users.css";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = { habilitado: false };
  }

  changeCantidad(type, cantidad, barcode) {
    if (type === "plus") {
      cantidad = cantidad + 1;
    } else {
      if (cantidad !== 1) {
        cantidad = cantidad - 1;
      } else {
        cantidad = cantidad;
      }
    }
    this.props.cantidadChange(this.props.carrito, barcode, cantidad);
  }

  render() {
    const { barcode, nombre, precio, stock, cantidad } = this.props.cart;
    const precioVisible = precio * cantidad;
    return (
      <tr className="table-row">
        <th className="N">{barcode}</th>
        <th className="XG">{nombre}</th>
        <th className="S">${precioVisible}</th>
        <th className="S">{stock}</th>
        <th className="N">
          {cantidad}{" "}
          <FontAwesomeIcon
            icon="plus-circle"
            onClick={() => this.changeCantidad("plus", cantidad, barcode)}
          />{" "}
          <FontAwesomeIcon
            icon="minus-circle"
            onClick={() => this.changeCantidad("minus", cantidad, barcode)}
          />
        </th>
        <th className="S">
          {" "}
          <FontAwesomeIcon
            icon="times-circle"
            style={{ color: "red" }}
            onClick={() =>
              this.props.erraseItem(this.props.carrito, barcode, precioVisible)
            }
          />{" "}
        </th>
      </tr>
    );
  }
}

const mapStateToProps = (state) => ({
  carrito: state.posts.carrito,
});

export default connect(mapStateToProps, { cantidadChange, erraseItem })(
  CartItem
);
