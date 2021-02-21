import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ReduxDispatch, RootState } from "../../app/store";
import { CurrentUser, userLoginRequest } from "../../actions/User";
import jwtDecode from "jwt-decode";
import { GeneralError } from "./../../app/store";

export interface UserState {
  token: string;
  currentUser: CurrentUser;
  loading: boolean;
  error: string;
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
  error: "",
};

// Async Thunks

export const authenticateLogin = createAsyncThunk<
  string,
  { user: string; password: string },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>(
  "Auth/login",
  async (loginData: { user: string; password: string }, thunkAPI) => {
    try {
      return await userLoginRequest(loginData);
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
    clearError: (state) => {
      state.error = initialState.error;
    },
  },
  extraReducers: {
    [authenticateLogin.fulfilled.toString()]: (
      state,
      action: PayloadAction<string>
    ) => {
      //if (action.payload.Errors?.length > 0) {
      //state.errors = action.payload.Errors;
      if (!isNaN(Number(action.payload))) {
        //FIX TO RECIEVE AN ERROR AND A CODE AS ABOVE
        state.error = "Usuario y/o contraseña incorrecto/s";
      } else {
        state.token = action.payload;
        state.currentUser = jwtDecode(action.payload);
        state.error = initialState.error;
      }
      state.loading = false;
    },
    [authenticateLogin.pending.toString()]: (state) => {
      state.loading = true;
    },
    [authenticateLogin.rejected.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.error = action.payload.Error || initialState.error;
      state.loading = false;
    },
  },
});

// Logout action is handled in root reducer to reset all complete state
export const logout = createAction("logout");

export const { clearError } = userSlice.actions;

export const userSelector = (state: RootState) => state.user.currentUser;
export const tokenSelector = (state: RootState) => state.user.token;
export const loadingSelector = (state: RootState) => state.user.loading;
export const errorSelector = (state: RootState) => state.user.error;

export default userSlice.reducer;
