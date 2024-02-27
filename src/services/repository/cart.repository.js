export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = (_id) => {
        return this.dao.getAll(_id);
    }
    save = (CId, PId, quantity) => {
        return this.dao.save(CId, PId, quantity);
    }
    update = (CId, PId, quantity) => {
        return this.dao.update(CId, PId, quantity);
    }
    delete = async (CId, PId) => {
        return this.dao.delete(CId, PId);
    };

    getTotalPrice = async () => {
        return this.dao.getTotalPrice();
    }
};