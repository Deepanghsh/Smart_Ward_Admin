/**
 * Simple toast notification system
 * Can be replaced with libraries like react-toastify or sonner
 */

let toastContainer = null;

// Initialize toast container
const initToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

/**
 * Show toast notification
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default: 4000)
 */
export const showToast = (type = 'info', message = '', duration = 4000) => {
  const container = initToastContainer();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';

  const bgColors = {
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  toast.style.cssText = `
    background: ${bgColors[type] || bgColors.info};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    animation: slideInRight 0.3s ease-out;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
  `;

  toast.innerHTML = `
    <span style="font-size: 20px; font-weight: bold;">${icons[type] || icons.info}</span>
    <span style="flex: 1;">${message}</span>
    <button style="
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
  `;

  // Add animation styles if not already present
  if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      .toast-notification:hover {
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
  }

  // Close button functionality
  const closeBtn = toast.querySelector('button');
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    removeToast(toast);
  };

  // Click to dismiss
  toast.onclick = () => removeToast(toast);

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast);
  }, duration);
};

const removeToast = (toast) => {
  toast.style.animation = 'slideOutRight 0.3s ease-in';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
};

/**
 * Alert box (modal-like notification)
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {string} type - 'success', 'error', 'warning', 'info'
 */
export const openAlertBox = (title = '', message = '', type = 'info') => {
  // Remove existing alert if any
  const existing = document.getElementById('alert-modal');
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'alert-modal';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
    padding: 20px;
  `;

  const colors = {
    success: { bg: '#10b981', light: '#d1fae5', border: '#6ee7b7' },
    error: { bg: '#ef4444', light: '#fee2e2', border: '#fca5a5' },
    warning: { bg: '#f59e0b', light: '#fef3c7', border: '#fcd34d' },
    info: { bg: '#3b82f6', light: '#dbeafe', border: '#93c5fd' },
  };

  const color = colors[type] || colors.info;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 100%;
    animation: scaleIn 0.3s ease-out;
    overflow: hidden;
  `;

  modal.innerHTML = `
    <div style="padding: 24px; text-align: center;">
      <div style="
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: ${color.light};
        border: 3px solid ${color.border};
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 32px;
        color: ${color.bg};
        font-weight: bold;
      ">
        ${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}
      </div>
      <h3 style="
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 12px;
        font-family: 'Inter', sans-serif;
      ">${title}</h3>
      <p style="
        font-size: 15px;
        color: #6b7280;
        line-height: 1.6;
        font-family: 'Inter', sans-serif;
        margin-bottom: 24px;
      ">${message}</p>
      <button id="alert-ok-btn" style="
        background: linear-gradient(135deg, ${color.bg} 0%, ${color.bg}dd 100%);
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 12px ${color.bg}40;
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px ${color.bg}50';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px ${color.bg}40';">
        OK
      </button>
    </div>
  `;

  // Add animation styles
  if (!document.getElementById('alert-animations')) {
    const style = document.createElement('style');
    style.id = 'alert-animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close handlers
  const closeAlert = () => {
    overlay.style.animation = 'fadeIn 0.2s ease-in reverse';
    setTimeout(() => overlay.remove(), 200);
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) closeAlert();
  };

  document.getElementById('alert-ok-btn').onclick = closeAlert;
};

// Convenience methods
export const toast = {
  success: (message, duration) => showToast('success', message, duration),
  error: (message, duration) => showToast('error', message, duration),
  warning: (message, duration) => showToast('warning', message, duration),
  info: (message, duration) => showToast('info', message, duration),
};
