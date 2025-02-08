document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");
  const chatHistory = document.getElementById("chatHistory");
  const sendButton = document.getElementById("sendButton");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = "";
    sendButton.disabled = true;
    const typingIndicator = showTypingIndicator();

    try {
      const response = await generateResponse(message);
      typingIndicator.remove();
      addMessage(response, false);
    } catch (error) {
      typingIndicator.remove();
      addMessage("Error: Unable to fetch response", false);
    } finally {
      sendButton.disabled = false;
    }
  });

  async function generateResponse(prompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC8UsmyR7Y4UO-dKqtofpI0OBhpSxnek1c`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) throw new Error("Failed to generate response");
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  function addMessage(text, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`;
    const timestamp = new Date().toLocaleTimeString();

    messageDiv.innerHTML = `
          <div class="avatar">${isUser ? "👤" : "🤖"}</div>
          <div class="message-content">${text}</div>
          <span class="timestamp">${timestamp}</span>
      `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "message ai-message";
    indicator.innerHTML = `<div class="avatar">🤖</div><div class="message-content">Typing...</div>`;
    chatMessages.appendChild(indicator);
    return indicator;
  }
});
