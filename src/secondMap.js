import React, { Component } from "react";
import ReactDOM from 'react-dom';
import AlertCard from './AlertCard';

//OpenLayers
import 'ol/ol.css';
import Map from "ol/Map.js";
import View from "ol/View.js";
import Overlay from "ol/Overlay.js";
import LayerTile from "ol/layer/Tile.js";
import SourceOSM from "ol/source/OSM.js";
import * as proj from 'ol/proj';
import './Map.css';

//Simulacion de recepcion de variables que necesito
const array = [];



var centroCapSto = proj.fromLonLat([-59.7867, -34.1712]);
var ubicacion = centroCapSto;

if(alertStatus == 'activo'){
  ubicacion = proj.fromLonLat([longitud, latitud]);
}

export default class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = { center: ubicacion, zoom: 15 };

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
  }
  
  componentDidMount() {
    this.map.setTarget("map");
    // Listen to map changes
    this.map.on("moveend", () => {
      let center = this.map.getView().getCenter();
      let zoom = this.map.getView().getZoom();
      this.setState({ center, zoom });
    });
    
    if(alertStatus == 'activo'){
      // Basic overlay
      const overlay = new Overlay({
        position: ubicacion,
        element: ReactDOM.findDOMNode(this).querySelector('#alerta'),
        positioning: 'center-center',
        stopEvent: false
      });
      this.map.addOverlay(overlay);
    }

    /* Popup showing the position the user clicked
    this.popup = new Overlay({
      element: ReactDOM.findDOMNode(this).querySelector('#popup')
    });

    // Listener to add Popup overlay showing the position the user clicked
    this.map.on('click', evt => {
      this.popup.setPosition(evt.coordinate);
      this.map.addOverlay(this.popup);
    })*/
  }

  componentWillUnmount() {
    this.map.setTarget(null);
  }

  render() {
    return this.props.alerts.map((alert) => (
      <div>
        <div id="map" style={{ width: "100%", height: "55rem" }}/>
        <div className="blue-circle" id="alerta" title="alerta">
          (<AlertCard key={alert._id} alert={alert}/>));
        </div>
      </div>
    ));
  }
}