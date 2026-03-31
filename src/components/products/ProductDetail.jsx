import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

const typeLabels = {
  datasheet: 'Datasheet',
  video: 'Video',
  technical: 'Technical Guide',
  brief: 'Executive Brief',
};

const typeIcons = {
  datasheet: (
    <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  video: (
    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  technical: (
    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  brief: (
    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
};

const formatVariant = {
  PDF: 'info',
  MP4: 'purple',
};

export default function ProductDetail({ product, onBack }) {
  const resourcesByType = product.resources.reduce((acc, res) => {
    if (!acc[res.type]) acc[res.type] = [];
    acc[res.type].push(res);
    return acc;
  }, {});

  const typeOrder = ['datasheet', 'video', 'technical', 'brief'];

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </span>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-recast-navy">{product.name}</h1>
        <p className="text-recast-gray-600 mt-2">{product.description}</p>
      </div>

      {typeOrder.map((type) => {
        const resources = resourcesByType[type];
        if (!resources) return null;
        return (
          <section key={type}>
            <h2 className="text-lg font-semibold text-recast-navy mb-4">
              {typeLabels[type]}s
            </h2>
            <div className="space-y-3">
              {resources.map((res) => (
                <Card key={res.id}>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">{typeIcons[res.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-recast-navy">{res.title}</h3>
                        <Badge variant={formatVariant[res.format] || 'default'} size="sm">
                          {res.format}
                        </Badge>
                      </div>
                      <p className="text-sm text-recast-gray-600">{res.description}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => alert(`Download started for: ${res.title}`)}
                    >
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
