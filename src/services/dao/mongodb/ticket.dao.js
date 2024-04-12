import ticketModel from '../../../modelsMongo/ticket.model.js';

export default class TicketDao {

  getAll = async (_id) => {
    try {
      const ticketData = await ticketModel.findById(_id)
      return ticketData
    } catch (error) {
      throw new Error(error.message);
    }
  }

   save = async (ticketData) => {
    try {
      const ticket = await ticketModel.create(ticketData);
      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

