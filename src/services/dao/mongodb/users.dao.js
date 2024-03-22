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

    update = async (filter, updateValues) => {
    let result;
    if (filter._id) {

        result = await usersModel.updateOne({ _id: filter._id }, updateValues);
    } else if (filter.email) {

        result = await usersModel.updateOne({ email: filter.email }, updateValues);
    } else {

        throw new Error('Filtro no válido proporcionado para la actualización.');
    }
    return result;
}

}