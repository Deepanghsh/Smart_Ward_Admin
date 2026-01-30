import { toast as toastify } from 'react-toastify';

/**
 * Custom toast wrapper with consistent styling
 */
export const toast = {
  success: (message, options = {}) => {
    toastify.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  error: (message, options = {}) => {
    toastify.error(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  info: (message, options = {}) => {
    toastify.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    toastify.warning(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toastify.loading(message, {
      position: 'top-right',
      ...options,
    });
  },

  dismiss: (toastId) => {
    toastify.dismiss(toastId);
  },

  update: (toastId, options) => {
    toastify.update(toastId, options);
  },
};

/**
 * Legacy alert box function for compatibility
 */
export const openAlertBox = (title, message, type = 'info') => {
  const typeMap = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
  };

  const toastFn = typeMap[type] || toast.info;
  toastFn(`${title}: ${message}`);
};

export default toast;