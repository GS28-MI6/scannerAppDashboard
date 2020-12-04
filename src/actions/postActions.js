import {
  LOGIN_USER,
  LIST_USERS,
  LOGIN_ERR,
  FETCH_CART,
  FETCH_TOTAL
} from "./types";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const userLoginPost = userInfo => dispatch => {
  console.log(userInfo);
  var usuario = userInfo.email
  var contraseña = userInfo.password
  axios
    .post("http://177.71.157.129:4000/client_auth", {usuario, contraseña})
    .then(res => {
      console.log("client auth");
      localStorage.setItem("token", res.data);
      var decode = jwtDecode(res.data);
      dispatch({
        type: LOGIN_USER,
        payload: { decode }
      });
      console.log("centro monitoreo")
      window.location.href = "/";
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
        .post(`http://177.71.157.129:4000/tokenAuth`, { token: token })
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






export const getUsers = () => dispatch => {
  const token = localStorage.token;
  var decode = jwtDecode(token)
  var id_cliente = decode.id_cliente
  console.log(decode, decode.id_cliente)
  axios
    .post("http://177.71.157.129:4000/items", {id_cliente})
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

export const getCarrito = (carrito, barcode, nombre, precio, stock) => dispatch =>{

  let exists = false
  console.log(barcode, nombre, precio, stock)
  carrito.map((item) => {
    if(item.barcode === barcode){
      exists = true
      item.cantidad = item.cantidad + 1
    }
    return item
  })
  if(!exists){
    carrito.push({id:barcode, barcode: barcode, nombre: nombre, precio: precio, stock: stock, cantidad: 1})
  }
  dispatch({
    type: FETCH_CART,
    payload: carrito
  });
  var sumaTotal = 0
  console.log(carrito)
  carrito.map(function(item){
    var precio = parseFloat(item.precio) * parseInt(item.cantidad)
    console.log(precio)
    sumaTotal = parseFloat(sumaTotal) + parseFloat(precio)
    sumaTotal = parseFloat(sumaTotal).toFixed(2)
    console.log(sumaTotal, "soy sumaTotal")
  })
  console.log(sumaTotal, "termine el loop")
  dispatch({
    type: FETCH_TOTAL,
    payload: sumaTotal
  })
}

export const erraseItem = (carrito, barcode, precio) => dispatch =>{

   var aux = carrito.filter(item => item.barcode !== barcode)
  dispatch({
    type: FETCH_CART,
    payload: aux
  });
  var sumaTotal = 0
  console.log(carrito)
  aux.map(function(item){
    var precio = parseFloat(item.precio) * parseInt(item.cantidad)
    console.log(precio)
    sumaTotal = parseFloat(sumaTotal) + parseFloat(precio)
    sumaTotal = parseFloat(sumaTotal).toFixed(2)
    console.log(sumaTotal, "soy sumaTotal")
  })
  console.log(sumaTotal, "termine el loop")
  dispatch({
    type: FETCH_TOTAL,
    payload: sumaTotal
  })
}

export const postVenta = (items, totalObj, id_cliente) => dispatch =>{

  var total = {total:totalObj}
  if (totalObj !== 0.00) {
    axios
      .post("http://177.71.157.129:4000/venta", {items, total, id_cliente})
      .then((response) => {
        console.log(response)
        items = []
        totalObj = 0.00
        dispatch({
          type: FETCH_CART,
          payload: items
        });
        dispatch({
          type: FETCH_TOTAL,
          payload: totalObj
        })
        alert("Venta realizada")
      })
      .catch((err) => alert(err))
  } else {
    alert("Ingrese al menos un producto")
  }
}


export const cantidadChange = (items, barcode, cantidad) => dispatch =>{
  var array = []
  var sumaTotal = 0
  array = items.map(function(item){
    if (item.barcode === barcode){
      item.cantidad = cantidad
      var precio = parseFloat(item.precio) * parseInt(item.cantidad)
      sumaTotal = parseFloat(sumaTotal) + parseFloat(precio)
      sumaTotal = parseFloat(sumaTotal).toFixed(2)
      return item
    } else {
      var precio = parseFloat(item.precio) * parseInt(item.cantidad)
      sumaTotal = parseFloat(sumaTotal) + parseFloat(precio)
      sumaTotal = parseFloat(sumaTotal).toFixed(2)
      return item
    }
  })
  dispatch({
    type: FETCH_CART,
    payload: array
  });
  dispatch({
    type: FETCH_TOTAL,
    payload: sumaTotal
  })
}

export const getProductsFiltered = (nombre, tipo, id_cliente) => dispatch => {
  axios
    .post("http://177.71.157.129:4000/items_filtered", {tipo, nombre, id_cliente})
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
