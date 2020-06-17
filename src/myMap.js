import React, { Component } from "react";
import PopUp from "./popUp";

//OpenLayers
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import LayerTile from "ol/layer/Tile.js";
import SourceOSM from "ol/source/OSM.js";
import * as proj from "ol/proj";
import "./Map.css";
import { connect } from 'react-redux';

var centroCapSto = proj.fromLonLat([-59.7867, -34.1712]);
//Simulacion de recepcion de variables que necesito

class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = { center: centroCapSto, zoom: 15, trigger: this.props.trigger };

    this.map = new Map({
      target: null, // set this in componentDidMount
      layers: [
        new LayerTile({
          source: new SourceOSM()
        })
      ],
      view: new View({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });
    this.stateHeight = { heightHolder: 0 };
    this.stateHeight.heightHolder = window.innerHeight - 50;
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateMap = this.updateMap.bind(this);
  }
  
  updateMap() {
    if (this.props.alertDataHolder.longitud !== undefined && this.props.alertDataHolder.longitud !== 0){
      var long = this.props.alertDataHolder.longitud
      var lat = this.props.alertDataHolder.latitud
      centroCapSto = proj.fromLonLat([long, lat]);
      this.map.getView().setCenter(centroCapSto);
      this.map.getView().setZoom(16);
    }else{
      this.map.getView().setCenter(this.state.center);
      this.map.getView().setZoom(this.state.zoom);
    }
  }

  componentDidMount() {
    this.map.setTarget("map");
    // Listen to map changes

    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.stateHeight.heightHolder = window.innerHeight - 50;
  }

  componentWillUnmount() {
    this.map.setTarget(null);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  render() {
    this.updateMap();
    var height = this.stateHeight.heightHolder;
    var mapa = this.map;
    return (
      <React.Fragment>
        <div id="map" style={{ width: "100%", height: height }} />
        {this.props.alerts.map(function(alert) {
            var popUpId = alert.id + 300;
            return <PopUp id={popUpId} alert={alert} map={mapa} />;
        })}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  alerts: state.posts.alerts,
  alertDataHolder: state.posts.alertDataHolder
})

export default connect(mapStateToProps, null)(MyMap)