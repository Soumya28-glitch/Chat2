const REQUIRED_PIN = "Somu@Khushi";
const firebaseConfig = {
    apiKey: "AIzaSyCb62x3gcGMdvoEBbx4xYzzAyGm_Xn9kWQ",
    authDomain: "secretvault-71747.firebaseapp.com",
    projectId: "secretvault-71747",
    storageBucket: "secretvault-71747.firebasestorage.app",
    messagingSenderId: "331400127268",
    appId: "1:331400127268:web:7a3f6e71a595a9ba2509b1",
    measurementId: "G-NFL3EYMZXF",
    databaseURL: "https://secretvault-71747-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
let myName, chatRef, systemMsg;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('unlock-btn').onclick = joinChat;
    document.getElementById('msg-input').onkeydown = (e) => { if(e.key === 'Enter') sendMessage(); };
});

function joinChat() {
    myName = document.getElementById('username').value.trim();
    const code = document.getElementById('secret-code').value.trim();
    if (code !== REQUIRED_PIN) return;

    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'flex';
    
    // Force Wake Firebase
    database.goOnline();
    const roomHash = CryptoJS.MD5(REQUIRED_PIN).toString();
    chatRef = database.ref('vaults/' + roomHash);

    systemMsg = addSystemMessage("Connecting to Secure Cloud...");

    chatRef.on('child_added', (snapshot) => {
        // Remove "Connecting" message as soon as data arrives
        if(systemMsg) { systemMsg.remove(); systemMsg = null; }
        
        const msgData = snapshot.val();
        try {
            const bytes = CryptoJS.AES.decrypt(msgData.payload, REQUIRED_PIN);
            const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            renderMessage(data.sender, data.text, data.sender === myName, data.time);
        } catch (e) {}
    });
}

function sendMessage() {
    const text = document.getElementById('msg-input').value.trim();
    if (text && chatRef) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const payload = { sender: myName, text: text, time: time };
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), REQUIRED_PIN).toString();
        chatRef.push({ payload: encrypted, timestamp: Date.now() });
        document.getElementById('msg-input').value = '';
    }
}

function renderMessage(sender, content, isMine, time) {
    const container = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg-wrapper ' + (isMine ? 'my-msg-wrapper' : 'their-msg-wrapper');
    msgDiv.innerHTML = `<div class="msg ${isMine ? 'my-msg' : 'their-msg'}">${content}<div class="meta">${time}</div></div>`;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.id = "sys-msg";
    msg.style = "text-align:center; font-size:11px; color:#aaa; margin:10px; background:rgba(0,0,0,0.5); padding:5px; border-radius:10px;";
    msg.innerText = "🔒 " + text;
    document.getElementById('messages').appendChild(msg);
    return msg;
}

function toggleAttachments() { 
    const m = document.getElementById('attachment-menu'); 
    m.style.display = m.style.display === 'grid' ? 'none' : 'grid'; 
}
function closeAttachments() { document.getElementById('attachment-menu').style.display = 'none'; }
function triggerInput(id) { closeAttachments(); document.getElementById(id).click(); }
