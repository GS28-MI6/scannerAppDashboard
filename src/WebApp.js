import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { getUsers, getProductsFiltered, getCarrito, postVenta} from "./actions/postActions";
import Ventas from "./Ventas.js";
import Agregar from "./Agregar.js";
import "./css/users.css";
import "./css/stadistics.css";


class UserList extends Component {


  constructor(props) {
    super(props);
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.updateTotal = this.updateTotal.bind(this);
    this.submitForm = this.submitForm.bind(this);

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
  updateTotal(){
    var sumaTotal = 0
    this.props.carrito.map(function(item){
      console.log(item.cantidad)
      var precio = parseFloat(item.precio) * parseInt(item.cantidad)
      console.log(precio)
      sumaTotal = parseFloat(sumaTotal) + parseFloat(precio)
      sumaTotal = parseFloat(sumaTotal).toFixed(2)
      console.log(sumaTotal, "soy sumaTotal")
    })
  }

  submitForm() {
    this.props.postVenta(this.props.carrito, this.props.total)
  }

  render() {
    return (
      <div
        className="usersContainer"
        style={{ height: this.stateHeight.heightHolder }}
      >
        <div className="titulo">
          <div className="subnavItem" onClick={() => window.location.href="/"}> Ventas </div>
          <div className="subnavItem" onClick={() => window.location.href="/ingreso"}> Ingresos </div>
        </div>
        {window.location.pathname === "/" ? <Ventas/> : <Agregar />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  carrito: state.posts.carrito,
  total: state.posts.total
});

export default connect(mapStateToProps, { getUsers, getProductsFiltered, getCarrito, postVenta})(UserList);
