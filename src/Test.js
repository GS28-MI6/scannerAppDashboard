import React, { Component } from "react";
import axios from "axios";

export default class Test extends Component {
  componentDidMount() {
    axios
      .get("http://192.168.0.105:4000/app")
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return <div></div>;
  }
}
