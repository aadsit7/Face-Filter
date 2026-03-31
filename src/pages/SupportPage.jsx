import { useState } from 'react'
import useTickets from '../hooks/useTickets'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import TicketForm from '../components/support/TicketForm'
import TicketList from '../components/support/TicketList'
import FaqAccordion from '../components/support/FaqAccordion'
import PartnerManager from '../components/support/PartnerManager'
import { faqs, partnerManager } from '../data/mockSupport'

export default function SupportPage() {
  const { tickets, addTicket } = useTickets()
  const [activeTab, setActiveTab] = useState('tickets')
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const handleSubmitTicket = (form) => {
    addTicket(form)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-recast-gray-800">Support & Contact</h1>
        <p className="text-recast-gray-500 mt-1">Get help, submit tickets, and find answers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['tickets', 'faq'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-recast-navy text-white' : 'bg-recast-gray-100 text-recast-gray-600 hover:bg-recast-gray-200'
                  }`}
                >
                  {tab === 'tickets' ? 'Support Tickets' : 'FAQ'}
                </button>
              ))}
            </div>
            {activeTab === 'tickets' && (
              <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                New Ticket
              </Button>
            )}
          </div>

          <Card>
            {activeTab === 'tickets' ? (
              <TicketList tickets={tickets} onSelectTicket={setSelectedTicket} />
            ) : (
              <FaqAccordion faqs={faqs} />
            )}
          </Card>
        </div>

        <div>
          <PartnerManager manager={partnerManager} />
        </div>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Submit a Support Ticket">
        <TicketForm onSubmit={handleSubmitTicket} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Ticket Details" size="md">
        {selectedTicket && (
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase text-recast-gray-500 font-medium">Subject</label>
              <p className="font-medium text-recast-gray-800">{selectedTicket.subject}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs uppercase text-recast-gray-500 font-medium">Category</label>
                <p className="text-sm text-recast-gray-700 capitalize">{selectedTicket.category.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <label className="text-xs uppercase text-recast-gray-500 font-medium">Priority</label>
                <p className="text-sm text-recast-gray-700 capitalize">{selectedTicket.priority}</p>
              </div>
              <div>
                <label className="text-xs uppercase text-recast-gray-500 font-medium">Status</label>
                <p className="text-sm text-recast-gray-700 capitalize">{selectedTicket.status.replace(/_/g, ' ')}</p>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-recast-gray-500 font-medium">Description</label>
              <p className="text-sm text-recast-gray-600 leading-relaxed mt-1">{selectedTicket.description}</p>
            </div>
            <div>
              <label className="text-xs uppercase text-recast-gray-500 font-medium">Created</label>
              <p className="text-sm text-recast-gray-600">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
