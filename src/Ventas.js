import React, { Component } from "react";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { activateUser, getUsers } from "./actions/postActions";
import io from "socket.io-client";
import CreatableSelect from "react-select";
import axios from "axios";
import "./css/users.css";
import "./css/stadistics.css";

const options = [
  { value: "Accidente Vial", label: "Accidente Vial"},
  { value: "Bomberos", label: "Bomberos"},
  { value: "Disturbios", label: "Distubios"},
  { value: "General", label: "General"},
  { value: "Robo", label: "Robo"},
  { value: "Salud", label: "Salud"},
  { value: "Violencia de Género", label: "Violencia de Género"}
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
        value: "General"
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
      value: e.value
    }})
  }

  submitForm() {
    var desde = document.getElementById("dateFrom").value
    var hasta = document.getElementById("dateTo").value
    var tipo = this.state.selectedOption.value

    if(tipo === "General"){
      this.props.countAlertsFiltered(desde, hasta)
      this.setState({currentGraph : tipo})
    } else{
      var chart = this.chart;
      this.setState({currentGraph : tipo})
      axios.post('http://18.230.143.84:4000/countFiltered', {tipo, desde, hasta})
      .then(function(data) {
        var datos = data.data
        for (var i = 0; i < datos.length; i++) {
          var fecha = datos[i].dia.split('T')[0]
          var año = fecha.split('-')[0]
          var mes = fecha.split('-')[1]
          var dia = fecha.split('-')[2]
          console.log(fecha, año, mes, dia)
          dataPoints.push({
            x: new Date(año, mes, dia),
            y: datos[i].tipo
          });
        }
        chart.render();
        console.log(dataPoints)
      });
    }
  }

  render() {
    return (
      <div
        className="usersContainer"
        style={{ height: this.stateHeight.heightHolder }}
      >
        <div className="titulo">
          <div> Lista de usuarios </div>
        </div>
        <div className="tabla">
          <div className="filterContainer">
            <h2>Filtrado de ventas</h2>
            <div className="formContainer">
              <div className="dateFilter">
                <div className="dates">
                  <div className="date">
                    <h2>Desde:</h2>
                    <input type="date" className=" css-yk16xz-control" id="dateFrom"></input>
                  </div>
                  <div className="date">
                    <h2>Hasta:</h2>
                    <input type="date" className=" css-yk16xz-control" id="dateTo"></input>
                  </div>
                </div>
              </div>
              <div className="dateFilter">
                <h2 className="dateTitle">Seleccione una categoria</h2>
                <CreatableSelect
                value={this.state.selectedOption.value}
                placeholder= {this.state.selectedOption.value}
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

              {this.props.users.map(function(user, idx) {
                return <UserItem key={idx} user={user} />;
              }, this)}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.posts.users
});

export default connect(mapStateToProps, { activateUser, getUsers })(UserList);
