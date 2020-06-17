import React, { Component } from 'react';
import SelectBox from './selectBox';
import { connect } from 'react-redux';
import Respuesta from "./respuesta";
import axios from "axios";
import "./css/dataHolder.css";
import SelectBoxDirecciones from './selectBoxDirecciones';
import cx from "classnames";
import { confirmAlert } from 'react-confirm-alert';
import './react-confirm.css'; 
// import { postStateDataHolder } from './actions/postActions';

class DataHolder extends Component {


    submit = () => {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className='custom-ui'>
                <h1>¿Queres cerrar esta alerta?</h1>
                <p>Este proceso no puede revertirse</p>
                <p>Por favor anote sus observaciones</p>
                <textarea className="css-yk16xz-control observaciones" id="observaciones" cols="40" rows="5"></textarea>
                <button onClick={onClose}>Cancelar</button>
                <button
                  onClick={() => {
                    var observaciones = document.getElementById("observaciones").value
                    var data = this.props.alertDataHolder;
                    if(observaciones !== ""){
                        axios.post(`http://18.230.143.84:4000/cerrar`, { data, observaciones }).then(res => {
                            console.log(res);
                          });
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

    render() {
        var { email, nombre_completo, latitud,longitud, tipo, state, telefono, perimetral, vida_en_riesgo, llamada_realizada, direccion, observaciones} = this.props.alertDataHolder

        //renders condicionales

        console.log(observaciones)
        const perimetralCss = cx('dataText', {
            "animation-target":perimetral === 1,
            'red' : perimetral === 1,
            'hide' : perimetral !== 1
        })

        const nombreCss = cx('dataText', {
            'red' : perimetral === 1
        })

        const direccionCss = cx('dataText', {
            'hide': direccion === null
        })

        const observacionesCss = cx('dataText', {
            'hide': observaciones === null
        })

        const accidenteVialCss = cx('dataText', {
            "animation-target":vida_en_riesgo === 1,
            'red': vida_en_riesgo === 1,
            'hide': tipo !== "Accidente Vial"
        })

        if(this.props.currentUser !== undefined){
            var cerrarCss = cx({
                'hide' : state === "activo" || direccion === null || this.props.alertDataHolder.cerrada === 1 || this.props.currentUser.tipo !== "monitoreo"
            })
        }else{
            var cerrarCss = cx({
                'hide' : state === "activo" || direccion === null || this.props.alertDataHolder.cerrada === 1
            })
        }

        console.log(this.props.currentUser)
        if(this.props.alertDataHolder.email !== undefined){
            return (
                <React.Fragment>
                    <div className={nombreCss} >
                        <h3>Nombre: </h3>
                        <h3>{nombre_completo}</h3>
                    </div>
                    <div className={perimetralCss} >
                        <h3>Perimetral: </h3>
                        <h3>Si</h3>
                    </div>
                    <div className={accidenteVialCss}>
                        <h3>Riesgo de vida: </h3>
                        {(vida_en_riesgo === 0) ? <h3>No</h3> : <h3>Si</h3>}
                    </div>
                    <div className="dataText" >
                        <h3>Llamada realizada: </h3>
                        {(llamada_realizada === 0) ? <h3>No</h3> : <h3>Si</h3>}
                    </div>
                    <div className="dataText">
                        <h3>Telefono: </h3>
                        <h3>{(telefono !== null) ? <h3>{telefono}</h3> : <h3></h3>}</h3>
                    </div>
                    <div className={direccionCss}>
                        <h3>Direccion: </h3>
                        <h3>{direccion}</h3>
                    </div>
                    <div className="dataText">
                        <h3>Tipo: </h3>
                        <h3>{tipo}</h3>
                    </div>
                    <Respuesta state={state} />
                    <div className={observacionesCss}>
                        <h3>observaciones: </h3>
                        <h3>{observaciones}</h3>
                    </div>
                    <SelectBox />
                    <SelectBoxDirecciones />
                    <button onClick={this.submit} className={cerrarCss}>Cerrar</button>
                </React.Fragment>
            )
        }else{
            return (
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", color:"grey", padding:"o 10px"}}>
                    <h1 style={{fontSize:"15px"}}>Por favor seleccione una alerta</h1>
                </div>
            )
        }
    }
}

const mapStateToProps = state => ({
    alerts: state.posts.alerts,
    alertDataHolder: state.posts.alertDataHolder,
    direccion: state.posts.direccion,
    currentUser: state.posts.currentUser.decode,
    users: state.posts.users
  })
  
  export default connect(mapStateToProps, /*{ postStateDataHolder }*/)(DataHolder)
