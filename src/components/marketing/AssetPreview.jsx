import Modal from '../ui/Modal';
import Button from '../ui/Button';
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

export default function AssetPreview({ asset, onClose }) {
  if (!asset) return null;

  const handleDownload = () => {
    alert('Download started!');
  };

  return (
    <Modal isOpen={!!asset} onClose={onClose} title={asset.title} size="lg">
      <div
        className={`h-48 rounded-lg bg-gradient-to-br ${gradientMap[asset.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center mb-4`}
      >
        <span className="text-white/80 text-4xl font-bold uppercase tracking-widest">
          {asset.format}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Description</p>
          <p className="text-sm text-recast-gray-700 mt-1">{asset.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Category</p>
            <p className="text-sm text-recast-gray-700 mt-1">
              {categoryLabel[asset.category] || asset.category}
            </p>
          </div>
          <div>
            <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Format</p>
            <p className="text-sm text-recast-gray-700 mt-1">{asset.format}</p>
          </div>
          <div>
            <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Product</p>
            <p className="text-sm text-recast-gray-700 mt-1">{asset.product}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-recast-gray-200">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleDownload}>Download Asset</Button>
      </div>
    </Modal>
  );
}
