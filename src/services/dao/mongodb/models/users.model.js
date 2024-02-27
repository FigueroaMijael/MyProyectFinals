import { Schema, model } from "mongoose";

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,

};

const stringTypeSchemaNonUniqueRequired = {
    type: String,

};

const usersSchema = new Schema({
    name: stringTypeSchemaNonUniqueRequired,

    lastName: stringTypeSchemaNonUniqueRequired,

    email: stringTypeSchemaUniqueRequired,

    age: stringTypeSchemaNonUniqueRequired,

    password: stringTypeSchemaNonUniqueRequired,
    loggedBy: {
        type: String,
        default: 'form', // Valor por defecto
        enum: ['form', 'github'], // Valores permitidos
    },
    
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium'],
    }
});

const usersModel = model("users", usersSchema);

export {usersModel}