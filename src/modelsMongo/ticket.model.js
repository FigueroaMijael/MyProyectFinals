import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, default: () => Math.random().toString(36).substring(7) },
  date_created: { type: Date, required: true },
  date_approved: { type: Date, required: true },
  collector_id: { type: Number, required: true },
  currency_id: { type: String, required: true },
  description: { type: String, required: true },
  order: {
    id: { type: String, required: true },
    type: { type: String, required: true }
  },
  payer: {
    id: { type: String, required: true },
    email: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    identification: {
      number: { type: String, required: true },
      type: { type: String, required: true }
    },
    phone: {
      number: { type: String },
      extension: { type: String },
      area_code: { type: String }
    }
  },
  status: { type: String, required: true },
  statusDetail: { type: String, required: true },
  transaction_amount: { type: Number, required: true }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
