const socket = io();
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const username = document.getElementById('username');
const messages = document.getElementById('messages');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = username.value.trim();
  const message = input.value.trim();
  if (user && message) {
    const fullMessage = `${user}: ${message}`;
    socket.emit('chat message', fullMessage); // send message
    appendMessage(fullMessage); // show to sender immediately
    input.value = '';
  }
});

socket.on('chat message', function (msg) {
  appendMessage(msg);
});

function appendMessage(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
