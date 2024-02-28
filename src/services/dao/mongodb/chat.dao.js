import { chatModel } from "./models/messages.model.js";

class MessagesDao {
    async getAll() {
      try {
        const messages = await chatModel.find().sort({ timestamp: 1 });
        return messages;
      } catch (error) {
        throw new Error(`Error al obtener todos los mensajes: ${error.message}`);
      }
    }
  
    async save (user, message) {
      try {
        const newMessage = new chatModel({ user, message });
        await newMessage.save();
        return newMessage;
      } catch (error) {
        throw new Error(`Error al agregar un nuevo mensaje: ${error.message}`);
      }
    }
  }
  
  export default MessagesDao;
  