import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { CurrentUser } from "../actions/User";

interface UserState {
  currentUser: CurrentUser | {};
  loadingCurrentUser: boolean;
  errorsCurrenUser: string[];
}

const initialState: UserState = {
  currentUser: {},
  loadingCurrentUser: false,
  errorsCurrenUser: [],
};

const fetchPlayerList = createAsyncThunk(
  "users/fetchByIdStatus",
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = initialState.currentUser;
      localStorage.removeItem("token");
    },
  },
  extraReducers: {
    [fetchPlayerList.pending.type]: (state, action) => {
      state.playerList = {
        status: "loading",
        data: {},
        error: {},
      };
    },
    [fetchPlayerList.fulfilled.type]: (state, action) => {
      state.playerList = {
        status: "idle",
        data: action.payload,
        error: {},
      };
    },
    [fetchPlayerList.rejected.type]: (state, action) => {
      state.playerList = {
        status: "idle",
        data: {},
        error: action.payload,
      };
    },
  },
});

export const { clearUser } = userSlice.actions;

export const userSelector = (state: RootState) => state.user.currentUser;

export const usernameSelector = (state: RootState) =>
  state.user.currentUser.usuario;

export default userSlice.reducer;
