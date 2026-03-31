import { useState } from 'react'

export default function FaqAccordion({ faqs }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="space-y-2">
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-recast-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-recast-gray-50 transition-colors"
          >
            <span className="font-medium text-recast-gray-800 pr-4">{faq.question}</span>
            <svg
              className={`w-5 h-5 text-recast-gray-400 shrink-0 transition-transform duration-200 ${openId === faq.id ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openId === faq.id && (
            <div className="px-4 pb-4 text-sm text-recast-gray-600 leading-relaxed border-t border-recast-gray-100 pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
