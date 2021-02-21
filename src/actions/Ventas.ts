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
