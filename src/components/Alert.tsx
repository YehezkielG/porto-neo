import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { AlertState } from '../types';

interface AlertProps {
  alert: AlertState;
  setAlert: Dispatch<SetStateAction<AlertState>>;
}

const Alert = ({ alert, setAlert }: AlertProps) => {
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  if (!alert.show) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[200] max-w-[min(440px,calc(100vw-48px))] border-2 border-black px-5 py-3.5 text-[#111] shadow-[6px_6px_0_var(--shadow-color)] ${alert.type === 'error' ? 'bg-[#ff8c63]' : 'bg-[var(--lime)]'}`} role="status">
      <div className="flex gap-3">
        <strong className="shrink-0">{alert.type.toUpperCase()}</strong>
        <span>{alert.message}</span>
      </div>
    </div>
  );
};

export default Alert;
