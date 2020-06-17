import React, { Component } from "react";
import SwitchComponent from "./SwitchComponent";
import SwitchComponentPerimetral from "./SwitchComponentPerimetral";
import dateFormat from "dateformat";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { confirmAlert } from 'react-confirm-alert';
import './react-confirm.css'; 
import "./css/users.css";

export default class UserItem extends Component {
  constructor(props) {
    super(props);
    this.state = { habilitado: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  handleClickDelete() {
    const {
      email,
      _id
    } = this.props.user;
    axios
      .post(`http://18.230.143.84:4000/delete_user`, { _id, email })
      .then(res => {
        console.log("activated", res);
        window.location.href = "/users";
      });
  }

  submit = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>¿Estas seguro?</h1>
            <p>Vas a eliminar a este usuario</p>
            <button onClick={onClose}>Cancelar</button>
            <button
              onClick={() => {
                this.handleClickDelete();
                onClose();
              }} className="buttonAlert"
            >
              Si, eliminar
            </button>
          </div>
        );
      }
    });
  };

  handleChange(event) {
    console.log(event);
    if (!this.state.habilitado) {
      this.setState = { habilitado: false };
      console.log(this.state.habilitado, "if");
    } else {
      this.setState = { habilitado: true };
      console.log(this.state.habilitado, "else");
    }
  }
  render() {
    const {
      email,
      nombre_completo,
      dni,
      telefono,
      fecha_nacimiento,
      perimetral,
      habilitado
    } = this.props.user;
    var date = new Date();
    date = fecha_nacimiento;
    return (
      <tr className="table-row">
        <th className="G">{nombre_completo}</th>
        <th className="N">{dni}</th>
        <th className="N">{telefono}</th>
        <th className="N">{dateFormat(date, "isoDate")}</th>
      </tr>
    );
  }
}
