import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert, AlertState, AlertType } from "../../types/index";

const initialState: AlertState = {
  alerts: [],
  position: "top-right",
  maxAlerts: 5,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addAlert: (
      state,
      action: PayloadAction<{
        type: AlertType;
        message: string;
        title?: string;
        duration?: number;
      }>
    ) => {
      const { type, message, title, duration = 5000 } = action.payload;

      const newAlert: Alert = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        title,
        duration,
        timestamp: Date.now(),
      };

      // Remove oldest alert if we've reached the maximum
      if (state.alerts.length >= state.maxAlerts) {
        state.alerts.shift();
      }

      state.alerts.push(newAlert);
    },

    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },

    clearAlerts: (state) => {
      state.alerts = [];
    },

    setPosition: (state, action: PayloadAction<AlertState["position"]>) => {
      state.position = action.payload;
    },

    setMaxAlerts: (state, action: PayloadAction<number>) => {
      state.maxAlerts = action.payload;
    },
  },
});

export const { addAlert, removeAlert, clearAlerts, setPosition, setMaxAlerts } =
  alertSlice.actions;

export default alertSlice.reducer;
