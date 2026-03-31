import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function PlaybookDetail({ playbook, onBack }) {
  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Playbooks
          </span>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-recast-navy">{playbook.title}</h1>
        <p className="text-recast-gray-600 mt-2">{playbook.description}</p>
      </div>

      {/* Target Personas */}
      <section>
        <h2 className="text-lg font-semibold text-recast-navy mb-3">Target Personas</h2>
        <div className="flex flex-wrap gap-2">
          {playbook.targetPersonas.map((persona, idx) => (
            <Badge key={idx} variant="info" size="md">
              {persona}
            </Badge>
          ))}
        </div>
      </section>

      {/* Value Propositions */}
      <section>
        <h2 className="text-lg font-semibold text-recast-navy mb-3">Value Propositions</h2>
        <ol className="list-decimal list-inside space-y-2">
          {playbook.valueProps.map((prop, idx) => (
            <li key={idx} className="text-sm text-recast-gray-700 leading-relaxed">
              {prop}
            </li>
          ))}
        </ol>
      </section>

      {/* Discovery Questions */}
      <section>
        <h2 className="text-lg font-semibold text-recast-navy mb-3">Discovery Questions</h2>
        <ol className="list-decimal list-inside space-y-2">
          {playbook.discoveryQuestions.map((q, idx) => (
            <li key={idx} className="text-sm text-recast-gray-700 leading-relaxed">
              {q}
            </li>
          ))}
        </ol>
      </section>

      {/* Demo Talking Points */}
      <section>
        <h2 className="text-lg font-semibold text-recast-navy mb-3">Demo Talking Points</h2>
        <ul className="space-y-2">
          {playbook.demoTalkingPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-recast-gray-700 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-recast-navy shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* Pricing Guidance */}
      <section>
        <h2 className="text-lg font-semibold text-recast-navy mb-3">Pricing Guidance</h2>
        <p className="text-sm text-recast-gray-700 leading-relaxed bg-recast-gray-50 rounded-lg p-4">
          {playbook.pricingGuidance}
        </p>
      </section>
    </div>
  );
}
