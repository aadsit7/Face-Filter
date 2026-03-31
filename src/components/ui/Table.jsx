export default function Table({ columns = [], data = [], onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-recast-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-xs font-medium uppercase text-recast-gray-500 px-4 py-3 tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id ?? rowIndex}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-recast-gray-200 ${
                onRowClick ? 'cursor-pointer hover:bg-recast-gray-50' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-recast-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
