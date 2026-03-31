import Card from '../ui/Card';
import Button from '../ui/Button';

export default function PartnerManager({ manager }) {
  return (
    <Card title="Your Partner Manager">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-recast-navy flex items-center justify-center text-white text-xl font-bold mb-3">
          {manager.initials}
        </div>
        <h4 className="text-base font-bold text-recast-navy">{manager.name}</h4>
        <p className="text-sm text-recast-gray-500 mt-0.5">{manager.title}</p>

        <div className="mt-4 space-y-2 w-full text-sm">
          <div className="flex items-center gap-2 justify-center text-recast-gray-600">
            <svg className="w-4 h-4 text-recast-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${manager.email}`} className="text-recast-navy hover:underline">
              {manager.email}
            </a>
          </div>
          <div className="flex items-center gap-2 justify-center text-recast-gray-600">
            <svg className="w-4 h-4 text-recast-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{manager.phone}</span>
          </div>
        </div>

        <div className="mt-5 w-full">
          <a
            href={manager.calendlyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="primary" size="md" className="w-full">
              Schedule a Call
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}
