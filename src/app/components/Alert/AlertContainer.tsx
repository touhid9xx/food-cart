"use client";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { removeAlert } from "../../../lib/slices/alertSlice";
import Alert from "./Alert";

export default function AlertContainer() {
  const dispatch = useAppDispatch();
  const { alerts, position } = useAppSelector((state) => state.alert);

  const handleRemoveAlert = (id: string) => {
    dispatch(removeAlert(id));
  };

  // Auto-remove alerts when their duration expires
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    alerts.forEach((alert) => {
      if (alert.duration && alert.duration > 0) {
        const timeout = setTimeout(() => {
          handleRemoveAlert(alert.id);
        }, alert.duration);

        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [alerts]);

  if (alerts.length === 0) return null;

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className={`fixed z-50 space-y-2 ${positionClasses[position]}`}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          alert={alert}
          onClose={() => handleRemoveAlert(alert.id)}
        />
      ))}
    </div>
  );
}
