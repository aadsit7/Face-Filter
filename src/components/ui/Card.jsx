export default function Card({ children, className = '', title, subtitle, headerAction }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-recast-gray-200 ${className}`}>
      {title && (
        <div className="flex items-center justify-between p-5 border-b border-recast-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-recast-navy">{title}</h3>
            {subtitle && (
              <p className="text-sm text-recast-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
