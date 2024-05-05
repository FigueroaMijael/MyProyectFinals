export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }
    
    getAll = async (_id, limit = 10, page = 1, sort, query, category, availability, code) => {
        return await this.dao.getAll(_id, limit, page, sort, query, category, availability, code);
    }    
    
    save = (prod) => {
        return this.dao.save(prod);
    }
    
    update = (_id, updateData ) => {
        return this.dao.update(_id, updateData);
    }
    
    delete = async (_id) => {
        return this.dao.delete(_id);
    };
};