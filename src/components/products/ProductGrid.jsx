import Card from '../ui/Card';
import Badge from '../ui/Badge';

const colorMap = {
  'Right Click Tools': 'bg-cyan-500',
  'Application Workspace': 'bg-purple-500',
  'Privileged Access': 'bg-orange-500',
};

export default function ProductGrid({ products, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onSelect(product.id)}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="space-y-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                  colorMap[product.name] || 'bg-recast-navy'
                }`}
              >
                {product.name.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold text-recast-navy">
                {product.name}
              </h3>
              <p className="text-sm text-recast-gray-600 line-clamp-3">
                {product.description}
              </p>
              <Badge variant="default" size="sm">
                {product.resources.length} resources
              </Badge>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
