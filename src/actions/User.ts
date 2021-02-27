import axios from "axios";
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

export type LoginResponse = ErrorsResponse & { Token: string };

export const userLoginRequest = async (
  userInfo: UserInfo
): Promise<LoginResponse> => {
  const { user: usuario, password: contraseña } = userInfo;
  const { data } = await axios.post("/client_auth", {
    usuario,
    contraseña,
  });
  return data;
};
