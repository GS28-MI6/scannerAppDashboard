import React, { Component } from "react";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { activateUser, getUsers, getProductsFiltered } from "./actions/postActions";
import io from "socket.io-client";
import CreatableSelect from "react-select";
import axios from "axios";
import Ventas from "./Ventas.js";
import "./css/users.css";
import "./css/stadistics.css";
import BarcodeReader from 'react-barcode-reader';


class UserList extends Component {
  constructor(props) {
    super(props);
    this.props.getUsers();
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.state = {
      result: 'No result'
    }
    this.submitForm = this.submitForm.bind(this);
    this.handleScan = this.handleScan.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    var heightHolder = window.innerHeight - 50;
    this.stateheight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
  }

  handleScan(data){
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }

  submitForm() {
    var nombre = document.getElementById("dateFrom").value
    var tipo = this.state.selectedOption.value
    this.props.getProductsFiltered(nombre, tipo)
  }

  render() {
    return (
      <div
        className="usersContainer"
        style={{ height: this.stateHeight.heightHolder }}
      >
        <div className="titulo">
          <div> Productos </div>
          <div> Ventas </div>
        </div>
        <BarcodeReader
          onError={this.handleError}
          onScan={this.handleScan}
          />
        <Ventas/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.posts.users
});

export default connect(mapStateToProps, { activateUser, getUsers, getProductsFiltered })(UserList);
