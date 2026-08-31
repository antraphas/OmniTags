import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function LightboxModal({ isOpen, imageSrc, imageAlt, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 transition-all animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors"
          title="Fechar (Esc)"
        >
          <X size={18} />
        </button>

        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl border border-slate-700 object-contain"
        />

        {imageAlt && (
          <div className="mt-3 text-xs sm:text-sm text-slate-300 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 text-center font-medium">
            {imageAlt}
          </div>
        )}
      </div>
    </div>
  );
}
