import { usersModel } from './models/users.model.js'

export default class userService {


    getAll = async () => {
        let user = await usersModel.find();
        return user.map(student=>student.toObject());
    }
    save = async (user) => {
        let result = await usersModel.create(user);
        return result;
    }

    findByUsername = async (email) => {
        const result = await usersModel.findOne({email: email});
        return result;
    };

    update = async (filter, value) => {
        let result = await usersModel.updateOne(filter, value);
        return result;
    }
}