import React from "react";
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import { connect } from "react-redux";
import { usersNotification } from "./actions/postActions";

function SwitchComponent(estado, correo) {
  console.log(estado);
  var bool = estado.estado === 1;
  console.log(bool);
  const [state, setState] = React.useState({
    habilitado: bool
  });
  console.log(state.habilitado);

  const handleChange = name => event => {
    console.log(event.target.checked);
    setState({ ...state, [name]: event.target.checked });

    var userState = event.target.checked;
    console.log(userState);
    var email = estado.correo;
    axios
      .post(`http://18.230.143.84:4000/activation`, { userState, email })
      .then(res => {
        console.log("activated", res);
        window.location.href = "/users";
      });
  };

  return (
    <Switch
      checked={state.habilitado}
      onChange={handleChange("habilitado")}
      value="checkedA"
      color="primary"
      inputProps={{ "aria-label": "secondary checkbox" }}
    />
  );
}

export default connect(null, { usersNotification })(SwitchComponent);
