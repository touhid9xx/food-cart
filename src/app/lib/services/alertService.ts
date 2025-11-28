import { store } from "../redux";
import {
  addAlert,
  removeAlert,
  clearAlerts,
  setPosition,
  setMaxAlerts,
} from "../slices/alertSlice";
import { AlertType } from "../../types";

class AlertService {
  private static instance: AlertService;

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  success(message: string, title?: string, duration?: number) {
    this.showAlert("success", message, title, duration);
  }

  error(message: string, title?: string, duration?: number) {
    this.showAlert("error", message, title, duration);
  }

  warning(message: string, title?: string, duration?: number) {
    this.showAlert("warning", message, title, duration);
  }

  info(message: string, title?: string, duration?: number) {
    this.showAlert("info", message, title, duration);
  }

  private showAlert(
    type: AlertType,
    message: string,
    title?: string,
    duration?: number
  ) {
    store.dispatch(addAlert({ type, message, title, duration }));
  }

  remove(id: string) {
    store.dispatch(removeAlert(id));
  }

  clear() {
    store.dispatch(clearAlerts());
  }

  setPosition(
    position:
      | "top-right"
      | "top-left"
      | "bottom-right"
      | "bottom-left"
      | "top-center"
      | "bottom-center"
  ) {
    store.dispatch(setPosition(position));
  }

  setMaxAlerts(max: number) {
    store.dispatch(setMaxAlerts(max));
  }
}

export const alertService = AlertService.getInstance();
