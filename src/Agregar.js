import React, { Component } from "react";
import CartItem from "./CartItem";
import { connect } from "react-redux";
import { activateUser, getUsers, getProductsFiltered, getCarrito } from "./actions/postActions";
import io from "socket.io-client";
import CreatableSelect from "react-select";
import axios from "axios";
import "./css/users.css";
import "./css/stadistics.css";
import BarcodeReader from 'react-barcode-reader';

const options = [
  { value: "Comestibles", label: "Comestibles"},
  { value: "Galletitas", label: "Galletitas"},
  { value: "Infusiones", label: "Infusiones"},
  { value: "Limpieza", label: "Limpieza"},
  { value: "Bebidas con alcohol", label: "Bebidas con alcohol"},
  { value: "Bebidas sin alcohol", label: "Bebidas sin alcohol"}
];


class Ventas extends Component {
  constructor(props) {
    super(props);
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
    this.handleChange = this.handleChange.bind(this);
    this.handleScan = this.handleScan.bind(this);
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

  handleChange(e) {
    console.log(e);
    console.log(this.state.selectedOption);
    this.setState({selectedOption : {
      value: e.value,
      label: e.label
    }})
  }

  handleScan(data){
    console.log(data)
    const barcode = data
    var barcodeInput = document.getElementById("barcodeInput")
    var productoInput = document.getElementById("productoInput")
    var precioInput = document.getElementById("precioInput")
    var stockInput = document.getElementById("stockInput")
    barcodeInput.value = barcode
    var id_cliente = this.props.currentUser.id_cliente
    axios
      .post("http://177.71.157.129:4000/item", {barcode, id_cliente})
      .then(response => {
          console.log(response)

          var { nombre, precio, stock, categoria } = response.data[0]
          var precio = parseFloat(precio).toFixed(2);
          this.state.total = parseFloat(this.state.total).toFixed(2)
          var sumaTotal = parseFloat(this.state.total) + parseFloat(precio)
          sumaTotal = parseFloat(sumaTotal).toFixed(2)
          var stock = stock.toString();
          if(nombre !== null){
            productoInput.value = nombre
            precioInput.value = precio
            stockInput.value = stock
            if(categoria !== null){
              this.setState({selectedOption : {
                value: categoria,
                label: categoria
              }})
            } else {
              this.setState({selectedOption : {
                value: "",
                label: "General"
              }})
            }
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
    var barcodeInput = document.getElementById("barcodeInput")
    var productoInput = document.getElementById("productoInput")
    var precioInput = document.getElementById("precioInput")
    var stockInput = document.getElementById("stockInput")

    axios
      .post("http://177.71.157.129:4000/ingreso", {
          barcode: barcodeInput.value,
          nombre: productoInput.value,
          precio: precioInput.value,
          stock: stockInput.value,
          categoria: this.state.selectedOption.value,
          id_cliente: this.props.currentUser.id_cliente
      })
      .then(() => {
        this.setState({selectedOption : {
          value: "",
          label: "General"
        }})
        barcodeInput.value = ""
        productoInput.value = ""
        precioInput.value = ""
        stockInput.value = ""
      })
    
  }

  render() {
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
                  <input type="text" className=" css-yk16xz-control" id="barcodeInput"></input>
                  <h2>Producto:</h2>
                  <input type="text" className=" css-yk16xz-control" id="productoInput"></input>
                  <h2>Precio:</h2>
                  <input type="text" className=" css-yk16xz-control" id="precioInput"></input>
                  <h2>Categoria:</h2>
                  <CreatableSelect
                    value={this.state.selectedOption.value}
                    placeholder= {this.state.selectedOption.label}
                    onChange={e => this.handleChange(e)}
                    options={options}
                    />
                  <h2>Stock:</h2>
                  <input type="text" className=" css-yk16xz-control" id="stockInput"></input>
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => this.submitForm()} className="submitDireccion"> Añadir </button>
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

export default connect(mapStateToProps, { activateUser, getUsers, getProductsFiltered, getCarrito  })(Ventas);
