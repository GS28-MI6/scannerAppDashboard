
import axios from "axios";
import { ErrorsResponse } from "./../app/store";

export interface Cart {
  barcode: number;
  nombre: string;
  precio: number;
  stock: number;
  quantity: number;
}

export type CartItems = Cart[]

export const cantidadChange = (cartItems: CartItems, barcode: number, quantity: number, total:number) => {
    
    let auxTotal: number = 0
    let aux = cartItems.map(item => {
        if(item.barcode === barcode) {
            item.quantity = quantity
            auxTotal += item.precio*item.quantity
            return item
        } else {
            auxTotal += item.precio*item.quantity
            return item
        }
    })
    let response = {
        cartItems: aux,
        totalPrice: auxTotal
    }
    return response
}

export const erraseItem = (cartItems: CartItems, barcode: number, total: number) => {
    let auxTotal = total;
    let aux = cartItems.map(item => {
        if (item.barcode === barcode){
            auxTotal = total - item.precio
            return item
        } else return item
    })
    aux = aux.filter(item => {
        return item.barcode !== barcode
    })
    let response = {
        cartItems: aux,
        totalPrice: auxTotal
    }
    return response
}
export type CartResponse = {Product: Cart, Total: number} & ErrorsResponse

export const fetchProduct = async (
    barcode: number,
    id_cliente: number
  ): Promise<CartResponse> => {
    const { data } = await axios.post("/item", {
      barcode,
      id_cliente
    });
    return data;
  };

export const postSale = async (
    items: Cart,
    total: number,
    id_cliente: number
  ): Promise<ErrorsResponse> => {
    const { data } = await axios.post("/item", {
        items,
        total,
        id_cliente
    });
    return data;
  };