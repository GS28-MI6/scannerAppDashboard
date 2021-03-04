import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReduxDispatch, RootState, GeneralError } from "../../app/store";
import { CurrentUser, userRegisterRequest } from "../../actions/User";
import { RegisterResponse } from "../../actions/User";

export interface UserRegisterState {
  token: string;
  currentUser: CurrentUser;
  loading: boolean;
  errors: string[];
}

const initialState: UserRegisterState = {
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
export const registerClient = createAsyncThunk<
  RegisterResponse,
  { email: string; user: string; password: string; phone: number },
  { dispatch: ReduxDispatch; state: RootState; rejectValue: GeneralError }
>(
  "Auth/register",
  async (RegisterData: { email: string; user: string; password: string; phone: number }, thunkAPI) => {
    try {
      const { ErrorCode, Errors } = await userRegisterRequest(RegisterData);
      return { ErrorCode, Errors }
    } catch (err) {
      const error: GeneralError = {
        message: err.message,
        name: err.name,
      };
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = initialState.errors;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerClient.fulfilled, (state, { payload }) => {
      if (payload.Errors.length > 0) {
        state.errors = payload.Errors;
      } else {
        state.errors = initialState.errors;
      }
      state.loading = false;
    });
    builder.addCase(registerClient.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerClient.rejected, (state, { payload }) => {
      state.loading = false;
      const message = payload?.message || "Error";
      state.errors = [...state.errors, message];
    });
  },
});

// Logout action is handled in root reducer to reset all complete state
export const logout = createAction("logout");

export const { clearErrors } = userRegisterSlice.actions;

export const userSelector = (state: RootState) => state.userRegister.currentUser;
export const tokenSelector = (state: RootState) => state.userRegister.token;
export const loadingSelector = (state: RootState) => state.userRegister.loading;
export const errorsSelector = (state: RootState) => state.userRegister.errors;

export default userRegisterSlice.reducer;
