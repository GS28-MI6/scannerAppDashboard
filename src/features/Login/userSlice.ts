import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReduxDispatch, RootState } from "../../app/store";
import { CurrentUser, userLoginRequest } from "../../actions/User";
import jwtDecode from "jwt-decode";
import { GeneralError } from "./../../app/store";
import { LoginResponse } from "../../actions/User";

export interface UserState {
  token: string;
  currentUser: CurrentUser;
  loading: boolean;
  errors: string[];
}

const initialState: UserState = {
  token: "",
  currentUser: {
    id_cliente: -1,
    email: "",
    usuario: "",
    iat: -1,
  },
  loading: false,
  errors: [],
};

// Async Thunks
export const authenticateLogin = createAsyncThunk<
  LoginResponse,
  { user: string; password: string },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>(
  "Auth/login",
  async (loginData: { user: string; password: string }, thunkAPI) => {
    try {
      const { ErrorCode, Errors, Token } = await userLoginRequest(loginData);
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
