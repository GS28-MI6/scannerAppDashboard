import React, { Component } from "react";
import CartItem from "./CartItem";
import { connect } from "react-redux";
import { activateUser, getUsers, getProductsFiltered, getCarrito, postVenta } from "./actions/postActions";
import io from "socket.io-client";
import CreatableSelect from "react-select";
import axios from "axios";
import "./css/users.css";
import "./css/stadistics.css";
import BarcodeReader from 'react-barcode-reader';


class Ventas extends Component {
  constructor(props) {
    super(props);
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.additem = this.additem.bind(this)
    this.handleScan = this.handleScan.bind(this)
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

  additem(){
    var data = document.getElementById("productoInput").value
    console.log(data)
    const barcode = data
    var id_cliente = this.props.currentUser.id_cliente
    axios
      .post("http://52.67.84.234:4000/item", {barcode, id_cliente})
      .then(response => {
          console.log(response)
          var { nombre, precio, stock } = response.data[0]
          var precio = parseFloat(precio).toFixed(2);
          var stock = stock.toString();
          if(nombre !== null){
            this.props.getCarrito(this.props.carrito, barcode, nombre, precio, stock)
          }

      })
      .catch(err => {
          console.log(err)
      })
  }

  handleScan(data){
    console.log(data)
    const barcode = data
    var id_cliente = this.props.currentUser.id_cliente
    axios
      .post("http://52.67.84.234:4000/item", {barcode, id_cliente})
      .then(response => {
          console.log(response)
          var { nombre, precio, stock } = response.data[0]
          var precio = parseFloat(precio).toFixed(2);
          var stock = stock.toString();
          if(nombre !== null){
            this.props.getCarrito(this.props.carrito, barcode, nombre, precio, stock)
          }

      })
      .catch(err => {
          console.log(err)
      })
  }
  handleError(err){
    console.error(err)
  }


  submitForm() {
    // var totalObj = { total: this.props.total}
    this.props.postVenta(this.props.carrito, this.props.total, this.props.currentUser.id_cliente)
  }

  render() {
    var total = this.props.total
    return (
      <div className="tabla">
        <BarcodeReader
          onError={this.handleError}
          onScan={this.handleScan}
          />
        <div className="filterContainer">
          <div className="formContainer">
            <div className="dateFilter">
              <div className="dates">
                <div className="date">
                  <h2>Codigo de barras:</h2>
                  <input type="text" className=" css-yk16xz-control" id="productoInput"></input>
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => this.addItem()} className="submitDireccion"> Añadir </button>
        </div>
        <div className="heighter">
          <table className="table-container">
            <tr className="table-row initial">
              <th className="N">Barcode</th>
              <th className="XG">Nombre</th>
              <th className="S">Precio</th>
              <th className="S">Stock</th>
              <th className="N">Cantidad</th>
            </tr>
            <div className="scroller">
              {this.props.carrito.map(function(cart, idx) {
                return <CartItem key={idx} cart={cart} />;
              }, this)}
            </div>
          </table>
        </div>
        <div className="filterContainer">
          <div className="formContainer">
            <div className="dateFilter">
              <div className="dates">
                <div className="date">
                  <h2>Total:</h2>
                  <h2>${total}</h2>
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => this.submitForm()} className="submitDireccion"> Confirmar venta</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  carrito: state.posts.carrito,
  total: state.posts.total,
  currentUser: state.posts.currentUser.decode,
});

export default connect(mapStateToProps, { activateUser, getUsers, getProductsFiltered, getCarrito, postVenta })(Ventas);
