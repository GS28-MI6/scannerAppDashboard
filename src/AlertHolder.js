import React, { Component } from "react";
import AlertCard from "./AlertCard";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchPosts, createPost } from "./actions/postActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import io from "socket.io-client";
import "./css/alertHolder.css";
import axios from "axios";

library.add(fas, fab);

const socket = io("http://18.230.143.84:4000", {
  transports: ["websocket", "polling"]
});

class AlertHolder extends Component {
  constructor(props) {
    super(props);
    this.mapReset = this.mapReset.bind(this);
    console.log("alertholder constructor");
  }

  // getAlertData(dataFound) {
  //   var dataRecieved = dataFound;
  //   this.props.data(dataRecieved);
  // }

  componentDidMount() {
    console.log("behind fetch component did mount");
    this.props.fetchPosts();

    // this.events.onmessage = event => {
    //   this.props.createPost(event);
    // };
    // this.mapAlert.onmessage = event => {
    //   this.props.fetchPosts();
    // }
    socket.on("alerta_enviada", datosAlerta => {
      console.log("alerta fking emitida!!!!!!");
      console.log(datosAlerta);
      this.props.createPost(datosAlerta);
    });
    socket.on("cambiar_estado", datosAlerta => {
      console.log("estado fking cambiado!!!!!!");
      console.log(datosAlerta);
      this.props.createPost(datosAlerta);
    });
    socket.on("mapa_actualizad0", datosAlerta => {
      console.log("mapa fking actualizado!!!!!!");
      console.log(datosAlerta);
      this.props.fetchPosts();
    });
  }

  mapReset() {
    console.log("im resettting map");
    axios.get("http://18.230.143.84:4000/mapReset");
    window.location.href = "/";
  }

  render() {
    console.log("alertholder render");
    return (
      <div>
        <div className="textLabel">
          <h1 className="textAlertas">
            <FontAwesomeIcon
              icon="exclamation-triangle"
              style={{ display: "flex", flexDirection: "row" }}
            />
            Historial de alertas:
          </h1>
        </div>
        <div className="textLabel">
          <h2 className="buttonReset"
            onClick={() => this.mapReset()}
            type="button"
          >
          <FontAwesomeIcon
            icon="redo-alt"
            style={{ display: "flex", flexDirection: "row", marginRight: "10px" }}
          />
            Desmarcar todas
          </h2>
        </div>
        {this.props.alerts.map(function(alert, idx) {
          return <AlertCard key={idx} alert={alert} data={this.getAlertData} />;
        }, this)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  alerts: state.posts.alerts,
  alertDataHolder: state.posts.alertDataHolder
});

export default connect(mapStateToProps, { fetchPosts, createPost })(
  AlertHolder
);
