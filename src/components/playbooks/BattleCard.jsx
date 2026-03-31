import Card from '../ui/Card';

function SectionList({ title, items, bgClass, iconColor }) {
  return (
    <div className={`rounded-lg p-4 ${bgClass}`}>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
            <svg
              className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <circle cx="10" cy="10" r="4" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BattleCard({ battleCard }) {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold text-recast-navy mb-4">
        vs. {battleCard.competitor}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionList
          title="Their Strengths"
          items={battleCard.theirStrengths}
          bgClass="bg-red-50"
          iconColor="text-red-400"
        />
        <SectionList
          title="Their Weaknesses"
          items={battleCard.theirWeaknesses}
          bgClass="bg-green-50"
          iconColor="text-green-500"
        />
        <SectionList
          title="Our Differentiators"
          items={battleCard.ourDifferentiators}
          bgClass="bg-recast-navy/5"
          iconColor="text-recast-navy"
        />
        <div className="rounded-lg p-4 bg-cyan-50">
          <h4 className="font-semibold text-sm mb-3">Win Strategy</h4>
          <div className="flex items-start gap-2 text-sm leading-relaxed">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0 text-cyan-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <circle cx="10" cy="10" r="4" />
            </svg>
            <span>{battleCard.winStrategy}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
