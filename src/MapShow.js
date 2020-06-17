import React from "react";
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import { connect } from "react-redux";
import { usersNotification, mapShower, selecting } from "./actions/postActions";

function MapShow(estado, id) {
  console.log(estado);
  var bool = estado.estado === 1;
  console.log(bool);
  var [state, setState] = React.useState({
    habilitado: bool
  });
  console.log(state.habilitado);

  const handleChange = name => event => {
    console.log(event.target.checked);
    setState({ ...state, [name]: event.target.checked });

    var userState = event.target.checked;
    console.log(userState);
    var id = estado.id;
    axios
      .post(`http://18.230.143.84:4000/showOnMap`, { userState, id })
      .then(res => {
        console.log(res.data[0]);
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

export default connect(null, { usersNotification, mapShower, selecting })(
  MapShow
);
