import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playbooks, battleCards, objections } from '../data/mockPlaybooks';
import SearchInput from '../components/ui/SearchInput';
import PlaybookList from '../components/playbooks/PlaybookList';
import PlaybookDetail from '../components/playbooks/PlaybookDetail';
import BattleCard from '../components/playbooks/BattleCard';
import ObjectionHandler from '../components/playbooks/ObjectionHandler';

const tabs = ['Playbooks', 'Battle Cards', 'Objection Handling'];

export default function PlaybooksPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Playbooks');
  const [search, setSearch] = useState('');

  // Detail view
  if (id) {
    const playbook = playbooks.find((p) => p.id === id);
    if (!playbook) {
      return (
        <div className="text-center py-12 text-recast-gray-500">
          Playbook not found.
        </div>
      );
    }
    return (
      <PlaybookDetail playbook={playbook} onBack={() => navigate('/playbooks')} />
    );
  }

  // Filter playbooks by search
  const filteredPlaybooks = playbooks.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.product.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-recast-navy">Sales Playbooks</h1>
        <p className="text-recast-gray-500 mt-1">
          Playbooks, battle cards, and objection handling guides to help you win deals.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-recast-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-recast-navy text-recast-navy'
                  : 'border-transparent text-recast-gray-500 hover:text-recast-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'Playbooks' && (
        <div className="space-y-6">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search playbooks..."
          />
          <PlaybookList
            playbooks={filteredPlaybooks}
            onSelect={(playbookId) => navigate(`/playbooks/${playbookId}`)}
          />
        </div>
      )}

      {activeTab === 'Battle Cards' && (
        <div className="grid grid-cols-1 gap-6">
          {battleCards.map((bc) => (
            <BattleCard key={bc.id} battleCard={bc} />
          ))}
        </div>
      )}

      {activeTab === 'Objection Handling' && (
        <ObjectionHandler objections={objections} />
      )}
    </div>
  );
}
