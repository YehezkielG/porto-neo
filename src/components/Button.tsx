import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps {
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  primary?: boolean;
  text: ReactNode;
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  className?: string;
}

const Button = ({
  type = "submit",
  primary = true,
  text,
  disabled = false,
  onClick,
  className = ""
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-[42px] items-center justify-center gap-2 border-2 border-black px-[15px] py-[9px] font-extrabold text-[#080a12] shadow-[4px_4px_0_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-50 ${primary ? 'bg-[var(--lime)]' : 'bg-[var(--lavender)]'} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
