/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { selecting } from "./actions/postActions";
import dateFormat from "dateformat";
import MapShow from "./MapShow";
import cx from "classnames";

export class AlertCard extends Component {

  styleChanger(type){
    switch(type){
      case 'Disturbios':
        return (
          <FontAwesomeIcon
            icon="phone-alt"
            style={{ display: "flex", flexDirection: "row" }}
            color="blue"
          />

        );
      case 'Robo':
        return (
          <FontAwesomeIcon
            icon="phone-alt"
            style={{ display: "flex", flexDirection: "row" }}
            color="blue"
          />
        );
      case 'Salud':
        return (
          <FontAwesomeIcon
            icon="ambulance"
            style={{ display: "flex", flexDirection: "row" }}
            color="green"
          />
        );
      case 'Bomberos':
        return (
          <FontAwesomeIcon
            icon="hard-hat"
            style={{ display: "flex", flexDirection: "row" }}
            color="red"
          />
        );
      case 'Accidente Vial':
        return (
          <FontAwesomeIcon
            icon="car-crash"
            style={{ display: "flex", flexDirection: "row" }}
            color="black"
          />
        );
      case 'V. Género':
        return (
          <FontAwesomeIcon
            icon="exclamation-circle"
            style={{ display: "flex", flexDirection: "row" }}
            color="violet"
          />
        );
      default:
        return null;
    }
  }

  render() {
    var {
      id,
      email,
      nombre_ompleto,
      dni,
      sexo,
      telefono,
      tipo,
      state,
      ingreso,
      map_show,
      cerrada
    } = this.props.alert;
    switch(tipo){
      case 'Disturbios':
        tipo = "Disturbios";
        break;
      case 'Robo':
        tipo = "Robo";
        break;
      case "Salud":
        tipo = "Salud";
        break;
      case "Bomberos":
        tipo = "Bomberos";
        break;
      case 'Accidente Vial':
        tipo = "Accidente Vial";
        break;
      case "Violencia de Género":
        tipo = "V. Género";
        break;
      default:
        tipo = tipo;
    }
    var date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    date = ingreso;

    const alertColor = cx({
      'red': state === "activo" && cerrada === 0,
      'green': state !== "activo" && cerrada === 0,
      'black': cerrada === 1
  })

    return (
      <div
        className="individualCard"
        onClick={() => this.props.selecting(this.props.alert)}
      >
        <div className="iconDiv">
          <div>{this.styleChanger(tipo)}</div>
          <p style={{ display: "flex", flexDirection: "row" }} color="black"></p>
        </div>
        <div>
          <div className={alertColor}>{(state === "activo") ? <h1>{tipo} (activo)</h1> : <h1>{tipo}</h1>}</div>
          <h3 style={{ color: "#9fa8a3" }}>
            {dateFormat(date, "isoDate")}, {dateFormat(date, "shortTime")}
          </h3>
          <div className="showOnMap">
            <h3>Marcar en mapa:</h3>
            <MapShow estado={map_show} id={id} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  alerts: state.posts.alerts,
  alertDataHolder: state.posts.alertDataHolder
});

export default connect(mapStateToProps, { selecting })(AlertCard);
