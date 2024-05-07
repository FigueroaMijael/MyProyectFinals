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
        type: [documentSchema],
        default: []
    },
    last_connection: {
        type: Date,
        default: null
    }
});

const usersModel = model(collection, usersSchema);

export default usersModel;
