export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    save = (user) => {
        return this.dao.save(user);
    }
    update = (filter, value) => {
        return this.dao.update(filter, value);
    }
    findByUsername = async (email) => {
        return this.dao.findByUsername(email);
    };
};