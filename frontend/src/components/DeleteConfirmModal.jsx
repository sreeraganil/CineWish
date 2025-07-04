import { useState } from "react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false)

    const clickEvent = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-gray-900 border border-red-500 rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-white animate-fade-in">
        <h2 className="text-lg font-bold mb-2 text-red-400">⚠️ Confirm Deletion</h2>
        <p className="text-sm text-gray-300 mb-4">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={clickEvent}
            disabled={loading}
            className="flex justify-center items-center px-4 py-1 rounded bg-red-600 hover:bg-red-700 transition"
          >
            {loading ? <div className="h-4 w-4 border-2 rounded-full border-white border-t-[transparent] animate-spin"></div> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
