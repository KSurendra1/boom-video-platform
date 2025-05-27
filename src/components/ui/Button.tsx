import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex justify-center items-center font-medium focus:outline-none transition-colors duration-200 ease-in-out';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 rounded',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-3 rounded-md'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;