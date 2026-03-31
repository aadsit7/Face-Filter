import useLocalStorage from './useLocalStorage';
import { seedTickets } from '../data/mockSupport';

export default function useTickets() {
  const [tickets, setTickets] = useLocalStorage('recast-partner-tickets', seedTickets);

  const addTicket = (ticket) => {
    const newTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets((prev) => [...prev, newTicket]);
    return newTicket;
  };

  const updateTicket = (id, updates) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  const getTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  return { tickets, addTicket, updateTicket, getTicketsByStatus };
}
