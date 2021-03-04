import axios from "axios";
import { ErrorsResponse } from "./../app/store";

export interface CurrentUser {
  id_cliente: number;
  usuario: string;
  email: string;
  iat: number;
}

export interface UserRegisterInfo {
  email: string;
  user: string;
  password: string;
  phone: number;
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

// Client register

export type RegisterResponse = ErrorsResponse ;

export const userRegisterRequest = async (
  userRegisterInfo: UserRegisterInfo
): Promise<RegisterResponse> => {
  const { email, user: usuario, password: contraseña, phone: telefono } = userRegisterInfo;
  const { data } = await axios.post("/client_register", {
    email,
    usuario,
    contraseña,
    telefono,
  });
  return data;
};
