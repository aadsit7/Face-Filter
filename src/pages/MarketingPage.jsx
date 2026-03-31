import { useState, useMemo } from 'react';
import { marketingAssets } from '../data/mockMarketing';
import SearchInput from '../components/ui/SearchInput';
import AssetCategory from '../components/marketing/AssetCategory';
import AssetGrid from '../components/marketing/AssetGrid';
import AssetPreview from '../components/marketing/AssetPreview';

export default function MarketingPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filteredAssets = useMemo(() => {
    let result = marketingAssets;
    if (activeCategory !== 'all') {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.product.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-recast-navy">Marketing Materials</h1>
        <p className="text-sm text-recast-gray-500 mt-1">
          Browse and download co-branded marketing assets
        </p>
      </div>

      <AssetCategory activeCategory={activeCategory} onSelect={setActiveCategory} />

      <div className="max-w-sm">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets..."
        />
      </div>

      <AssetGrid assets={filteredAssets} onSelect={setSelectedAsset} />

      <AssetPreview asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </div>
  );
}
