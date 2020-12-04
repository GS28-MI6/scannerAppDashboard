import React, { Component } from "react";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import './react-confirm.css'; 
import "./css/users.css";

export default class UserItem extends Component {
  
  render() {
    const {
      barcode,
      nombre,
      precio,
      stock,
      categoria
    } = this.props.user;
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
}
