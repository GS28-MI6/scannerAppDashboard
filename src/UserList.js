import React, { Component } from "react";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { activateUser, getUsers, getProductsFiltered } from "./actions/postActions";
import io from "socket.io-client";
import CreatableSelect from "react-select";
import axios from "axios";
import Productos from "./Productos.js";
import "./css/users.css";
import "./css/stadistics.css";

const options = [
  { value: "Comestibles", label: "Comestibles"},
  { value: "Galletitas", label: "Galletitas"},
  { value: "Infusiones", label: "Infusiones"},
  { value: "Limpieza", label: "Limpieza"},
  { value: "Bebidas con alcohol", label: "Bebidas con alcohol"},
  { value: "Bebidas sin alcohol", label: "Bebidas sin alcohol"},
  { value: "Golosinas", label: "golosinas"}
];

var dataPoints =[];


const socket = io("http://18.230.143.84:4000", {
  transports: ["websocket", "polling"]
});

class UserList extends Component {
  constructor(props) {
    super(props);
    // this.eventUser = new EventSource("http://18.230.143.84:4000/events_users");
    this.props.getUsers();
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.state ={
      selectedOption: {
        value: "",
        label: "General"
      }
    }
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    // this.eventUser.onmessage = event => {
    //   console.log(event)
    //   this.props.getUsers()
    // };
    socket.on("usuario_registrado", datosAlerta => {
      console.log("usuario fking registrado!!!!!!");
      console.log(datosAlerta);
      this.props.getUsers();
      window.location.href = "/users";
    });
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

  handleChange(e) {
    console.log(e);
    console.log(this.state.selectedOption);
    this.setState({selectedOption : {
      value: e.value,
      label: e.label
    }})
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
        {/* <div className="titulo">
          <div className="subnavItem"> Productos </div>
          <div className="subnavItem"> Ventas </div>
        </div> */}
        <Productos/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.posts.users
});

export default connect(mapStateToProps, { activateUser, getUsers, getProductsFiltered })(UserList);
