export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }
    save = (ticketData) => {
        return this.dao.save(ticketData);
    }
}