import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mockProducts';
import SearchInput from '../components/ui/SearchInput';
import ProductGrid from '../components/products/ProductGrid';
import ProductDetail from '../components/products/ProductDetail';

export default function ProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Detail view
  if (id) {
    const product = products.find((p) => p.id === id);
    if (!product) {
      return (
        <div className="text-center py-12 text-recast-gray-500">
          Product not found.
        </div>
      );
    }
    return (
      <ProductDetail product={product} onBack={() => navigate('/products')} />
    );
  }

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-recast-navy">Product Resources</h1>
        <p className="text-recast-gray-500 mt-1">
          Datasheets, demos, technical guides, and sales materials for all Recast products.
        </p>
      </div>
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      <ProductGrid
        products={filteredProducts}
        onSelect={(productId) => navigate(`/products/${productId}`)}
      />
    </div>
  );
}
