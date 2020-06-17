import React from "react";
import CreatableSelect from "react-select";
import { connect } from "react-redux";
import { postDireccion } from "./actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import options from "./calles.js";
import cx from "classnames";

library.add(fas, fab);

class SelectBoxDirecciones extends React.Component {

  state = {
    selectedOption: {
      value: "No",
      label: "Elegir una calle"
    }
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitDireccion = this.submitDireccion.bind(this);
    if(this.props.alertDataHolder.direccion !== null){
      this.setState({selectedOption : {
        value: this.props.alertDataHolder.direccion,
        label: this.props.alertDataHolder.direccion
      }})
      console.log("hay direccion")
    } else {
      this.setState({selectedOption : {
        value: "No",
        label: "Elegir una calle..."
      }})
      console.log("no hay direccion")
    }
  }

  handleChange(e) {
    console.log(e);
    this.state.selectedOption = e;

    console.log(this.state.selectedOption);
    this.props.alertDataHolder.direccion = e.value;
    console.log(this.props.alertDataHolder)
    this.setState({selectedOption : {
      value: this.props.alertDataHolder.direccion,
      label: this.props.alertDataHolder.direccion
    }})
  }
  
  submitDireccion() {
    var altura = document.getElementById("altura");
    console.log(this.state.selectedOption.value)
    if(this.state.selectedOption.value !== "No" && altura.value !== ""){
      console.log(altura.value)
      this.props.alertDataHolder.direccion += ", " + altura.value
      var data = this.props.alertDataHolder;
      console.log(data)
      this.props.postDireccion(data);
      this.setState({selectedOption : {
        value: "No",
        label: "Elegir una calle"
      }})
      document.getElementById("altura").value = "";
    }
  }

  render(){
    const dataText = cx('dataTextDireccion', {
      'hide': this.props.currentUser.tipo !== "monitoreo" || this.props.alertDataHolder.cerrada === 1
    })
    return (
      <div className={dataText}>
          <h3 className="textoAlerta">Ingrese una direccion: </h3>
          <CreatableSelect
          value={this.state.selectedOption.value}
          placeholder= {this.state.selectedOption.label}
          onChange={e => this.handleChange(e)}
          options={options}
          />
          <form>
            <input type="text" id="altura" className="inputAltura" placeholder="Select... "/>
            <button type="button" onClick={() => this.submitDireccion()} className="submitDireccion"> <FontAwesomeIcon icon="sign-in-alt" style={{ display: "flex", flexDirection: "row" }}/> </button>
          </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  alertDataHolder: state.posts.alertDataHolder,
  currentUser: state.posts.currentUser.decode
});

export default connect(mapStateToProps, { postDireccion })(SelectBoxDirecciones);
