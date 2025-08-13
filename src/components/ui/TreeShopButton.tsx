'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TreeShopButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
}

const TreeShopButton = forwardRef<HTMLButtonElement, TreeShopButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    loading = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    
    // TreeShop Brand Colors
    const variants = {
      primary: `
        bg-blue-600 text-white font-semibold
        hover:bg-green-500 hover:text-black
        active:bg-green-600 active:text-black
        disabled:bg-gray-600 disabled:text-gray-400
        transition-all duration-200 transform
        hover:scale-105 active:scale-100
        shadow-lg hover:shadow-xl
      `,
      secondary: `
        bg-green-500 text-black font-semibold
        hover:bg-blue-600 hover:text-white
        active:bg-blue-700 active:text-white
        disabled:bg-gray-600 disabled:text-gray-400
        transition-all duration-200 transform
        hover:scale-105 active:scale-100
        shadow-lg hover:shadow-xl
      `,
      outline: `
        bg-transparent border-2 border-blue-600 text-blue-400 font-semibold
        hover:bg-blue-600 hover:text-white hover:border-blue-600
        active:bg-blue-700 active:border-blue-700
        disabled:border-gray-600 disabled:text-gray-400
        transition-all duration-200
      `,
      ghost: `
        bg-transparent text-white font-medium
        hover:bg-white/10 hover:text-green-400
        active:bg-white/20
        disabled:text-gray-600
        transition-all duration-200
      `
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-md',
      md: 'px-6 py-3 text-base rounded-lg',
      lg: 'px-8 py-4 text-lg rounded-lg',
      xl: 'px-10 py-5 text-xl rounded-xl'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-semibold tracking-wide',
          'focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black',
          'cursor-pointer select-none',
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[size],
          
          // Full width option
          fullWidth && 'w-full',
          
          // Loading state
          loading && 'cursor-wait opacity-80',
          
          // Disabled state
          (disabled || loading) && 'cursor-not-allowed',
          
          // Custom className
          className
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </span>
        )}
        
        <span className={cn(loading && 'invisible')}>
          {children}
        </span>
      </button>
    );
  }
);

TreeShopButton.displayName = 'TreeShopButton';

export default TreeShopButton;