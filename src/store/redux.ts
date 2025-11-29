import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeSlice from "../lib/slices/themeSlice";
import menuSlice from "../lib/slices/menuSlice";
import cartSlice from "../lib/slices/cartSlice";
import authSlice from "../lib/slices/authSlice";
import alertSlice from "../lib/slices/alertSlice"; // Add this
import checkoutReducer from "../lib/slices/checkoutSlice"; // Add this
import orderSummaryReducer from "../lib/slices/orderSummarySlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "cart", "auth"],
};

const rootReducer = combineReducers({
  theme: themeSlice,
  menu: menuSlice,
  cart: cartSlice,
  auth: authSlice,
  alert: alertSlice,
  checkout: checkoutReducer,
  orderSummary: orderSummaryReducer,
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
