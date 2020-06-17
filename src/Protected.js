import React, { Component } from "react";
import AlertHolder from "./AlertHolder";
import DataHolder from "./DataHolder";
import Map from "./myMap";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import io from "socket.io-client";
import UIfx from "uifx";
import bellAudio from "./resources/alertSoundFx.mp3";

const bell = new UIfx(bellAudio);

library.add(fas, fab);

const socket = io("http://18.230.143.84:4000", {
  transports: ["websocket", "polling"]
});

class Protected extends Component {
  constructor(props) {
    super(props);
    var heightHolder = window.innerHeight - 50;
    this.stateHeight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
    this.faicon = "chevron-right";
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.alertHolderHider = this.alertHolderHider.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    this.alertHolder = document.getElementById("alertHolder");
    window.addEventListener("resize", this.updateWindowDimensions);
    console.log(this.props.currentUser.decode);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    console.log("im resizing");
    var heightHolder = window.innerHeight - 50;
    this.stateheight = {
      height: window.innerHeight,
      heightHolder: heightHolder
    };
  }

  alertHolderHider() {
    console.log("i aldo runned");
    if (this.alertHolder.style.display === "flex") {
      this.alertHolder.style.display = "none";
    } else {
      this.alertHolder.style.display = "flex";
    }
  }

  render() {
    return (
      <div
        className="container"
        style={{ height: this.stateHeight.heightHolder }}
      >
        <div className="alertHolderCss" id="alertHolder">
          <AlertHolder />
        </div>
        <div className="alertHolderHider" onClick={this.alertHolderHider}>
          <FontAwesomeIcon
            icon="exchange-alt"
            style={{ display: "flex", flexDirection: "row" }}
          />
        </div>
        <div
          className="mapaAlerta"
          style={{ height: this.stateHeight.heightHolder }}
        >
          <Map />
        </div>
        <div className="alertDataHolder">
          <DataHolder />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.posts.currentUser
});

export default connect(mapStateToProps /*{ postStateDataHolder }*/)(Protected);
