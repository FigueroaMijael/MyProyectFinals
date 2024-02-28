export default class ChatRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    save = (user, message) => {
        return this.dao.save(user, message);
};
}