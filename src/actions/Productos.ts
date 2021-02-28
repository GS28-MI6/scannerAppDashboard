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

export interface Products {
  Productos: Product[];
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

export interface Categories {
  Categorias: { categoria: string }[];
}

type ProductsResponse = Products & ErrorsResponse;

export type CategoriesResponse = Categories & ErrorsResponse;

export const getProductsFiltered = async (filterData: {
  nombre: string;
  tipo: string;
  token: string;
}): Promise<ProductsResponse> => {
  const { nombre, tipo, token } = filterData;
  const { id_cliente }: any = jwtDecode(token);
  const response = await axios.post("/productos", {
    id_cliente,
    tipo,
    nombre,
  });
  return response.data;
};

export const getCategories = async (
  token: string
): Promise<CategoriesResponse> => {
  const { id_cliente }: any = jwtDecode(token);
  const response = await axios.post("/categorias", { id_cliente });
  return response.data;
};
