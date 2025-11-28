import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeSlice from "./slices/themeSlice";
import menuSlice from "./slices/menuSlice";
import cartSlice from "./slices/cartSlice";
import authSlice from "./slices/authSlice";
import alertSlice from "./slices/alertSlice"; // Add this

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "cart", "auth"], // Add auth to persisted state
};

const rootReducer = combineReducers({
  theme: themeSlice,
  menu: menuSlice,
  cart: cartSlice,
  auth: authSlice, // Add auth reducer
  alert: alertSlice, // Add this
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
