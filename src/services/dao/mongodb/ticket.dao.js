import ticketModel from './models/ticket.model.js';

export default class TicketDao {

   save = async (ticketData) => {
    try {
      const ticket = ticketModel.create(ticketData);
      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

