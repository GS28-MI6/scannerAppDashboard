import {
  FETCH_POSTS,
  NEW_POST,
  NEW_DIR,
  SELECT_ALERT,
  LOGIN_USER,
  COUNT_ALERTS,
  LIST_USERS,
  PENDING_USERS,
  MAP_SHOW,
  LOGIN_ERR
} from "./types";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const userLoginPost = userInfo => dispatch => {
  console.log(userInfo);
  axios
    .post(`http://18.230.143.84:4000/monitoreo_auth`, {
      email: userInfo.email,
      password: userInfo.password
    })
    .then(res => {
      console.log("client auth");
      localStorage.setItem("token", res.data);
      var decode = jwtDecode(res.data);
      dispatch({
        type: LOGIN_USER,
        payload: { decode }
      });
      if(userInfo.url === "/login"){
        console.log("centro monitoreo")
        window.location.href = "/";
      }else{
        if(userInfo.url === "/login_ingreso_manual"){
          console.log("ingreso manual")
          window.location.href = "/ingreso_manual";
        }
      }
      console.log(res);
    })
    .catch(err => {
      const error = 1
      dispatch({
        type: LOGIN_ERR,
        payload: { error }
      });
    });
};

export function validateUser() {
  return dispatch => {
    const token = localStorage.token;
    console.log("vali user");
    if (token) {
      axios
        .post(`http://18.230.143.84:4000/tokenAuth`, { token: token })
        .then(res => {
          console.log("client auth");
          var decode = jwtDecode(token);
          console.log(decode);
          dispatch({
            type: "LOGIN_USER",
            payload: { decode }
          });
          console.log(res);
          if (res.status === 400) {
            localStorage.removeItem("token");
            alert("Error logging in please try again");
          }
        })
        .catch(err => {
          console.log("catch is running");
          localStorage.removeItem("token");
        });
    }
  };
}

export const usersNotification = () => dispatch => {
  axios
    .get("http://18.230.143.84:4000/pending_users")
    .then(res => {
      var pendingUsers = res.data[0];
      dispatch({
        type: PENDING_USERS,
        payload: pendingUsers
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const mapShower = (userState, id) => dispatch => {
  const token = localStorage.token;
  axios
    .post(`http://18.230.143.84:4000/showOnMap`, { userState, id })
    .then(res => {
      console.log(res);
      dispatch({
        type: "MAP_SHOW",
        payload: res.data
      });
    })
    .catch(err => {
      console.log("catch is running");
      localStorage.removeItem("token");
    });
};


export const fetchPosts = () => dispatch => {
  console.log("action but no axios");
  axios
    .get("http://18.230.143.84:4000/app")
    .then(res => {
      console.log("fetch posts");
      var alerts = res.data;
      dispatch({
        type: FETCH_POSTS,
        payload: alerts
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const countAlerts = () => dispatch => {
  axios
    .post("http://18.230.143.84:4000/count")
    .then(res => {
      var counts = res.data;
      dispatch({
        type: COUNT_ALERTS,
        payload: counts
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const countAlertsFiltered = (desde, hasta) => dispatch => {
  axios
    .post("http://18.230.143.84:4000/count", { desde, hasta })
    .then(res => {
      var counts = res.data;
      dispatch({
        type: COUNT_ALERTS,
        payload: counts
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const getUsers = () => dispatch => {
  axios
    .get("http://18.230.143.84:4000/user_list")
    .then(res => {
      var users = res.data;
      dispatch({
        type: LIST_USERS,
        payload: users
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const activateUser = user => {
  console.log(user);
  axios.post(`http://18.230.143.84:4000/activation`, { user }).then(res => {
    console.log(res);
  });
};

export const postStateDataHolder = (datos, state) => {
  console.log(datos, state);
  datos.state = state;
  var data = datos;
  axios.post(`http://18.230.143.84:4000/changeState`, { data }).then(res => {
    console.log(res);
  });
};

export const postState = (datos) => dispatch => {
  var data = datos;
  axios.post(`http://18.230.143.84:4000/changeState`, { data }).then(res => {
    console.log(res);
  });
};

export const postDireccion = (datos) => dispatch => {
  console.log("al menos vine")
  var data = datos;
  axios.post(`http://18.230.143.84:4000/changeAddress`, { data }).then(res => {
    console.log(res);
  });
};

export const selecting = alert => dispatch => {
  dispatch({ type: SELECT_ALERT, payload: alert });
  var lon = alert.longitud;
  var lat = alert.latitud;
  axios
    .get(
      "http://nominatim.openstreetmap.org/reverse?format=json&lon=" +
        lon +
        "&lat=" +
        lat
    )
    .then(res => {
      console.log(res.data);
      dispatch({
        type: NEW_DIR,
        payload: res.data
      });
    });
};

export const createPost = event => dispatch => {
  var eventDataHolder = event.data;
  console.log(eventDataHolder);
  var lon = eventDataHolder[0].longitud;
  var lat = eventDataHolder[0].latitud;
  console.log(lon, lat);
  axios.get("http://18.230.143.84:4000/app").then(res => {
    console.log(res.data);
    var dataJSON = eventDataHolder;
    dataJSON = dataJSON[0];
    dispatch({
      type: NEW_POST,
      payloadAlerts: res.data,
      payloadAlert: dataJSON
    });
  });
  console.log("finished first axios", lon, lat);
  axios
    .get(
      "http://nominatim.openstreetmap.org/reverse?format=json&lon=" +
        lon +
        "&lat=" +
        lat
    )
    .then(res => {
      console.log(res.data);
      dispatch({
        type: NEW_DIR,
        payload: res.data
      });
    });
};
