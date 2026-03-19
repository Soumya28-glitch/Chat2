const REQUIRED_PIN = "Somu@Khushi";
const MAX_FILE_SIZE = 90 * 1024; 
let myName, chatRef; 

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

// --- Fix for Sync Stuck ---
function lockApp() {
    if (document.getElementById('chat').style.display === 'flex') {
        document.getElementById('chat').style.display = 'none';
        document.getElementById('login').style.display = 'flex';
        document.getElementById('secret-code').value = ''; 
        if (chatRef) { chatRef.off(); chatRef = null; }
        database.goOffline(); // Close connection for security
        document.getElementById('messages').innerHTML = ''; 
    }
}

function initApp() {
    const unlockBtn = document.getElementById('unlock-btn');
    if(unlockBtn) unlockBtn.onclick = joinChat;
    const codeInput = document.getElementById('secret-code');
    if(codeInput) codeInput.onkeydown = (e) => { if (e.key === 'Enter') joinChat(); };
    setupMicLogic(); 
}
document.addEventListener("DOMContentLoaded", initApp);

function joinChat() {
    myName = document.getElementById('username').value.trim();
    const code = document.getElementById('secret-code').value.trim();
    if (!myName || code !== REQUIRED_PIN) {
        document.getElementById('login-error').innerText = "⚠️ Invalid Name or PIN";
        document.getElementById('login-error').style.display = 'block';
        return;
    }

    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'flex';
    document.getElementById('header-name').innerText = myName;

    // FORCE CONNECTION
    database.goOnline(); 
    const roomHash = CryptoJS.MD5(REQUIRED_PIN).toString();
    chatRef = database.ref('vaults/' + roomHash);

    addSystemMessage("Connecting to Secure Cloud...");

    chatRef.on('child_added', (snapshot) => {
        const msgData = snapshot.val();
        if (Date.now() - msgData.timestamp > 7 * 24 * 60 * 60 * 1000) {
            snapshot.ref.remove(); return;
        }
        try {
            const bytes = CryptoJS.AES.decrypt(msgData.payload, REQUIRED_PIN);
            const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            renderMessage(data.sender, data.text, data.sender === myName, data.time, data.isFile, data.fileName, data.fileType, data.isVoiceNote);
        } catch (e) {}
    });
}

function sendMessage() {
    const text = document.getElementById('msg-input').value.trim();
    if (text && chatRef) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const payload = { sender: myName, text: text, time: time, isFile: false };
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), REQUIRED_PIN).toString();
        chatRef.push({ payload: encrypted, timestamp: Date.now() });
        document.getElementById('msg-input').value = '';
    }
}

// --- Render Logic ---
function renderMessage(sender, content, isMine, time, isFile, fileName, fileType, isVoiceNote) {
    const container = document.getElementById('messages');
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-wrapper ' + (isMine ? 'my-msg-wrapper' : 'their-msg-wrapper');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + (isMine ? 'my-msg' : 'their-msg');
    
    if (isFile) {
        if (isVoiceNote) msgDiv.innerHTML = `<audio controls controlsList="nodownload"><source src="${content}"></audio>`;
        else if (fileType.startsWith('image/')) msgDiv.innerHTML = `<img src="${content}" style="width:100%; border-radius:8px;">`;
        else msgDiv.innerHTML = `<a href="${content}" download="${fileName}" class="file-link">📄 ${fileName}</a>`;
    } else {
        msgDiv.innerText = content;
    }

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerText = (isMine ? "" : sender + " • ") + time;
    msgDiv.appendChild(meta);
    wrapper.appendChild(msgDiv);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.style = "text-align:center; font-size:11px; color:#aaa; margin:10px; background:rgba(0,0,0,0.5); padding:5px; border-radius:10px;";
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
