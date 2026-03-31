import { useState } from 'react';
import useTickets from '../hooks/useTickets';
import { faqs, partnerManager } from '../data/mockSupport';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TicketForm from '../components/support/TicketForm';
import TicketList from '../components/support/TicketList';
import FaqAccordion from '../components/support/FaqAccordion';
import PartnerManager from '../components/support/PartnerManager';

const tabs = ['Tickets', 'FAQ'];

export default function SupportPage() {
  const { tickets, addTicket } = useTickets();
  const [activeTab, setActiveTab] = useState('Tickets');
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSubmit = (formData) => {
    addTicket(formData);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-recast-navy">Support &amp; Contact</h1>
        <p className="text-sm text-recast-gray-500 mt-1">
          Get help, submit tickets, and connect with your partner manager
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - wider */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
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
            {activeTab === 'Tickets' && (
              <Button onClick={() => setShowForm(true)} size="sm">
                New Ticket
              </Button>
            )}
          </div>

          {activeTab === 'Tickets' && (
            <TicketList tickets={tickets} onSelectTicket={setSelectedTicket} />
          )}

          {activeTab === 'FAQ' && <FaqAccordion faqs={faqs} />}
        </div>

        {/* Right column - narrower */}
        <div>
          <PartnerManager manager={partnerManager} />
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="New Support Ticket"
        size="lg"
      >
        <TicketForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      </Modal>

      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={selectedTicket.subject}
        >
          <div className="space-y-3">
            <p className="text-sm text-recast-gray-600">{selectedTicket.description}</p>
            <div className="flex gap-4 text-xs text-recast-gray-400 pt-2 border-t border-recast-gray-200">
              <span>Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(selectedTicket.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
