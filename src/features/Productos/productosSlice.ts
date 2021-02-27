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
  loading: boolean;
  errors: string[];
}

const initialState: ProductosState = {
  productos: productosAdapter.getInitialState(),
  loading: false,
  errors: [],
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

export const productosSlice = createSlice({
  name: "productos",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = initialState.errors;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      if (payload.Errors.length > 0) {
        state.errors = payload.Errors;
      } else {
        productosAdapter.setAll(
          state.productos,
          (payload.data as { [id: string]: Product }) || []
        );
        state.errors = initialState.errors;
      }
      state.loading = false;
    });
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProducts.rejected, (state, { payload }) => {
      const message = payload?.message || "Error";
      state.errors = [...state.errors, message];
      state.loading = false;
    });
  },
});

export const { clearErrors } = productosSlice.actions;

export const {
  selectById: productosByIdSelector,
  selectIds: productosIdsSelector,
  selectEntities: productosEntitiesSelector,
  selectAll: productosAllSelector,
  selectTotal: productosTotalSelector,
} = productosAdapter.getSelectors<RootState>(
  (state) => state.productos.productos
);

export const loadingSelector = (state: RootState) => state.productos.loading;
export const errorsSelector = (state: RootState) => state.productos.errors;

export default productosSlice.reducer;
