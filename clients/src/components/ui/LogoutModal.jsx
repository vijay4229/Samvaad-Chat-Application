// src/components/ui/LogoutModal.jsx
import React from 'react';

function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-bkg-light p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-text-primary mb-4">Logout</h2>
        <p className="text-text-secondary mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bkg-dark text-text-primary hover:bg-opacity-80 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;