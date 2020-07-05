import React, { Component } from "react";
import SwitchComponent from "./SwitchComponent";
import SwitchComponentPerimetral from "./SwitchComponentPerimetral";
import dateFormat from "dateformat";
import axios from "axios";
import { connect } from "react-redux";
import { cantidadChange } from "./actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { confirmAlert } from 'react-confirm-alert';
import './react-confirm.css'; 
import "./css/users.css";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = { habilitado: false };
    this.changeCantidad = this.changeCantidad.bind(this)
  }

  changeCantidad(type, cantidad, barcode){
    if (type === "plus") {
      cantidad = cantidad + 1
    } else {
      cantidad = cantidad - 1
    }
    this.props.cantidadChange(this.props.carrito, barcode, cantidad)
  }

  render() {
    const {
      barcode,
      nombre,
      precio,
      stock,
      cantidad
    } = this.props.cart;
    const precioVisible = precio*cantidad
    return (
      <tr className="table-row">
        <th className="N">{barcode}</th>
        <th className="XG">{nombre}</th>
        <th className="S">${precioVisible}</th>
        <th className="S">{stock}</th>
        <th className="N">{cantidad} <FontAwesomeIcon icon="plus-circle" onClick={() => this.changeCantidad("plus", cantidad, barcode)} /> <FontAwesomeIcon icon="plus-circle" onClick={() => this.changeCantidad("minus", cantidad, barcode)} /></th>
      </tr>
    );
  }
}

const mapStateToProps = state => ({
  carrito: state.posts.carrito
});

export default connect(mapStateToProps, { cantidadChange })(CartItem);

