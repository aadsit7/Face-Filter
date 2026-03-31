import { useState } from 'react';

export default function FaqAccordion({ faqs }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div
            key={faq.id}
            className="border border-recast-gray-200 rounded-lg bg-white overflow-hidden"
          >
            <button
              onClick={() => toggle(faq.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-recast-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-recast-navy pr-4">{faq.question}</span>
              <svg
                className={`w-5 h-5 shrink-0 text-recast-gray-400 transition-transform ${
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
              <div className="px-4 pb-4 border-t border-recast-gray-200">
                <p className="text-sm text-recast-gray-600 pt-3 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
