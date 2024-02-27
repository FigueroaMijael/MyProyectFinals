export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }
    createTicket = (ticketData) => {
        return this.dao.createTicket(ticketData);
    }
}