import { Schema, model } from "mongoose";

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};

const usersSchema = new Schema({
    first_name: stringTypeSchemaNonUniqueRequired,

    last_name: stringTypeSchemaNonUniqueRequired,

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