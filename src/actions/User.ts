import axios from "axios";
import jwtDecode from "jwt-decode";
import { ErrorsResponse } from "./../app/store";

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

type LoginResponse = ErrorsResponse & string;

export const userLoginRequest = async (
  userInfo: UserInfo
): Promise<LoginResponse> => {
  const { user: usuario, password: contraseña } = userInfo;
  return await axios.post("/client_auth", { usuario, contraseña });
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
