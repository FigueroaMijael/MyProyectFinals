import { Schema, model } from "mongoose";

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true // Agregado para hacer obligatorio el campo
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true // Agregado para hacer obligatorio el campo
};

const documentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    _id: { type: Schema.Types.ObjectId, auto: false },

});

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
    },
    documents: {
        type: [documentSchema], // Definición de un array de documentos
        default: []
    },
    last_connection: {
        type: Date, // Propiedad para almacenar la última conexión del usuario
        default: null
    }
});

const usersModel = model(collection, usersSchema);

export default usersModel;
