import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReduxDispatch, RootState } from "../../app/store";
import { CurrentUser, userLoginRequest } from "../../actions/User";
import jwtDecode from "jwt-decode";
import { GeneralError } from "../../app/store";
import { LoginResponse } from "../../actions/User";
import { getProductsFiltered } from "./../../actions/Many Old Functions";

export interface UserState {
  productos: any[];
  loading: boolean;
  errors: string[];
}

const initialState: UserState = {
  productos: [],
  loading: false,
  errors: [],
};

// Async Thunks
export const getProducts = createAsyncThunk<
  LoginResponse,
  { name: string; category: string },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>(
  "Products/getProducts",
  async (data: { name: string; category: string }, thunkAPI) => {
    try {
      const { ErrorCode, Errors, Token } = await getProductsFiltered(data);
      console.log(ErrorCode, Errors, Token);
      return { Token, ErrorCode, Errors };
    } catch (err) {
      const error: GeneralError = {
        message: err.message,
        name: err.name,
      };
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = initialState.errors;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authenticateLogin.fulfilled, (state, { payload }) => {
      if (payload.Errors.length > 0) {
        state.errors = payload.Errors;
      } else {
        state.token = payload.Token;
        state.currentUser = jwtDecode(payload.Token);
        state.errors = initialState.errors;
      }
      state.loading = false;
    });
    builder.addCase(authenticateLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(authenticateLogin.rejected, (state, { payload }) => {
      state.loading = false;
      const message = payload?.message || "Error";
      state.errors = [...state.errors, message];
    });
  },
});

// Logout action is handled in root reducer to reset all complete state
export const logout = createAction("logout");

export const { clearErrors } = userSlice.actions;

export const userSelector = (state: RootState) => state.user.currentUser;
export const tokenSelector = (state: RootState) => state.user.token;
export const loadingSelector = (state: RootState) => state.user.loading;
export const errorsSelector = (state: RootState) => state.user.errors;

export default userSlice.reducer;
