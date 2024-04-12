import { Schema, model } from "mongoose";

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,

};

const stringTypeSchemaNonUniqueRequired = {
    type: String,

};

const collection = "Users";

const usersSchema = new Schema({
    name: stringTypeSchemaNonUniqueRequired,

    lastName: stringTypeSchemaNonUniqueRequired,

    email: stringTypeSchemaUniqueRequired,

    age: stringTypeSchemaNonUniqueRequired,

    password: stringTypeSchemaNonUniqueRequired,

    loggedBy: {
        type: String,
        default: 'form',
        enum: ['form', 'github'],
    },
    
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium'],
    }
});

const usersModel = model(collection, usersSchema);

export default {usersModel}