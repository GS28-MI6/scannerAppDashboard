import React from "react";
import CreatableSelect from "react-select";
import { connect } from "react-redux";
import { postDireccion } from "./actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import options from "./calles.js";
import axios from "axios";
import cx from "classnames";
import { confirmAlert } from 'react-confirm-alert';
import "./css/ingresoManual.css"

library.add(fas, fab);


const optionsEstados = [
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

const optionsTipos = [
  { value: "Accidente Vial", label: "Accidente Vial"},
  { value: "Bomberos", label: "Bomberos"},
  { value: "Disturbios", label: "Distubios"},
  { value: "Robo", label: "Robo"},
  { value: "Salud", label: "Salud"},
  { value: "Violencia de Género", label: "Violencia de Género"}
];

class SelectBoxDirecciones extends React.Component {

  submit = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>¿Queres enviar esta alerta?</h1>
            <p>Porfavor anote sus observaciones</p>
            <textarea className="css-yk16xz-control observaciones" id="observaciones" cols="40" rows="5"></textarea>
            <button onClick={onClose}>Cancelar</button>
            <button
              onClick={() => {
                var observaciones = document.getElementById("observaciones").value
                var altura = document.getElementById("altura");
                console.log(this.state.selectedOptionDireccion.value)
                if(this.state.selectedOptionDireccion.value !== "No" && altura.value !== "" && observaciones !== ""){
                  var fecha = document.getElementById("ingreso").value
                  if(fecha !== ""){
                    const data = {
                      "email":this.props.currentUser.email,
                      "tipo": this.state.selectedOptionTipo.value,
                      "ingreso": fecha,
                      "direccion": this.state.selectedOptionDireccion.value += ", " + altura.value,
                      "state": this.state.selectedOptionEstado.value,
                      "observaciones": observaciones
                    }
                    axios.post('http://18.230.143.84:4000/envio_manual', {data})
                    console.log(data)
                  }else{
                    const data = {
                      "email": this.props.currentUser.email,
                      "tipo": this.state.selectedOptionTipo.value,
                      "direccion": this.state.selectedOptionDireccion.value += ", " + altura.value,
                      "state": this.state.selectedOptionEstado.value,
                      "observaciones": observaciones
                    }
                    axios.post('http://18.230.143.84:4000/envio_manual', {data})

                    console.log(data)
                  }
                  console.log(altura.value)
                  // this.props.postDireccion(data);
                  this.setState({selectedOptionDireccion : {
                    value: "No",
                    label: "Elegir una calle"
                  }})
                  this.setState({selectedOptionEstado : {
                    value: "No",
                    label: "Elegir una respuesta..."
                  }})
                  this.setState({selectedOptionTipo : {
                    value: "No",
                    label: "Elegir un tipo de alerta..."
                  }})
                  document.getElementById("altura").value = "";
                  onClose();
                }
              }} className="buttonAlert"
            >
              Si, cerrar
            </button>
          </div>
        );
      }
    });
  };

  state = {
    selectedOptionDireccion: {
      value: "No",
      label: "Elegir una calle..."
    },
    selectedOptionEstado: {
      value: "No",
      label: "Elegir una respuesta..."
    },
    selectedOptionTipo: {
      value: "No",
      label: "Elegir un tipo de alerta..."
    },
    fecha: "",
    tipo: ""
  }

  constructor(props) {
    super(props);
    this.handleChangeDireccion = this.handleChangeDireccion.bind(this);
    this.handleChangeEstado = this.handleChangeEstado.bind(this)
    this.handleChangeTipo = this.handleChangeTipo.bind(this)
    this.submitDireccion = this.submitDireccion.bind(this);
    if (this.props.currentUser !== undefined){
      this.setState({tipo: this.props.currentUser.tipo})
    }
  }

  handleChangeDireccion(e) {
    console.log(e);
    this.state.selectedOptionDireccion = e;

    console.log(this.state.selectedOptionDireccion);
    this.setState({selectedOptionDireccion : {
      value: e.value,
      label: e.value
    }})
  }

  handleChangeTipo(e) {
    console.log(e);
    this.state.selectedOptionTipo = e;

    console.log(this.state.selectedOptionTipo);
    this.setState({selectedOptionTipo : {
      value: e.value,
      label: e.value
    }})
  }

  handleChangeEstado(e) {
    console.log(e);
    this.state.selectedOptionEstado = e;

    console.log(this.state.selectedOptionEstado);
    this.setState({selectedOptionEstado : {
      value: e.value,
      label: e.label
    }})
  }
  submitDireccion() {
    var altura = document.getElementById("altura");
    console.log(this.state.selectedOptionDireccion.value)
    if(this.state.selectedOptionDireccion.value !== "No" && altura.value !== ""){
      var fecha = document.getElementById("ingreso").value
      if(fecha !== ""){
        const data = {
          "email":this.props.currentUser.email,
          "tipo": this.state.selectedOptionTipo.value,
          "ingreso": fecha,
          "direccion": this.state.selectedOptionDireccion.value += ", " + altura.value,
          "state": this.state.selectedOptionEstado.value,

        }
        axios.post('http://18.230.143.84:4000/envio_manual', {data})
        console.log(data)
      }else{
        const data = {
          "email": this.props.currentUser.email,
          "tipo": this.state.selectedOptionTipo.value,
          "direccion": this.state.selectedOptionDireccion.value += ", " + altura.value,
          "state": this.state.selectedOptionEstado.value,
        }
        axios.post('http://18.230.143.84:4000/app', {data})

        console.log(data)
      }
      console.log(altura.value)
      // this.props.postDireccion(data);
      this.setState({selectedOptionDireccion : {
        value: "No",
        label: "Elegir una calle"
      }})
      this.setState({selectedOptionEstado : {
        value: "No",
        label: "Elegir una respuesta..."
      }})
      this.setState({selectedOptionTipo : {
        value: "No",
        label: "Elegir un tipo de alerta..."
      }})
      document.getElementById("altura").value = "";
    }
  }

  render(){
    var hiderInput = cx("css-2b097c-container css-yk16xz-control inputAltura")
    var hiderText = cx("textoAlerta")

    if(this.props.currentUser !== undefined){
      hiderInput = cx( "css-2b097c-container css-yk16xz-control inputAltura",{
        'hide': this.props.currentUser.tipo !== "super"
      })
      hiderText = cx( "textoAlerta",{
        'hide': this.props.currentUser.tipo !== "super"
      })
    }
    return (
      <div className="alertForm">
          <form>
            <h3 className={hiderText}>Ingrese una fecha: </h3>
            <input type="date" id="ingreso" className={hiderInput}/>
            <h3 className="textoAlerta">Ingrese una respuesta: </h3>
            <CreatableSelect
            value={this.state.selectedOptionEstado.value}
            placeholder= {this.state.selectedOptionEstado.label}
            onChange={e => this.handleChangeEstado(e)}
            options={optionsEstados}
            />
            <h3 className="textoAlerta">Ingrese una dirección: </h3>
            <CreatableSelect
            value={this.state.selectedOptionDireccion.value}
            placeholder= {this.state.selectedOptionDireccion.label}
            onChange={e => this.handleChangeDireccion(e)}
            options={options}
            />
            <input type="text" id="altura" className="css-2b097c-container css-yk16xz-control inputAltura" placeholder="Altura "/>
            <h3 className="textoAlerta">Seleccione un tipo de alerta: </h3>
            <CreatableSelect
                value={this.state.selectedOptionTipo.value}
                placeholder= {this.state.selectedOptionTipo.label}
                onChange={e => this.handleChangeTipo(e)}
                options={optionsTipos}
                />
            <button type="button" onClick={this.submit} className="submitDireccion"> Enviar alerta </button>
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