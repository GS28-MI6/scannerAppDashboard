import React from "react";
import CreatableSelect from "react-select";
import axios from "axios";
import { connect } from "react-redux";
import { postState } from "./actions/postActions";
import cx from "classnames";

const options = [
  { value: "activo", label: "Activa" },
  { value: "P", label: "Policia avisada" },
  { value: "PA", label: "Policia y ambulancia avisadas" },
  { value: "PB", label: "Policia y bomberos avisados" },
  { value: "A", label: "Ambulancia avisada" },
  { value: "AB", label: "Ambulancia y bomberos avisados" },
  { value: "B", label: "Bomberos avisados" },
  { value: "PAB", label: "Policia, ambulancia y bomberos avisados" },
  { value: "prueba", label: "Prueba" }
];

class SelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    switch (this.props.alertDataHolder.state) {
      case "activo":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Activa"
        };
        break;
      case "P":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia avisada"
        };
        break;
      case "PA":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia y ambulancia avisadas"
        };
        break;
      case "PB":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia y bomberos avisados"
        };
        break;
      case "A":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Ambulancia avisada"
        };
        break;
      case "AB":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Ambulancia y bomberos avisados"
        };
        break;
      case "B":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Bomberos avisados"
        };
        break;
      case "PAB":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia, Ambulancia y Bomberos avisados"
        };
        break;
      case "prueba":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Prueba"
        };
        break;
      default:
        console.log("default");
        break;
    }
  }

  handleChange(e) {
    console.log(e);
    this.selectedOption = e;

    console.log(this.selectedOption);
    this.props.alertDataHolder.state = e.value;
    var data = this.props.alertDataHolder;
    this.props.postState(data);
    switch (this.props.alertDataHolder.state) {
      case "activo":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Activa"
        };
        break;
      case "P":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia avisada"
        };
        break;
      case "PA":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia y ambulancia avisadas"
        };
        break;
      case "PB":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia y bomberos avisados"
        };
        break;
      case "A":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Ambulancia avisada"
        };
        break;
      case "AB":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Ambulancia y bomberos avisados"
        };
        break;
      case "B":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Bomberos avisados"
        };
        break;
      case "PAB":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Policia, Ambulancia y Bomberos avisados"
        };
        break;
      case "prueba":
        this.selectedOption = {
          value: this.props.alertDataHolder.state,
          label: "Prueba"
        };
        break;
      default:
        console.log("default");
        break;
    }
  }

  render() {
    console.log("selector");
    const dataText = cx({
      'hide': this.props.currentUser.tipo !== "monitoreo" || this.props.alertDataHolder.cerrada === 1
    })
    return (
      <div className={dataText}>
        <CreatableSelect
          placeholder="Seleccionar una respuesta..."
          value={this.selectedOption.value}
          onChange={e => this.handleChange(e)}
          options={options}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  alertDataHolder: state.posts.alertDataHolder,
  currentUser: state.posts.currentUser.decode
});

export default connect(mapStateToProps, { postState })(SelectBox);
