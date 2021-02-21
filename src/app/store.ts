/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  configureStore,
  ThunkAction,
  Action,
  ThunkDispatch,
  combineReducers,
  getDefaultMiddleware,
  Dictionary,
  AnyAction,
  CombinedState,
} from "@reduxjs/toolkit";
import userReducer, { UserState, logout } from "../features/Login/userSlice";
import { useDispatch } from "react-redux";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from "redux-persist";

// Transformations that do not persist errors and loading data

const UserTransform = createTransform<
  UserState,
  Omit<UserState, "error" | "loading">
>(
  (inboundState, key) => {
    const {
      loading,
      error,
      ...userStateWithoutLoadersAndErrors
    } = inboundState;
    return userStateWithoutLoadersAndErrors;
  },
  (outboundState, key) => {
    return { ...outboundState, loading: false, error: "" };
  },
  { whitelist: ["user"] }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
  transforms: [UserTransform],
};

const combinedReducers = combineReducers({
  user: userReducer,
});

type CombinedStateType = CombinedState<{
  user: UserState;
}>;

// handles resetting all the redux state
export const rootReducer: any = (
  state: CombinedStateType | undefined,
  action: AnyAction
) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return combinedReducers(state, action);
};

const persistedReducer: any = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

const persistor = persistStore(store);

const confStore = { store, persistor };

export default confStore;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type ReduxDispatch = ThunkDispatch<RootState, any, Action<any>>;
export function useReduxDispatch(): ReduxDispatch {
  return useDispatch<ReduxDispatch>();
}

// This interface is used for unknown errors
export interface GeneralError {
  message: string;
  name: string;
  // Add custom error properties here
}

// Use this interface for normalizing API responses. See normalizr documentation for more information
export interface NormalizedResponse<T> {
  ErrorCode: number;
  Errors: string[];
  data: Dictionary<T>;
}

export interface ErrorsResponse {
  ErrorCode: number;
  Errors: string[];
}
