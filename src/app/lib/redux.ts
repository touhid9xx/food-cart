import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeSlice from "./slices/themeSlice";
import menuSlice from "./slices/menuSlice";
import cartSlice from "./slices/cartSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "cart"], // Only persist theme and cart
};

const rootReducer = combineReducers({
  theme: themeSlice,
  menu: menuSlice,
  cart: cartSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
