import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getUsers,
  getProductsFiltered,
  getCarrito,
  postVenta,
  cantidadChange,
  erraseItem,
} from "../actions/postActions";
import CreatableSelect from "react-select";
import { confirmAlert } from "react-confirm-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/react-confirm.css";
import axios from "axios";
import "../css/users.css";
import "../css/stadistics.css";
import BarcodeReader from "react-barcode-reader";

const options = [
  { value: "Pan", label: "Pan" },
  { value: "Fiambre", label: "Fiambre" },
  { value: "Rotiseria", label: "Rotiseria" },
  { value: "Otros", label: "Otros" },
];

const Ventas = () => {
  const [selectedOption, setSelectedOption] = useState("Pan");
  const [disabled, setDisabled] = useState(false);

  submit = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        let barcode = Math.round(Math.random() * 100000000);
        return (
          <div className="custom-ui">
            <h1 className="tituloFiltros">Agregar un producto</h1>
            <h2 className="catTitle">Seleccione una categoria</h2>
            <CreatableSelect
              value={selectedOption.value}
              placeholder={selectedOption.label}
              onChange={(e) => {
                this.handleChange(e, onClose);
              }}
              options={options}
            />
            <h2 className="dateTitle">Precio:</h2>
            <input
              type="text"
              placeholder="Precio..."
              id="precio"
              className="css-yk16xz-control popupInput"
            ></input>
            <br></br>
            <button
              type="button"
              onClick={() => {
                barcode = Math.round(Math.random() * 100000000);
                this.submitForm(barcode);
                onClose();
              }}
              className="buttonAlert"
            >
              {" "}
              Agregar{" "}
            </button>
          </div>
        );
      },
    });
  };

  const handleChange = (e) => {
    setSelectedOption(e.value);
    submit();
  };

  const submitForm = (barcode) => {
    var precio = document.getElementById("precio").value;
    var nombre = selectedOption.value;
    this.props.getCarrito(this.props.carrito, barcode, nombre, precio, 0);
  };

  const handleSubmit = () => {
    const barcode = document.getElementById("productoInput").value;
    var id_cliente = this.props.currentUser.id_cliente;
    axios
      .post("http://177.71.157.129:4000/item", { barcode, id_cliente })
      .then((response) => {
        console.log(response);
        if (response.data[0] !== undefined) {
          var { nombre, precio, stock } = response.data[0];
          var precio = parseFloat(precio).toFixed(2);
          var stock = stock.toString();
          if (nombre !== null) {
            this.props.getCarrito(
              this.props.carrito,
              barcode,
              nombre,
              precio,
              stock
            );
          }
        } else {
          alert("No se ha encontrado ningun producto");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScan = (data) => {
    console.log(data);
    const barcode = data;
    var id_cliente = this.props.currentUser.id_cliente;
    axios
      .post("http://177.71.157.129:4000/item", { barcode, id_cliente })
      .then((response) => {
        console.log(response);
        var { nombre, precio, stock } = response.data[0];
        var precio = parseFloat(precio).toFixed(2);
        var stock = stock.toString();
        if (nombre !== null) {
          this.props.getCarrito(
            this.props.carrito,
            barcode,
            nombre,
            precio,
            stock
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleError = (err) => {
    console.error(err);
  };

  const confirmarVenta = (ref) => {
    // var totalObj = { total: this.props.total}
    this.props.postVenta(
      this.props.carrito,
      this.props.total,
      this.props.currentUser.id_cliente,
      this.refs.btn
    );
  };

  const changeCantidad = (type, cantidad, barcode) => {
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
  };
  var total = this.props.total;
  return (
    <div className="tabla" style={{ height: this.stateHeight.heightHolder }}>
      <BarcodeReader onError={this.handleError} onScan={this.handleScan} />
      <div className="filterContainer">
        <div className="formContainer">
          <h2>Codigo de barras:</h2>
          <input
            type="text"
            className="input_venta"
            placeholder="Codigo de barras..."
            id="productoInput"
          ></input>
        </div>
        <button
          type="button"
          onClick={() => this.handleSubmit()}
          className="submitDireccion"
        >
          {" "}
          Añadir{" "}
        </button>
        <button
          type="button"
          onClick={() => this.submit("12345")}
          className="submitDireccion"
        >
          {" "}
          Ingreso manual{" "}
        </button>
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
            {this.props.carrito.map(function (cart) {
              const { barcode, nombre, precio, stock, cantidad } = cart;
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
                      onClick={() =>
                        this.changeCantidad("plus", cantidad, barcode)
                      }
                    />{" "}
                    <FontAwesomeIcon
                      icon="minus-circle"
                      onClick={() =>
                        this.changeCantidad("minus", cantidad, barcode)
                      }
                    />
                  </th>
                  <th className="S">
                    {" "}
                    <FontAwesomeIcon
                      icon="times-circle"
                      style={{ color: "red" }}
                      onClick={() =>
                        this.props.erraseItem(
                          this.props.carrito,
                          barcode,
                          precioVisible
                        )
                      }
                    />{" "}
                  </th>
                </tr>
              );
            }, this)}
          </div>
        </table>
      </div>
      <div className="filterContainer">
        <div className="formContainer">
          <h2>Total:</h2>
          <h2>${total}</h2>
        </div>
        <button
          type="button"
          ref="btn"
          onClick={() => {
            this.refs.btn.setAttribute("disabled", "disabled");
            this.confirmarVenta();
            console.log("clicked");
          }}
          className="submitDireccion"
        >
          {" "}
          Confirmar venta
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  carrito: state.posts.carrito,
  total: state.posts.total,
  currentUser: state.posts.currentUser.decode,
});

export default connect(mapStateToProps, {
  getUsers,
  getProductsFiltered,
  getCarrito,
  postVenta,
  cantidadChange,
  erraseItem,
})(Ventas);
