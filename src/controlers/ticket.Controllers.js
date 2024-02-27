import Ticket from '../services/dao/mongodb/models/ticket.model.js';

export const createTicket = async (req, res) => {
  try {
    const { code, amount, purchaser } = req.body;
    const ticket = new Ticket({ code, amount, purchaser });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
