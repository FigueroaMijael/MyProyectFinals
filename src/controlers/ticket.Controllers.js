import { ticketService } from '../services/service.js';

export const finalizePurchase = async (req, res) => {
  try {
    const { amount } = req.body;
    const purchaser = req.user.email;
    const ticket = await ticketService.createTicket({ amount, purchaser });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};