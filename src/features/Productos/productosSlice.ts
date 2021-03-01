import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { NormalizedResponse, ReduxDispatch, RootState } from "../../app/store";
import { GeneralError } from "../../app/store";
import { getProductsFiltered, Product } from "../../actions/Productos";
import { normalize, schema } from "normalizr";
import { getCategories } from "./../../actions/Productos";
import { ErrorsResponse } from "./../../app/store";

// Normalizr configuration
const producto = new schema.Entity(
  "productosObtenidos",
  {},
  { idAttribute: "id_producto" }
);

const productosAdapter = createEntityAdapter<Product>({
  selectId: (p) => p.id_producto,
});

export interface ProductosState {
  productos: EntityState<Product>;
  loadingProductos: boolean;
  errorsProductos: string[];
  categorias: { _id: string; name: string }[];
  loadingCategorias: boolean;
  errorsCategorias: string[];
}

const initialState: ProductosState = {
  productos: productosAdapter.getInitialState(),
  loadingProductos: false,
  errorsProductos: [],
  categorias: [],
  loadingCategorias: false,
  errorsCategorias: [],
};

// Async Thunks
export const getProducts = createAsyncThunk<
  NormalizedResponse<Product>,
  { nombre: string; tipo: string; token: any },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>(
  "Products/getProducts",
  async (data: { nombre: string; tipo: string; token: any }, thunkAPI) => {
    try {
      const { ErrorCode, Errors, Productos } = await getProductsFiltered(data);
      const normalized = normalize(Productos, [producto]);
      return {
        Errors,
        ErrorCode,
        data: { ...normalized.entities.productosObtenidos },
      };
    } catch (err) {
      const error: GeneralError = {
        message: err.message,
        name: err.name,
      };
      return thunkAPI.rejectWithValue(error);
    }
  }
);

type CategoriesResponse = {
  categorias: { _id: string; name: string }[];
} & ErrorsResponse;
export const getCategorias = createAsyncThunk<
  CategoriesResponse,
  { token: string },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>("Products/getCategories", async (data: { token: string }, thunkAPI) => {
  try {
    const { ErrorCode, Errors, Categorias } = await getCategories(data.token);
    const categorias: { _id: string; name: string }[] = [];
    Categorias.forEach((c) =>
      categorias.push({ _id: c.categoria, name: c.categoria })
    );
    return { Errors, ErrorCode, categorias };
  } catch (err) {
    const error: GeneralError = {
      message: err.message,
      name: err.name,
    };
    return thunkAPI.rejectWithValue(error);
  }
});

export const productosSlice = createSlice({
  name: "productos",
  initialState,
  reducers: {
    clearErrorsProductos: (state) => {
      state.errorsProductos = initialState.errorsProductos;
    },
    clearErrorsCategorias: (state) => {
      state.errorsCategorias = initialState.errorsCategorias;
    },
  },
  extraReducers: (builder) => {
    //Productos
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      if (payload.Errors.length > 0) {
        state.errorsProductos = payload.Errors;
      } else {
        productosAdapter.setAll(
          state.productos,
          (payload.data as { [id: string]: Product }) || []
        );
        state.errorsProductos = initialState.errorsProductos;
      }
      state.loadingProductos = false;
    });
    builder.addCase(getProducts.pending, (state) => {
      state.loadingProductos = true;
    });
    builder.addCase(getProducts.rejected, (state, { payload }) => {
      const message = payload?.message || "Error";
      state.errorsProductos = [...state.errorsProductos, message];
      state.loadingProductos = false;
    });
    //Categorias
    builder.addCase(getCategorias.fulfilled, (state, { payload }) => {
      if (payload.Errors.length > 0) {
        state.errorsCategorias = payload.Errors;
      } else {
        state.categorias = payload.categorias;
        state.errorsCategorias = initialState.errorsCategorias;
      }
      state.loadingCategorias = false;
    });
    builder.addCase(getCategorias.pending, (state) => {
      state.loadingCategorias = true;
    });
    builder.addCase(getCategorias.rejected, (state, { payload }) => {
      const message = payload?.message || "Error";
      state.errorsCategorias = [...state.errorsCategorias, message];
      state.loadingCategorias = false;
    });
  },
});

export const {
  clearErrorsProductos,
  clearErrorsCategorias,
} = productosSlice.actions;

export const {
  selectById: productosByIdSelector,
  selectIds: productosIdsSelector,
  selectEntities: productosEntitiesSelector,
  selectAll: productosAllSelector,
  selectTotal: productosTotalSelector,
} = productosAdapter.getSelectors<RootState>(
  (state) => state.productos.productos
);

export const loadingProductosSelector = (state: RootState) =>
  state.productos.loadingProductos;
export const errorsProductosSelector = (state: RootState) =>
  state.productos.errorsProductos;

export const categoriasSelector = (state: RootState) =>
  state.productos.categorias;
export const loadingCategoriasSelector = (state: RootState) =>
  state.productos.loadingCategorias;
export const errorsCategoriasSelector = (state: RootState) =>
  state.productos.errorsCategorias;

export default productosSlice.reducer;
