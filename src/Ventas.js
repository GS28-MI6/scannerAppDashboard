import React, { Component } from "react";
import CartItem from "./CartItem";
import { connect } from "react-redux";
import { activateUser, getUsers, getProductsFiltered, getCarrito, postVenta } from "./actions/postActions";
import CreatableSelect from "react-select";
import { confirmAlert } from 'react-confirm-alert';
import './react-confirm.css'; 
import axios from "axios";
import "./css/users.css";
import "./css/stadistics.css";
import BarcodeReader from 'react-barcode-reader';

const options = [
  { value: "Pan", label: "Pan"},
  { value: "Fiambre", label: "Fiambre"},
  { value: "Rotiseria", label: "Rotiseria"},
  { value: "Otros", label: "Otros"}
];


class Ventas extends Component {

  state = {
    selectedOption: {
      value: "Pan",
      label:"Pan"
    }
  }

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
    this.submitForm = this.submitForm.bind(this)
  }

  submit = ( barcode ) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1 className="tituloFiltros">Gráficos con filtros</h1>
                <h2 className="catTitle">Seleccione una categoria</h2>
                <CreatableSelect
                value={this.state.selectedOption.value}
                placeholder={this.state.selectedOption.label}
                onChange={e => {this.handleChange(e, onClose)}}
                options={options}
                />
                <h2 className="dateTitle">Precio:</h2>
                <input type="text" placeholder="Precio..." id="precio" className="css-yk16xz-control popupInput"></input>
                <br></br>
                <button type="button" onClick={() => {this.submitForm( barcode ); onClose()}} className="buttonAlert"> Filtrar </button>
          </div>
        );
      }
    });
  };

  handleChange(e) {
    this.state.selectedOption = e
    this.setState({selectedOption : {
      value: e.value,
      label: e.value
    }})
    this.submit()
    console.log(this.state.selectedOption)
  }

  submitForm(barcode) {
    var precio = document.getElementById("precio").value
    var nombre = this.state.selectedOption.value
    console.log(barcode, nombre, precio)
    this.props.getCarrito(this.props.carrito, barcode, nombre, precio, 0)
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
    if( barcode !== "12345"){
      axios
        .post("http://177.71.157.129:4000/item", {barcode, id_cliente})
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
    } else {
      this.submit(barcode)
    }
  }

  handleSubmit(){
    const barcode = document.getElementById("productoInput").value
    var id_cliente = this.props.currentUser.id_cliente
    if(barcode !== "12345"){
      axios
        .post("http://177.71.157.129:4000/item", {barcode, id_cliente})
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
    } else {
      this.submit(barcode)
    }
  }

  handleScan(data){
    console.log(data)
    const barcode = data
    var id_cliente = this.props.currentUser.id_cliente
    axios
      .post("http://177.71.157.129:4000/item", {barcode, id_cliente})
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


  confirmarVenta() {
    // var totalObj = { total: this.props.total}
    this.props.postVenta(this.props.carrito, this.props.total, this.props.currentUser.id_cliente)
  }

  render() {
    var total = this.props.total
    return (
      <div className="tabla" style={{ height: this.stateHeight.heightHolder }}>
        <BarcodeReader
          onError={this.handleError}
          onScan={this.handleScan}
          />
        <div className="filterContainer">
          <div className="formContainer">
            <h2>Codigo de barras:</h2>
            <input type="text" className="input_venta" placeholder="Codigo de barras..." id="productoInput"></input>
          </div>
          <button type="button" onClick={() => this.handleSubmit()} className="submitDireccion"> Añadir </button>
          <button type="button" onClick={() => this.submit( "12345" )} className="submitDireccion"> Ingreso manual </button>
        </div>
        <div className="heighter">
          <table className="table-container">
            <tr className="table-row initial">
              <th className="N">Barcode</th>
              <th className="XG">Nombre</th>
              <th className="S">Precio</th>
              <th className="S">Stock</th>
              <th className="N">Cantidad</th>
              <th className="S">Borrar</th>
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
            <h2>Total:</h2>
            <h2>${total}</h2>
          </div>
          <button type="button" onClick={() => this.confirmarVenta()} className="submitDireccion"> Confirmar venta</button>
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
