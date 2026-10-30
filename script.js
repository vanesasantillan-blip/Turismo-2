// Para probar localmente, dejá esta dirección. Al publicar el servidor, reemplazala por su URL pública.
const API_URL = "http://localhost:3000/api/chat";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");
const clearHistory = document.getElementById("clearHistory");
const themeToggle = document.getElementById("themeToggle");

// El historial se conserva mientras dure la sesión del navegador.
let historyChat = JSON.parse(sessionStorage.getItem("travelAIHistory") || "[]");

function addMessage(text, sender) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender === "user" ? "user-message" : "assistant-message"}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = sender === "user" ? "Tú" : "✈";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text; // textContent evita insertar HTML ingresado por el usuario.

  wrapper.append(avatar, bubble);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveHistory() {
  sessionStorage.setItem("travelAIHistory", JSON.stringify(historyChat));
}

function renderHistory() {
  chatMessages.innerHTML = "";
  addMessage("¡Hola! Soy TravelAI 🌎 Estoy acá para ayudarte a descubrir lugares y planificar tu próximo viaje. ¿Qué destino te gustaría conocer?", "assistant");
  historyChat.forEach(item => addMessage(item.content, item.role === "user" ? "user" : "assistant"));
}

renderHistory();

async function sendQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) {
    userInput.setCustomValidity("Escribí una pregunta antes de enviar.");
    userInput.reportValidity();
    return;
  }
  userInput.setCustomValidity("");
  if (cleanQuestion.length > 500) return;

  addMessage(cleanQuestion, "user");
  historyChat.push({ role: "user", content: cleanQuestion });
  saveHistory();
  userInput.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "…";

  const waiting = document.createElement("div");
  waiting.className = "message assistant-message";
  const waitAvatar = document.createElement("div");
  waitAvatar.className = "message-avatar";
  waitAvatar.textContent = "✈";
  const waitBubble = document.createElement("div");
  waitBubble.className = "bubble";
  waitBubble.textContent = "Estoy buscando ideas para tu viaje...";
  waiting.append(waitAvatar, waitBubble);
  chatMessages.appendChild(waiting);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    // Enviamos los últimos mensajes para que la IA pueda mantener el contexto.
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: historyChat.slice(-12) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
    waiting.remove();
    addMessage(data.answer, "assistant");
    historyChat.push({ role: "assistant", content: data.answer });
    saveHistory();
  } catch (error) {
    waiting.remove();
    addMessage("No pude conectarme con el asistente. Revisá que el servidor esté iniciado y que la clave de IA esté configurada. (" + error.message + ")", "assistant");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "➤";
    userInput.focus();
  }
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  sendQuestion(userInput.value);
});

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => sendQuestion(button.dataset.question));
});

clearHistory.addEventListener("click", () => {
  historyChat = [];
  sessionStorage.removeItem("travelAIHistory");
  renderHistory();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀" : "☾";
  sessionStorage.setItem("travelAITheme", isDark ? "dark" : "light");
});

if (sessionStorage.getItem("travelAITheme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}
