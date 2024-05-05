import  usersModel  from '../../../modelsMongo/users.model.js'

export default class userDao {

    getAll = async (_id) => {

        if (!_id) {
            const users = await usersModel.find();
            return users;   
        } else {
            const user = await usersModel.findById(_id);
            return user; 
        }
    };

    findByUsername = async (email) => {
        const result = await usersModel.findOne({email: email});
        return result;
    };

    save = async (obj) => {
        const result = await usersModel.create(obj);
        return result;
    };


    update = async ( _id, updateData) => {

        const newProductUpdate = await usersModel.findByIdAndUpdate( _id, updateData);

        return newProductUpdate
    };
    
    delete = async (_id) => {
        const userDelete = usersModel.findByIdAndDelete(_id);
        return userDelete
    }

    findInactiveUsers = async (inactiveSince) => {
        const inactiveUsers = await usersModel.find({ last_connection: { $lt: inactiveSince } });
        return inactiveUsers;
    };
}