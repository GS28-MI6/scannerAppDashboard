import { ErrorsResponse } from './../../app/store';
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReduxDispatch, RootState, GeneralError } from "../../app/store";
import { CartItems, Cart, cantidadChange, erraseItem, fetchProduct, CartResponse, postSale } from "../../actions/Ventas"
export interface VentasState {
    cart: CartItems;
    total: number;
    errors: string[];
    loading: boolean;
}

const initialState: VentasState = {
    cart: [],
    total: 0,
    errors: [],
    loading: false
}

export type UpdateCart = CartItems & {barcode: number; quantity:number;total: number}

export const updateQuantity = createAction("Venta/changeQantity", (cart: CartItems, barcode:number, quantity:number, total:number) => {
    const { cartItems, totalPrice } = cantidadChange(cart, barcode, quantity, total)
    return { payload: {cartItems, totalPrice}}
})

export const removeItem = createAction("Venta/removeItem", (cart: CartItems, barcode:number, total:number) => {
    const { cartItems, totalPrice } = erraseItem(cart, barcode, total)
    return { payload: {cartItems, totalPrice}}
})

export const getProduct = createAsyncThunk<
  CartResponse,
  { barcode: number, id_cliente: number, totalPrice: number },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>("Venta/getProduct", async ( data: { barcode: number, id_cliente: number, totalPrice: number} , thunkAPI) => {
  try {
    const { barcode, id_cliente, totalPrice } = data
    const { ErrorCode, Errors, Product } = await fetchProduct(barcode, id_cliente);
    let Total = totalPrice
    Total += Product.precio*Product.quantity
    return { Errors, ErrorCode, Product, Total };
  } catch (err) {
    const error: GeneralError = {
      message: err.message,
      name: err.name,
    };
    return thunkAPI.rejectWithValue(error);
  }
});

export const confirmSale = createAsyncThunk<
  ErrorsResponse,
  { items: Cart , barcode: number, id_cliente: number },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>("Venta/confirmSale", async ( data: { items: Cart, barcode: number, id_cliente: number } , thunkAPI) => {
  try {
    const { ErrorCode, Errors} = await postSale(data.items, data.barcode, data.id_cliente);
    return { Errors, ErrorCode};
  } catch (err) {
    const error: GeneralError = {
      message: err.message,
      name: err.name,
    };
    return thunkAPI.rejectWithValue(error);
  }
});

export const ventasSlice = createSlice({
    name: "userRegister",
    initialState,
    reducers: {
        clearErrors: (state) => {
          state.errors = initialState.errors;
        },

      },
    extraReducers: (builder) => {
        builder.addCase(updateQuantity, (state, { payload }) => {
            state.cart = payload.cartItems;
            state.total = payload.totalPrice;
        });
        builder.addCase(removeItem, (state, { payload }) => {
            state.cart = payload.cartItems;
            state.total = payload.totalPrice;
        });
        builder.addCase(confirmSale.fulfilled, (state, { payload }) => {
            state.cart = [];
            state.total = 0;
        });
        builder.addCase(confirmSale.rejected, (state, { payload }) => {
            const message = payload?.message || "Error";
            state.errors = [...state.errors, message];
        });
        builder.addCase(getProduct.fulfilled, (state, { payload }) => {
            state.cart = [...state.cart, payload.Product]
            state.total = payload.Total;
        });
        builder.addCase(getProduct.rejected, (state, { payload }) => {
            const message = payload?.message || "Error";
            state.errors = [...state.errors, message];
        });
    }
  });

  export const { clearErrors } = ventasSlice.actions;

export const cartSelector = (state: RootState) => state.ventas.cart
export const totalSelector = (state: RootState) => state.ventas.total
export const errorsSelector = (state: RootState) => state.ventas.errors



export default ventasSlice.reducer;
