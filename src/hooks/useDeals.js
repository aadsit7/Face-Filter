import useLocalStorage from './useLocalStorage';
import { seedDeals } from '../data/mockDeals';

export default function useDeals() {
  const [deals, setDeals] = useLocalStorage('recast-partner-deals', seedDeals);

  const addDeal = (deal) => {
    const newDeal = {
      ...deal,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDeals((prev) => [...prev, newDeal]);
    return newDeal;
  };

  const updateDeal = (id, updates) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id
          ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
          : deal
      )
    );
  };

  const deleteDeal = (id) => {
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
  };

  const getDealsByStatus = (status) => {
    return deals.filter((deal) => deal.status === status);
  };

  return { deals, addDeal, updateDeal, deleteDeal, getDealsByStatus };
}
