import { forwardRef } from 'react';

/**
 * A retro pixel-art styled button component
 * Maintains the Pokemon game aesthetic with pixel corners and bold shadows
 */
const PixelButton = forwardRef(
  ({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }, ref) => {
    const baseClasses = `
    font-pixel relative inline-flex items-center justify-center cursor-pointer
    rounded-none border-4 border-white
    text-white font-bold
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    transition-all duration-100
    [clip-path:polygon(0_8px,8px_8px,8px_0,calc(100%-8px)_0,calc(100%-8px)_8px,100%_8px,100%_calc(100%-8px),calc(100%-8px)_calc(100%-8px),calc(100%-8px)_100%,8px_100%,8px_calc(100%-8px),0_calc(100%-8px))]
    hover:scale-105 hover:brightness-125 hover:border-yellow-300
    hover:shadow-[0_0_0_4px_rgba(0,0,0,1),0_0_20px_rgba(255,255,100,0.6)]
    active:scale-100 active:brightness-90 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100
  `;

    const variants = {
      primary: 'bg-red-500',
      secondary: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
      lg: 'px-8 py-4 text-xl sm:px-12 sm:py-6 sm:text-2xl md:px-16 md:py-8 md:text-4xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}>
        {children}
      </button>
    );
  },
);

PixelButton.displayName = 'PixelButton';

export default PixelButton;
