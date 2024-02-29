export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = (_id) => {
        return this.dao.getAll(_id);
    }
    
    save = (ticketData) => {
        return this.dao.save(ticketData);
    }
}