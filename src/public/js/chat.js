// Obtener el nombre de usuario desde la plantilla Handlebars
const user = "{{user}}"; 

// Verificar si el usuario está autenticado
const userName = document.querySelector("#userName").value;

// Verificar si el usuario está autenticado
if (!userName) {
  // Redireccionar al usuario a la página de inicio de sesión si no está autenticado
  window.location.href = '/login';
}

// Inicializar la conexión del socket
const socket = io();

// Referencias a elementos del DOM
const chatbox = document.querySelector("#chatbox");
const messagesContainer = document.querySelector("#messages");

// Manejador de evento cuando el usuario envía un mensaje
const handleMessageSend = (e) => {
  if (e.key === "Enter") {
    const message = e.target.value;
    socket.emit("message", { user: userName, message }); // Enviar mensaje con el nombre de usuario
    chatbox.value = "";
  }
};

// Mostrar mensaje de nuevo usuario conectado (notificación personalizada)
socket.on("connected", (data) => {
  // Implementa aquí la notificación personalizada si lo deseas
});

// Actualizar la interfaz de mensajes cuando se reciben nuevos mensajes
socket.on("messages", (data) => {
  const messages = data.map((message) => `<strong>${message.user}</strong>: ${message.message}<br>`).join("");
  messagesContainer.innerHTML = messages;
});

// Event listener para escuchar el evento de enviar mensaje
chatbox.addEventListener("keyup", handleMessageSend);