const changeTypeStyles = {
  positive: 'text-recast-green',
  negative: 'text-recast-red',
  neutral: 'text-recast-gray-500',
};

const changeTypePrefix = {
  positive: '+',
  negative: '',
  neutral: '',
};

export default function StatCard({ label, value, change, changeType = 'neutral', icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-recast-gray-200 p-5">
      <div className="flex items-start justify-between">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-recast-navy/10 text-recast-navy">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-recast-navy">{value}</p>
        <p className="text-sm text-recast-gray-500 mt-1">{label}</p>
      </div>
      {change && (
        <p className={`text-sm mt-3 font-medium ${changeTypeStyles[changeType]}`}>
          {changeTypePrefix[changeType]}{change}
        </p>
      )}
    </div>
  );
}
