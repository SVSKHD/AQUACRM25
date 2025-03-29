import { Toaster, toast as sonnerToast } from 'sonner';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export function Toast() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      }}
    />
  );
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start space-x-4 p-2">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {options?.description && (
            <p className="mt-1 text-sm text-gray-500">{options.description}</p>
          )}
        </div>
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(t);
            }}
            className="ml-4 text-sm font-medium text-green-600 hover:text-green-500"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 4000,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start space-x-4 p-2">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {options?.description && (
            <p className="mt-1 text-sm text-gray-500">{options.description}</p>
          )}
        </div>
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(t);
            }}
            className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 5000,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start space-x-4 p-2">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {options?.description && (
            <p className="mt-1 text-sm text-gray-500">{options.description}</p>
          )}
        </div>
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(t);
            }}
            className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 4000,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.custom((t) => (
      <div className="flex items-start space-x-4 p-2">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {options?.description && (
            <p className="mt-1 text-sm text-gray-500">{options.description}</p>
          )}
        </div>
        {options?.action && (
          <button
            onClick={() => {
              options.action?.onClick();
              sonnerToast.dismiss(t);
            }}
            className="ml-4 text-sm font-medium text-yellow-600 hover:text-yellow-500"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ), {
      duration: options?.duration || 4000,
    });
  },
};