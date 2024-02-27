import ticketModel from './models/ticket.model.js';

export default class TicketDao {

   createTicket = async (ticketData) => {
    try {
      const ticket = ticketModel.create(ticketData);
      await ticket.save();
      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

