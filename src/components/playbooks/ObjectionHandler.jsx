import { useState } from 'react';

export default function ObjectionHandler({ objections }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {objections.map((item) => {
        const isOpen = expandedId === item.id;
        return (
          <div
            key={item.id}
            className="border border-recast-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-recast-gray-50 transition-colors"
            >
              <span className="font-medium text-recast-navy pr-4">
                {item.objection}
              </span>
              <svg
                className={`w-5 h-5 shrink-0 text-recast-gray-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 border-t border-recast-gray-100">
                <p className="text-recast-gray-600 text-sm leading-relaxed pt-3">
                  {item.response}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
