import { useState, useMemo } from 'react';
import useDeals from '../hooks/useDeals';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import SearchInput from '../components/ui/SearchInput';
import DealForm from '../components/deals/DealForm';
import DealPipeline from '../components/deals/DealPipeline';
import DealTable from '../components/deals/DealTable';
import DealDetail from '../components/deals/DealDetail';

const tabs = ['Pipeline', 'Table'];

export default function DealsPage() {
  const { deals, addDeal, updateDeal } = useDeals();
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [search, setSearch] = useState('');

  const filteredDeals = useMemo(() => {
    if (!search.trim()) return deals;
    const q = search.toLowerCase();
    return deals.filter(
      (d) =>
        d.customerName.toLowerCase().includes(q) ||
        d.product.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
    );
  }, [deals, search]);

  const handleSubmit = (formData) => {
    addDeal(formData);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-recast-navy">Deal Registration</h1>
          <p className="text-sm text-recast-gray-500 mt-1">Manage and track your partner deals</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Register New Deal</Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex gap-1 bg-recast-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-recast-navy shadow-sm'
                  : 'text-recast-gray-600 hover:text-recast-navy'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-sm">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals..."
          />
        </div>
      </div>

      {activeTab === 'Pipeline' && <DealPipeline deals={filteredDeals} />}
      {activeTab === 'Table' && (
        <DealTable deals={filteredDeals} onRowClick={(deal) => setSelectedDeal(deal)} />
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Register New Deal" size="lg">
        <DealForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      </Modal>

      {selectedDeal && (
        <DealDetail
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdate={updateDeal}
        />
      )}
    </div>
  );
}
