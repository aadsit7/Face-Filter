const categories = [
  { key: 'all', label: 'All' },
  { key: 'email_template', label: 'Email Templates' },
  { key: 'social_media', label: 'Social Media' },
  { key: 'co_branded', label: 'Co-branded' },
  { key: 'campaign', label: 'Campaigns' },
  { key: 'event', label: 'Events' },
];

export default function AssetCategory({ activeCategory, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === cat.key
              ? 'bg-recast-navy text-white'
              : 'bg-recast-gray-100 text-recast-gray-600 hover:bg-recast-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
