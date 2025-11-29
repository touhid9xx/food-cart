import { useCallback } from "react";
import { alertService } from "../services/alertService";
import { AlertType } from "../../types";

export const useAlert = () => {
  const showAlert = useCallback(
    (type: AlertType, message: string, title?: string, duration?: number) => {
      alertService[type](message, title, duration);
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      alertService.success(message, title, duration);
    },
    []
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      alertService.error(message, title, duration);
    },
    []
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      alertService.warning(message, title, duration);
    },
    []
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      alertService.info(message, title, duration);
    },
    []
  );

  const remove = useCallback((id: string) => {
    alertService.remove(id);
  }, []);

  const clear = useCallback(() => {
    alertService.clear();
  }, []);

  return {
    showAlert,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  };
};
