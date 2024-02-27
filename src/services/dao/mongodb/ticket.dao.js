import Ticket from '../models/ticket.model.js';

export default class TicketService {

  static async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      await ticket.save();
      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
