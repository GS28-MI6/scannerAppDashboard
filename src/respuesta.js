import React from "react";

export default function respuesta(state) {
  console.log(state.state);
  switch (state.state) {
    case "activo":
      return (
        <div className="dataText">
          <h3>Estado:</h3>
          <h3>Activa</h3>
        </div>
      );
    case "P":
      return (
        <div className="dataText">
          <h3>Respuesta:</h3>
          <h3>Policia avisada</h3>
        </div>
      );
    case "PA":
      return (
        <div className="dataText">
          <h3>Respuesta:</h3>
          <h3>Policia y ambulancia avisadas</h3>
        </div>
      );
    case "PB":
      return (
        <div className="dataText">
          <h3>Respuesta:</h3>
          <h3>Policia y bomberos avisados</h3>
        </div>
      );
    case "A":
      return (
        <div className="dataText">
          <h3>Respuesta:</h3>
          <h3>Ambulancia avisada</h3>
        </div>
      );
    case "AB":
      return (
        <div className="dataText">
          <h3>Respuesta:</h3>
          <h3>Ambulancia y bomberos avisados</h3>
        </div>
      );
    case "B":
      return (
        <div className="dataText">
          <h3>Respuesta:</h3>
          <h3>Bomberos avisados</h3>
        </div>
      );
    case "PAB":
      return (
        <div className="dataText">
          <h3>Respuesta:</h3>
          <h3>Policia, ambulancia y bomberos avisados</h3>
        </div>
      );
    default:
      console.log("default");
      return null;
  }
}
