import React, { Component } from "react";
import AlertCard from "./AlertCard";
import Overlay from "ol/Overlay.js";
import * as proj from "ol/proj";
import { connect } from 'react-redux';
import { selecting } from './actions/postActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, fab);



class PopUp extends Component {



  componentDidMount(){
    console.log("i mounted")
    if (this.props.alert.state === "activo" || this.props.alert.map_show === 1){
      console.log("state active")
      var { id, tipo, state, longitud, latitud } = this.props.alert;
      id = id + 100;
      this.overlay = new Overlay({
        position: proj.fromLonLat([longitud, latitud]),
        element: document.getElementById(id),
        positioning: "center-center"
      });
      console.log(this.overlay)
      this.props.map.addOverlay(this.overlay);
      this.exists = document.getElementById(id);
    }
  }

  componentDidUpdate(){
    console.log("i updated")
    console.log(this.props.alert.map_show)
    if(!this.exists){
      if (this.props.alert.state === "activo" || this.props.alert.map_show === 1){
        console.log("no existia id")
        var { id, tipo, state, longitud, latitud } = this.props.alert;
        id = id + 100;
        this.overlay = new Overlay({
          position: proj.fromLonLat([longitud, latitud]),
          element: document.getElementById(id),
          positioning: "center-center"
        });
        console.log(this.overlay)
        this.props.map.addOverlay(this.overlay);
        this.exists = document.getElementById(id);
      }
      } else {
        if (this.props.alert.state === "activo" || this.props.alert.map_show === 1){
          if(this.overlay !== undefined){
            console.log("ya existia entonces reañado", id)
            this.props.map.addOverlay(this.overlay);
          } else {
            console.log("existia id pero no overlay")
            var { id, tipo, state, longitud, latitud } = this.props.alert;
            id = id + 100;
            this.overlay = new Overlay({
              position: proj.fromLonLat([longitud, latitud]),
              element: document.getElementById(id),
              positioning: "center-center"
            });
            console.log(this.overlay)
            this.props.map.addOverlay(this.overlay);
          }
        } else {
          console.log("existia ovelay y id pero no esta activo entonces remuevo")
          this.props.map.removeOverlay(this.overlay);
        }
      }
    }
  

  render() {
    var alert = this.props.alert;
    var id = alert.id;
    id = id + 100
    console.log("i rendered")
    return (
      <React.Fragment>
        <div id={id} title="#overlay" className="pointer" onClick={() => this.props.selecting(alert)}>
          <FontAwesomeIcon icon="map-marker-alt" style={{display:'flex', flexDirection: 'row', color:"red", fontSize:"18px"}}/>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  alerts: state.posts.alerts,
  alertDataHolder: state.posts.alertDataHolder
})

export default connect(mapStateToProps, {selecting})(PopUp)