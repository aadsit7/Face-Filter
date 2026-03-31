const colorStyles = {
  navy: 'bg-recast-navy',
  green: 'bg-recast-green',
  cyan: 'bg-recast-cyan',
  orange: 'bg-recast-orange',
};

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
};

export default function ProgressBar({
  value = 0,
  color = 'navy',
  size = 'md',
  showLabel = false,
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-recast-gray-200 rounded-full ${sizeStyles[size]}`}>
        <div
          className={`${colorStyles[color]} rounded-full ${sizeStyles[size]} transition-all`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-recast-gray-700 tabular-nums">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
