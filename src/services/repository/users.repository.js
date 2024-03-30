export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = (_id) => {
        return this.dao.getAll(_id);
    }
    save = (user) => {
        return this.dao.save(user);
    }
    update = (_id, updateData) => {
        return this.dao.update(_id, updateData);
    }
    findByUsername = async (email) => {
        return this.dao.findByUsername(email);
    };

    delete = async (_id) => {
        return this.dao.delete(_id)
    }
};