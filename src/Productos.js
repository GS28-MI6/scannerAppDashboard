import React, { Component } from "react";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { activateUser, getUsers, getProductsFiltered } from "./actions/postActions";
import CreatableSelect from "react-select";
import "./css/users.css";
import "./css/stadistics.css";

const options = [
  { value: "Comestibles", label: "Comestibles"},
  { value: "Galletitas", label: "Galletitas"},
  { value: "Infusiones", label: "Infusiones"},
  { value: "Limpieza", label: "Limpieza"},
  { value: "Bebidas con alcohol", label: "Bebidas con alcohol"},
  { value: "Bebidas sin alcohol", label: "Bebidas sin alcohol"}
];

class Productos extends Component {
  constructor(props) {
    super(props);
    // this.eventUser = new EventSource("http://18.230.143.84:4000/events_users");
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.props.getUsers();
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
    this.props.getProductsFiltered(nombre, tipo, this.props.currentUser.id_cliente)
  }

  render() {
    return (
      <div className="tabla">
        <div className="filterContainer">
          <h2>Filtrado de Productos</h2>
          <div className="formContainer">
            <div className="dateFilter">
              <div className="dates">
                <div className="date">
                  <h2>Nombre:</h2>
                  <input type="text" className=" css-yk16xz-control productos" id="dateFrom"></input>
                </div>
              </div>
            </div>
            <div className="dateFilter">
              <h2 className="dateTitle">Seleccione una categoria</h2>
              <CreatableSelect
              value={this.state.selectedOption.value}
              placeholder= {this.state.selectedOption.label}
              onChange={e => this.handleChange(e)}
              options={options}
              />
            </div>
          </div>
          <button type="button" onClick={() => this.submitForm()} className="submitDireccion"> Filtrar </button>
        </div>
        <div className="heighter">
          <table className="table-container">
            <tr className="table-row initial">
              <th className="N">Barcode</th>
              <th className="XG">Nombre</th>
              <th className="S">Precio</th>
              <th className="S">Stock</th>
              <th className="N">Categoria</th>
            </tr>
            <div className="scroller">
              {this.props.users.map(function(user, idx) {
                return <UserItem key={idx} user={user} />;
              }, this)}
            </div>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.posts.users,
  currentUser: state.posts.currentUser.decode,
});

export default connect(mapStateToProps, { activateUser, getUsers, getProductsFiltered })(Productos);
