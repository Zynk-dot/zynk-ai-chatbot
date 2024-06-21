
document.addEventListener("DOMContentLoaded", function() {
    const modeToggle = document.getElementById("mode-toggle");
    const body = document.body;
    const chatLog = document.getElementById("chat-log");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send-button");

    modeToggle.addEventListener("click", function() {
        body.classList.toggle("dark-mode");
    });

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === "") return;

        appendMessage("You", message, true);
        messageInput.value = "";

        fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage("Bot", data.message, false);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    function appendMessage(sender, message, isUser) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(isUser ? "user-message" : "bot-message");

        const messageBox = document.createElement("div");
        messageBox.classList.add("message-box");
        messageBox.classList.add(isUser ? "user-message-box" : "bot-message-box");
        messageBox.innerText = message;

        messageElement.appendChild(messageBox);
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
