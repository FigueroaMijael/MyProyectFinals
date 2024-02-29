// Obtener el nombre de usuario
const user = "{{user}}"; 

const userName = document.querySelector("#userName").value;

// Verificar si el usuario está autenticado
if (!userName) {
  window.location.href = '/login';
}

const socket = io();

const chatbox = document.querySelector("#chatbox");
const messagesContainer = document.querySelector("#messages");

const handleMessageSend = (e) => {
  if (e.key === "Enter") {
    const message = e.target.value;
    socket.emit("message", { user: userName, message });
    chatbox.value = "";
  }
};

socket.on("connected", (data) => {
});

socket.on("messages", (data) => {
  const messages = data.map((message) => `<strong>${message.user}</strong>: ${message.message}<br>`).join("");
  messagesContainer.innerHTML = messages;
});


chatbox.addEventListener("keyup", handleMessageSend);