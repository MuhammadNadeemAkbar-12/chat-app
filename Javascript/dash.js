document.addEventListener("DOMContentLoaded", () => {
    // User authentication check
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem("formData")) || [];
    const currentUserData = allUsers.find(user => user.id === currentUser.id);

    if (!currentUserData) {
        alert("User data not found. Please login again.");
        window.location.href = "login.html";
        return;
    }

    // Display current user with name if available
    const currentUserName = currentUserData.username || currentUserData.id;
    document.getElementById("current-user").textContent = `Logged in as: ${currentUserName}`;

    // Initialize chat system
    initChatSystem();

    function initChatSystem() {
        loadContacts();

        document.getElementById("logout-btn").addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });

        document.getElementById("add-user-btn").addEventListener("click", addNewContact);

        document.getElementById("contacts-list").addEventListener("click", (e) => {
            if (e.target.tagName === "LI" || e.target.closest("li")) {
                const li = e.target.tagName === "LI" ? e.target : e.target.closest("li");
                const contactId = li.getAttribute("data-id");
                startChat(contactId);
            }
        });

        document.getElementById("send-btn").addEventListener("click", sendMessage);
        document.getElementById("message-input").addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }

    function addNewContact() {
        const newUserEmail = document.getElementById("new-user-email").value.trim().toLowerCase();
        if (!newUserEmail) {
            alert("Please enter a valid email");
            return;
        }

        const userExists = allUsers.find(user => user.userEmail === newUserEmail);
        if (!userExists) {
            alert("User not found");
            return;
        }

        if (userExists.id === currentUserData.id) {
            alert("You can't add yourself as a contact");
            return;
        }

        if (!currentUserData.friends) currentUserData.friends = [];
        if (currentUserData.friends.includes(userExists.id)) {
            alert("User already in contacts");
            return;
        }

        currentUserData.friends.push(userExists.id);

        // Also add current user to the other user's friends list
        if (!userExists.friends) userExists.friends = [];
        if (!userExists.friends.includes(currentUserData.id)) {
            userExists.friends.push(currentUserData.id);
        }

        // Update in allUsers array
        const currentUserIndex = allUsers.findIndex(u => u.id === currentUserData.id);
        const contactUserIndex = allUsers.findIndex(u => u.id === userExists.id);

        allUsers[currentUserIndex] = currentUserData;
        allUsers[contactUserIndex] = userExists;

        localStorage.setItem("formData", JSON.stringify(allUsers));
        loadContacts();
        document.getElementById("new-user-email").value = "";
        bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
    }

    function loadContacts() {
        const contactsList = document.getElementById("contacts-list");
        contactsList.innerHTML = "";

        if (!currentUserData.friends || currentUserData.friends.length === 0) {
            contactsList.innerHTML = '<li class="text-muted">No contacts yet</li>';
            document.getElementById("message-input").disabled = true;
            document.getElementById("send-btn").disabled = true;
            return;
        }

        currentUserData.friends.forEach(friendId => {
            const friend = allUsers.find(u => u.id === friendId);
            if (!friend) return;

            const li = document.createElement("li");
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong class="contact-name">${friend.username || friend.id}</strong>
                        <div class="text-muted small contact-email">${friend.userEmail || friend.id}</div>
                    </div>
                    <small class="last-message-time text-muted"></small>
                </div>
            `;
            li.setAttribute("data-id", friend.id);
            contactsList.appendChild(li);

            loadLastMessageTime(friend.id, li);
        });
    }

    function loadLastMessageTime(contactId, contactElement) {
        const chatKey = getChatKey(currentUserData.id, contactId);
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];

        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const timeElement = contactElement.querySelector(".last-message-time");
            timeElement.textContent = formatMessageTime(lastMessage.timestamp);
        }
    }

    function startChat(contactId) {
        const contact = allUsers.find(u => u.id === contactId);
        const contactName = contact ? (contact.username || contact.id) : contactId;

        document.getElementById("chat-with-user").textContent = `Chat with ${contactName}`;
        document.getElementById("chat-with-user").setAttribute("data-id", contactId);
        document.getElementById("message-input").disabled = false;
        document.getElementById("send-btn").disabled = false;
        loadChatMessages(contactId);
    }

    function loadChatMessages(contactId) {
        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML = "";

        const chatKey = getChatKey(currentUserData.id, contactId);
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];

        messages.forEach((msg, index) => {
            // Skip messages deleted for current user
            if (msg.deletedFor && msg.deletedFor.includes(currentUserData.id)) {
                return;
            }

            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");
            messageDiv.classList.add(msg.sender === currentUserData.id ? "sent" : "received");
            messageDiv.setAttribute("data-index", index);

            // Get sender name
            const sender = allUsers.find(u => u.id === msg.sender);
            const senderName = sender ? (sender.username || sender.id) : msg.sender;

            // Message content
            let messageContent;
            if (msg.deleted) {
                messageContent = '<div class="text-muted"><i>Message deleted</i></div>';
            } else {
                messageContent = `
                    <div class="message-text">${msg.text}</div>
                    ${msg.edited ? '<small class="text-muted">(edited)</small>' : ''}
                `;
            }

            const menuButton = document.createElement("button");
            menuButton.className = "message-menu-btn";
            menuButton.innerHTML = '&#8942;';
            menuButton.onclick = (e) => {
                e.stopPropagation();
                showMessageMenu(e, msg, chatKey, index);
            };

            messageDiv.innerHTML = `
                ${msg.sender !== currentUserData.id ? `<div class="sender-name small">${senderName}</div>` : ""}
                ${messageContent}
                <div class="message-time">${formatMessageTime(msg.timestamp)}</div>
            `;

            messageDiv.appendChild(menuButton);
            chatMessages.appendChild(messageDiv);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showMessageMenu(event, msg, chatKey, index) {
        const existingMenu = document.querySelector(".message-context-menu");
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement("div");
        menu.className = "message-context-menu";
        menu.style.position = "fixed";

        let left = event.clientX;
        let top = event.clientY;
        const menuWidth = 200;
        const menuHeight = 120;

        if (left + menuWidth > window.innerWidth) {
            left = window.innerWidth - menuWidth - 10;
        }
        if (top + menuHeight > window.innerHeight) {
            top = window.innerHeight - menuHeight - 10;
        }

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        menu.style.zIndex = "1000";

        const editBtn = document.createElement("button");
        editBtn.className = "menu-item";
        editBtn.innerHTML = '<i class="bi bi-pencil"></i> Edit';
        editBtn.onclick = () => {
            editMessage(chatKey, index);
            menu.remove();
        };
        menu.appendChild(editBtn);

        const deleteMeBtn = document.createElement("button");
        deleteMeBtn.className = "menu-item";
        deleteMeBtn.innerHTML = '<i class="bi bi-trash"></i> Delete for me';
        deleteMeBtn.onclick = () => {
            deleteMessage(chatKey, index, false);
            menu.remove();
        };
        menu.appendChild(deleteMeBtn);

        const deleteAllBtn = document.createElement("button");
        deleteAllBtn.className = "menu-item";
        deleteAllBtn.innerHTML = '<i class="bi bi-trash-fill"></i> Delete for everyone';
        deleteAllBtn.onclick = () => {
            deleteMessage(chatKey, index, true);
            menu.remove();
        };
        menu.appendChild(deleteAllBtn);

        document.body.appendChild(menu);

        const clickHandler = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener("click", clickHandler);
            }
        };
        document.addEventListener("click", clickHandler);
    }

    function sendMessage() {
        const messageInput = document.getElementById("message-input");
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        const contactId = document.getElementById("chat-with-user").getAttribute("data-id");
        if (!contactId) return;

        const timestamp = new Date().toISOString();

        const chatKey = getChatKey(currentUserData.id, contactId);
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];

        messages.push({
            sender: currentUserData.id,
            text: messageText,
            timestamp: timestamp,
            edited: false,
            deleted: false,
            deletedFor: []
        });

        localStorage.setItem(chatKey, JSON.stringify(messages));
        messageInput.value = "";
        loadChatMessages(contactId);

        updateContactLastMessageTime(contactId, timestamp);
    }

    function editMessage(chatKey, messageIndex) {
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
        const message = messages[messageIndex];

        const newText = prompt("Edit your message:", message.text);
        if (newText !== null && newText.trim() !== "" && newText !== message.text) {
            message.text = newText.trim();
            message.edited = true;
            message.timestamp = new Date().toISOString();
            localStorage.setItem(chatKey, JSON.stringify(messages));

            const contactId = document.getElementById("chat-with-user").getAttribute("data-id");
            loadChatMessages(contactId);
        }
    }

    function deleteMessage(chatKey, messageIndex, deleteForEveryone) {
        const messages = JSON.parse(localStorage.getItem(chatKey)) || [];

        if (deleteForEveryone) {
            messages[messageIndex].deleted = true;
            messages[messageIndex].text = "[deleted]";
        } else {
            if (!messages[messageIndex].deletedFor) {
                messages[messageIndex].deletedFor = [];
            }
            if (!messages[messageIndex].deletedFor.includes(currentUserData.id)) {
                messages[messageIndex].deletedFor.push(currentUserData.id);
            }
        }

        localStorage.setItem(chatKey, JSON.stringify(messages));

        const contactId = document.getElementById("chat-with-user").getAttribute("data-id");
        loadChatMessages(contactId);
    }

    function updateContactLastMessageTime(contactId, timestamp) {
        const contacts = document.querySelectorAll("#contacts-list li");
        contacts.forEach(contact => {
            if (contact.getAttribute("data-id") === contactId) {
                const timeElement = contact.querySelector(".last-message-time");
                timeElement.textContent = formatMessageTime(timestamp);
            }
        });
    }

    function formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function getChatKey(id1, id2) {
        return [id1, id2].sort().join("_");
    }

    const style = document.createElement("style");
    style.textContent = `
        .message-menu-btn {
            position: absolute;
            right: 5px;
            top: 5px;
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            font-size: 1.2rem;
        }
        .sent .message-menu-btn {
            color: rgba(255,255,255,0.7);
        }
        .message:hover .message-menu-btn {
            opacity: 1;
        }
        .message-context-menu {
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            padding: 5px 0;
            min-width: 180px;
            position: fixed;
            z-index: 1000;
        }
        .menu-item {
            display: block;
            width: 100%;
            text-align: left;
            padding: 8px 15px;
            background: none;
            border: none;
            color: #333;
            cursor: pointer;
        }
        .menu-item:hover {
            background-color: #f5f5f5;
        }
        .menu-item i {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
});