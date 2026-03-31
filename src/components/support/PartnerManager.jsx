import Card from '../ui/Card'
import Button from '../ui/Button'

export default function PartnerManager({ manager }) {
  const initials = manager.name.split(' ').map((n) => n[0]).join('')

  return (
    <Card title="Your Partner Manager">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-recast-navy text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          {initials}
        </div>
        <h3 className="text-lg font-bold text-recast-gray-800">{manager.name}</h3>
        <p className="text-sm text-recast-gray-500 mb-4">{manager.title}</p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 justify-center">
            <svg className="w-4 h-4 text-recast-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${manager.email}`} className="text-recast-cyan hover:underline">{manager.email}</a>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <svg className="w-4 h-4 text-recast-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-recast-gray-700">{manager.phone}</span>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="primary" size="md" onClick={() => window.open(manager.calendlyLink, '_blank')}>
            Schedule a Call
          </Button>
        </div>
      </div>
    </Card>
  )
}
