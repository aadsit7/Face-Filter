export default function BarChart({ data = [], maxValue }) {
  const computedMax = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((item, index) => {
        const widthPercent = Math.min(100, (item.value / computedMax) * 100);

        return (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm text-recast-gray-600 w-24 shrink-0 truncate">
              {item.label}
            </span>
            <div className="flex-1 bg-recast-gray-200 rounded-full h-8">
              <div
                className="h-8 rounded-r bg-recast-navy transition-all"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: item.color || undefined,
                }}
              />
            </div>
            <span className="text-sm font-medium text-recast-gray-700 w-12 text-right tabular-nums">
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
