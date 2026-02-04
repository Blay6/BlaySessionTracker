
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex items-center justify-center size-10 rounded-full ${isDanger ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
              <span className="material-symbols-outlined !text-[24px]">
                {isDanger ? 'report_problem' : 'help'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {title}
            </h3>
          </div>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-black transition-all shadow-lg active:scale-95 ${
                isDanger ? 'bg-danger hover:bg-red-600 shadow-danger/20' : 'bg-primary hover:bg-primary-dark shadow-primary/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
