import { X } from "lucide-react";
import { type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-3xl shadow-2xl animate-scale-in"
           style={{ backgroundColor: '#B2F3DF' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b"
             style={{ borderColor: 'rgba(9, 12, 22, 0.1)' }}>
          <h2 className="text-xl font-bold" style={{ color: '#090C16' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:scale-110 transition-all duration-200"
            style={{ backgroundColor: 'rgba(9, 12, 22, 0.1)' }}
          >
            <X className="w-5 h-5" style={{ color: '#090C16' }} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 