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
let myName, chatRef;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('unlock-btn').onclick = joinChat;
});

function joinChat() {
    myName = document.getElementById('username').value.trim();
    const code = document.getElementById('secret-code').value.trim();
    if (code !== REQUIRED_PIN) return;

    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'flex';
    
    database.goOnline();
    const roomHash = CryptoJS.MD5(REQUIRED_PIN).toString();
    chatRef = database.ref('vaults/' + roomHash);

    chatRef.on('child_added', (snapshot) => {
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
    msg.innerText = "🔒 " + text;
    document.getElementById('messages').appendChild(msg);
}

// --- Attachment/Mic Handlers (Simplified for stability) ---
function toggleAttachments() { 
    const m = document.getElementById('attachment-menu'); 
    m.style.display = m.style.display === 'grid' ? 'none' : 'grid'; 
}
function closeAttachments() { document.getElementById('attachment-menu').style.display = 'none'; }
function triggerInput(id) { closeAttachments(); document.getElementById(id).click(); }

function setupMicLogic() {
    let mediaRecorder, chunks = [], isRec = false;
    const btn = document.getElementById('mic-btn-dedicated');
    btn.onpointerdown = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
            mediaRecorder = new MediaRecorder(s);
            mediaRecorder.ondataavailable = e => chunks.push(e.data);
            mediaRecorder.start();
            isRec = true; btn.classList.add('active');
            document.getElementById('recording-viz').classList.add('active');
        });
    };
    btn.onpointerup = () => {
        if (!isRec) return;
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const r = new FileReader();
            r.onload = (e) => {
                const payload = { sender: myName, text: e.target.result, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), isFile: true, isVoiceNote: true };
                const enc = CryptoJS.AES.encrypt(JSON.stringify(payload), REQUIRED_PIN).toString();
                chatRef.push({ payload: enc, timestamp: Date.now() });
            };
            r.readAsDataURL(blob);
            mediaRecorder.stream.getTracks().forEach(t => t.stop());
        };
        mediaRecorder.stop();
        isRec = false; btn.classList.remove('active');
        document.getElementById('recording-viz').classList.remove('active');
        chunks = [];
    };
}
