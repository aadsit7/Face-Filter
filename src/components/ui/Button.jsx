const variantStyles = {
  primary: 'bg-recast-navy text-white hover:bg-recast-navy-light',
  secondary: 'border border-recast-gray-300 text-recast-gray-700 hover:bg-recast-gray-50',
  danger: 'bg-recast-red text-white hover:bg-red-700',
  ghost: 'text-recast-gray-600 hover:bg-recast-gray-100',
};

const sizeStyles = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
