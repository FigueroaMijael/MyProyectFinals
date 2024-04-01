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
    increaseQuantityAndSubtractStock = (CId, PId, quantity) => {
        return this.dao.increaseQuantityAndSubtractStock(CId, PId, quantity);
    }
    decreaseQuantityAndAddStock = (CId, PId, quantity) => {
        return this.dao.decreaseQuantityAndAddStock(CId, PId, quantity);
    }
    delete = async (CId, PId) => {
        return this.dao.delete(CId, PId);
    };

    getTotalPrice = async () => {
        return this.dao.getTotalPrice();
    }
};