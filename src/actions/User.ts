import axios from "axios";
import jwtDecode from "jwt-decode";

export interface CurrentUser {
  id_cliente: number;
  usuario: string;
  email: string;
  iat: number;
}

export interface UserInfo {
  user: string;
  password: string;
}

export interface Productos {
  productos: Producto[];
}

export interface Producto {
  barcode: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  cliente: number;
  id_producto: number;
}

export const userLoginRequest = async (userInfo: UserInfo): Promise<string> => {
  const { user: usuario, password: contraseña } = userInfo;
  const response = await axios
    .post("/client_auth", {
      usuario,
      contraseña,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.status;
    });
  return response;
};

export const validateUser = async (): Promise<CurrentUser> => {
  const { token } = localStorage;
  const response = await axios.post("/tokenAuth", {
    token: token,
  });
  return jwtDecode(response.data);
};

export const getUsers = async (): Promise<Productos | []> => {
  const { id_cliente }: any = jwtDecode(localStorage.token);
  const response = await axios.post("/items", {
    id_cliente,
  });
  return response.data;
};

/*export const getCarrito = async (
  carrito: any,
  barcode: any,
  nombre: any,
  precio: any,
  stock: any
) => {
  let exists = false;
  console.log(barcode, nombre, precio, stock);
  carrito.map((item: any) => {
    if (item.barcode === barcode) {
      exists = true;
      item.cantidad = item.cantidad + 1;
    }
    return item;
  });
  if (!exists) {
    carrito.push({
      id: barcode,
      barcode: barcode,
      nombre: nombre,
      precio: precio,
      stock: stock,
      cantidad: 1,
    });
  }
  dispatch({
    type: FETCH_CART,
    payload: carrito,
  });
  var sumaTotal = 0;
  console.log(carrito);
  carrito.map(function (item) {
    var precio = parseFloat(item.precio) * parseInt(item.cantidad);
    console.log(precio);
    sumaTotal = parseFloat(sumaTotal) + parseFloat(precio);
    sumaTotal = parseFloat(sumaTotal).toFixed(2);
    console.log(sumaTotal, "soy sumaTotal");
  });
  console.log(sumaTotal, "termine el loop");
  dispatch({
    type: FETCH_TOTAL,
    payload: sumaTotal,
  });
};

export const erraseItem = (carrito, barcode, precio) => (dispatch) => {
  var aux = carrito.filter((item) => item.barcode !== barcode);
  dispatch({
    type: FETCH_CART,
    payload: aux,
  });
  var sumaTotal = 0;
  console.log(carrito);
  aux.map(function (item) {
    var precio = parseFloat(item.precio) * parseInt(item.cantidad);
    console.log(precio);
    sumaTotal = parseFloat(sumaTotal) + parseFloat(precio);
    sumaTotal = parseFloat(sumaTotal).toFixed(2);
    console.log(sumaTotal, "soy sumaTotal");
  });
  console.log(sumaTotal, "termine el loop");
  dispatch({
    type: FETCH_TOTAL,
    payload: sumaTotal,
  });
};

export const postVenta = (items, totalObj, id_cliente, btn) => (dispatch) => {
  var total = { total: totalObj };
  if (totalObj !== 0.0) {
    axios
      .post(API + "/venta", { items, total, id_cliente })
      .then((response) => {
        console.log(response);
        items = [];
        totalObj = 0.0;
        dispatch({
          type: FETCH_CART,
          payload: items,
        });
        dispatch({
          type: FETCH_TOTAL,
          payload: totalObj,
        });
        btn.removeAttribute("disabled");
        alert("Venta realizada");
      })
      .catch((err) => alert(err));
  } else {
    alert("Ingrese al menos un producto");
  }
};

export const cantidadChange = (items, barcode, cantidad) => (dispatch) => {
  var array = [];
  var sumaTotal = 0;
  array = items.map(function (item) {
    if (item.barcode === barcode) {
      item.cantidad = cantidad;
      var precio = parseFloat(item.precio) * parseInt(item.cantidad);
      sumaTotal = parseFloat(sumaTotal) + parseFloat(precio);
      sumaTotal = parseFloat(sumaTotal).toFixed(2);
      return item;
    } else {
      var precio = parseFloat(item.precio) * parseInt(item.cantidad);
      sumaTotal = parseFloat(sumaTotal) + parseFloat(precio);
      sumaTotal = parseFloat(sumaTotal).toFixed(2);
      return item;
    }
  });
  dispatch({
    type: FETCH_CART,
    payload: array,
  });
  dispatch({
    type: FETCH_TOTAL,
    payload: sumaTotal,
  });
};

export const getProductsFiltered = (nombre, tipo, id_cliente) => (dispatch) => {
  axios
    .post(API + "/items_filtered", {
      tipo,
      nombre,
      id_cliente,
    })
    .then((res) => {
      var users = res.data;
      dispatch({
        type: LIST_USERS,
        payload: users,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};*/
