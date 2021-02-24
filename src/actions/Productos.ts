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

export interface Products {
  productos: Product[];
}

export interface Product {
  barcode: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  cliente: number;
  id_producto: number;
}

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
};
