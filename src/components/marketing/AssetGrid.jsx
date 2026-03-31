import Badge from '../ui/Badge';

const gradientMap = {
  email_template: 'from-blue-400 to-blue-600',
  social_media: 'from-purple-400 to-purple-600',
  co_branded: 'from-cyan-400 to-cyan-600',
  campaign: 'from-orange-400 to-orange-600',
  event: 'from-green-400 to-green-600',
};

const categoryLabel = {
  email_template: 'Email Template',
  social_media: 'Social Media',
  co_branded: 'Co-branded',
  campaign: 'Campaign',
  event: 'Event',
};

const formatVariant = {
  HTML: 'info',
  ZIP: 'purple',
  PPTX: 'warning',
  XLSX: 'success',
};

export default function AssetGrid({ assets, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          onClick={() => onSelect(asset)}
          className="bg-white rounded-xl border border-recast-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
          <div
            className={`h-36 bg-gradient-to-br ${gradientMap[asset.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center`}
          >
            <span className="text-white/80 text-3xl font-bold uppercase tracking-widest">
              {asset.format}
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-recast-navy leading-snug">{asset.title}</h3>
            <p className="text-xs text-recast-gray-500 mt-1 line-clamp-2">{asset.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={formatVariant[asset.format] || 'default'} size="sm">
                {asset.format}
              </Badge>
              <Badge variant="default" size="sm">
                {categoryLabel[asset.category] || asset.category}
              </Badge>
            </div>
          </div>
        </div>
      ))}
      {assets.length === 0 && (
        <div className="col-span-full text-center py-12 text-sm text-recast-gray-400">
          No assets found
        </div>
      )}
    </div>
  );
}
