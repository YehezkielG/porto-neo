import Loading from "./Loading";
import type { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  isLoading?: boolean;
  loadingTitle?: string;
}

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  isLoading = false,
  loadingTitle = "Working..."
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto bg-black/80 p-6" onClick={onClose}>
      {/* stopPropagation agar klik di dalam kotak modal tidak menutup modal */}
      <div className="relative max-h-[90vh] w-full max-w-[560px] overflow-auto border-2 border-black bg-[var(--surface)] p-7 shadow-[10px_10px_0_var(--shadow-color)]" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-3.5 top-3 border-2 border-black bg-[var(--accent)] px-2 text-[22px] text-[#111] disabled:cursor-not-allowed disabled:opacity-50" onClick={onClose} disabled={isLoading}>
          ×
        </button>
        {title && <h3 className="mb-[22px] mr-[30px] text-[28px] font-black text-[var(--paper)]">{title}</h3>}
        <div>
          {children}
        </div>
        {isLoading && <Loading type="modal" title={loadingTitle} />}
      </div>
    </div>
  );
};

export default Modal;
