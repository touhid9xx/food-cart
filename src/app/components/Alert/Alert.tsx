"use client";
import { Alert as AlertType } from "../../types";

interface AlertProps {
  alert: AlertType;
  onClose: () => void;
}

export default function Alert({ alert, onClose }: AlertProps) {
  const getAlertStyles = () => {
    const baseStyles =
      "max-w-sm w-full rounded-lg p-4 shadow-lg border transform transition-all duration-300 ease-in-out";

    const typeStyles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    return `${baseStyles} ${typeStyles[alert.type]}`;
  };

  const getIcon = () => {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    return icons[alert.type];
  };

  return (
    <div className={getAlertStyles()}>
      <div className="flex items-start">
        <div className="flex-shrink-0 text-lg mr-3">{getIcon()}</div>
        <div className="flex-1">
          {alert.title && (
            <h3 className="font-semibold text-sm mb-1">{alert.title}</h3>
          )}
          <p className="text-sm">{alert.message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <span className="text-lg">×</span>
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {alert.duration && alert.duration > 0 && (
        <div className="mt-2 h-1 bg-current opacity-20 rounded-full overflow-hidden">
          <div
            className="h-full bg-current opacity-50 transition-all duration-linear"
            style={{
              width: "100%",
              animation: `shrink ${alert.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
