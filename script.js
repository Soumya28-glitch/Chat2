const REQUIRED_PIN = "Somu@Khushi";
const MAX_FILE_SIZE = 90 * 1024; 
let myName;
let chatRef; 

const firebaseConfig = {
    apiKey: "AIzaSyCb62x3gcGMdvoEBbx4xYzzAyGm_Xn9kWQ",
    authDomain: "secretvault-71747.firebaseapp.com",
    projectId: "secretvault-71747",
    storageBucket: "secretvault-71747.firebasestorage.app",
    messagingSenderId: "331400127268",
    appId: "1:331400127268:web:7a3f6e71a595a9ba2509b1",
    measurementId: "G-NFL3EYMZXF"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("visibilitychange", function() { if (document.hidden) lockApp(); });

function lockApp() {
    if (document.getElementById('chat').style.display === 'flex') {
        if (myName && chatRef) {
            database.ref(chatRef.path.toString() + '/online_users/' + myName).remove();
        }
        document.getElementById('chat').style.display = 'none';
        document.getElementById('login').style.display = 'flex';
        document.getElementById('active-users').style.display = 'none';
        document.getElementById('secret-code').value = ''; 
        if (chatRef) { chatRef.off(); chatRef = null; }
        const btn = document.getElementById('unlock-btn');
        if (btn) { btn.innerText = "Unlock Room (Ready)"; btn.style.opacity = "1"; }
        document.getElementById('messages').innerHTML = ''; 
    }
}

function showError(message) {
    const errBox = document.getElementById('login-error');
    errBox.innerText = "⚠️ " + message;
    errBox.style.display = 'block';
    const btn = document.getElementById('unlock-btn');
    if (btn) { btn.innerText = "Unlock Room (Ready)"; btn.style.opacity = "1"; }
}

function initApp() {
    const unlockBtn = document.getElementById('unlock-btn');
    if(unlockBtn) {
        unlockBtn.innerText = "Unlock Room (Ready)";
        unlockBtn.onclick = function() { joinChat(); }; 
    }
    const codeInput = document.getElementById('secret-code');
    if(codeInput) {
        codeInput.onkeydown = function(e) { if (e.key === 'Enter') joinChat(); };
    }
    setupMicLogic(); 
}

document.addEventListener("DOMContentLoaded", initApp);
window.onload = initApp;

window.joinChat = joinChat;
window.toggleAttachments = toggleAttachments;
window.closeAttachments = closeAttachments;
window.triggerInput = triggerInput;
window.sendMessage = sendMessage;
window.shareLocation = shareLocation;
window.handleRawFile = handleRawFile;
window.handleImageFile = handleImageFile;

function toggleAttachments() { const menu = document.getElementById('attachment-menu'); menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid'; }
function closeAttachments() { document.getElementById('attachment-menu').style.display = 'none'; }
function triggerInput(id) { closeAttachments(); document.getElementById(id).click(); }

function joinChat() {
    try {
        document.getElementById('login-error').style.display = 'none';
        const btn = document.getElementById('unlock-btn');
        btn.innerText = "Syncing...";
        btn.style.opacity = "0.7";

        myName = document.getElementById('username').value.trim();
        const code = document.getElementById('secret-code').value.trim();

        if (!myName) return showError("Please enter your Name!");
        if (code !== REQUIRED_PIN) return showError("Incorrect PIN!");

        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'flex';
        document.getElementById('header-name').innerText = myName;

        const roomHash = CryptoJS.MD5(code).toString();
        chatRef = database.ref('secure_vaults/' + roomHash);

        // Presence Logic
        const presenceRef = database.ref('secure_vaults/' + roomHash + '/online_users/' + myName);
        const statusBar = document.getElementById('active-users');
        statusBar.style.display = 'block';
        presenceRef.set(true);
        presenceRef.onDisconnect().remove();

        database.ref('secure_vaults/' + roomHash + '/online_users').on('value', (snapshot) => {
            const users = snapshot.val();
            if (users) {
                const names = Object.keys(users).map(u => u === myName ? "You" : u).join(", ");
                statusBar.innerText = "● Active: " + names;
            }
        });

        addSystemMessage("Syncing database...");

        chatRef.on('child_added', (snapshot) => {
            if (snapshot.key === 'online_users') return;
            const msgData = snapshot.val();
            const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - msgData.timestamp > SEVEN_DAYS_MS) { snapshot.ref.remove(); return; }
            try {
                const bytes = CryptoJS.AES.decrypt(msgData.payload, REQUIRED_PIN);
                const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                if (data) { renderMessage(data.sender, data.text, data.sender === myName, data.time, data.isFile, data.fileName, data.fileType, data.isVoiceNote); }
            } catch (e) {}
        });
    } catch (error) { showError("Connection Error."); }
}

function sendMessage() {
    const text = document.getElementById('msg-input').value.trim();
    if (text) { sendPayload(text, false, "", "", false); document.getElementById('msg-input').value = ''; closeAttachments(); }
}

function shareLocation() {
    closeAttachments();
    if (navigator.geolocation) {
        addSystemMessage("Locating...");
        navigator.geolocation.getCurrentPosition((pos) => {
            const link = `https://www.google.com/maps?q=$${pos.coords.latitude},${pos.coords.longitude}`;
            sendPayload(`📍 My Location:\n${link}`, false, "", "", false);
        });
    }
}

function handleRawFile(event) {
    const file = event.target.files[0];
    if (!file || file.size > MAX_FILE_SIZE) return addSystemMessage("Too large (>90KB)");
    const reader = new FileReader();
    reader.onload = (e) => sendPayload(e.target.result, true, file.name, file.type, false);
    reader.readAsDataURL(file);
}

function handleImageFile(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400; canvas.width = MAX_WIDTH;
            canvas.height = img.height * (MAX_WIDTH / img.width);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const base64Data = canvas.toDataURL('image/jpeg', 0.5); 
            if(base64Data.length < 130000) sendPayload(base64Data, true, file.name, 'image/jpeg', false);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function setupMicLogic() {
    let mediaRecorder, audioChunks = [], isRecording = false, startX; 
    const micBtn = document.getElementById('mic-btn-dedicated');
    const recordingViz = document.getElementById('recording-viz');
    if(!micBtn) return;
    micBtn.onpointerdown = function(e) {
        micBtn.setPointerCapture(e.pointerId); startX = e.clientX; isRecording = true;
        micBtn.classList.add('active'); startAudio();
    };
    micBtn.onpointermove = function(e) { if (isRecording && (e.clientX - startX) < -50) stopAudio(false); };
    micBtn.onpointerup = function() { stopAudio(true); };
    function startAudio() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            recordingViz.classList.add('active');
            mediaRecorder = new MediaRecorder(stream); audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.start();
        });
    }
    function stopAudio(send) {
        if (!isRecording) return; isRecording = false; micBtn.classList.remove('active'); recordingViz.classList.remove('active');
        if (mediaRecorder) {
            mediaRecorder.onstop = () => {
                if (send) {
                    const blob = new Blob(audioChunks, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.onload = (e) => sendPayload(e.target.result, true, "VoiceNote.webm", 'audio/webm', true);
                    reader.readAsDataURL(blob);
                }
                mediaRecorder.stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.stop();
        }
    }
}

function sendPayload(content, isFile, fileName, fileType, isVoiceNote) {
    if (!chatRef) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payload = { sender: myName, text: content, time: time, isFile: isFile, fileName: fileName, fileType: fileType, isVoiceNote: isVoiceNote };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), REQUIRED_PIN).toString();
    chatRef.push({ payload: encrypted, timestamp: Date.now() });
}

function renderMessage(sender, content, isMine, time, isFile, fileName, fileType, isVoiceNote) {
    const container = document.getElementById('messages');
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-wrapper ' + (isMine ? 'my-msg-wrapper' : 'their-msg-wrapper');

    const nameLabel = document.createElement('div');
    nameLabel.style = "font-size: 11px; font-weight: 600; margin-bottom: 2px; color: " + (isMine ? "#00a884" : "#8696a0") + ";";
    nameLabel.innerText = isMine ? "You" : sender;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + (isMine ? 'my-msg' : 'their-msg');

    if (isFile) {
        if (isVoiceNote || (fileType && fileType.startsWith('audio/'))) {
            msgDiv.innerHTML = `<audio controls controlsList="nodownload noplaybackrate"><source src="${content}"></audio>`;
        } else if (fileType && fileType.startsWith('image/')) {
            msgDiv.innerHTML = `<img src="${content}" style="max-width:100%; border-radius:8px;">`;
        } else {
            msgDiv.innerHTML = `<a href="${content}" download="${fileName}" class="file-link">📄 ${fileName}</a>`;
        }
    } else {
        msgDiv.innerHTML = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="file-link">$1</a>');
    }

    const meta = document.createElement('div'); meta.className = 'meta'; meta.innerText = time; 

    wrapper.appendChild(nameLabel); msgDiv.appendChild(meta); wrapper.appendChild(msgDiv);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.style = "text-align:center; font-size:11px; color:#aaa; margin:5px; z-index:2; background: rgba(0,0,0,0.5); border-radius: 10px; padding: 4px 8px; align-self: center;";
    msg.innerText = "🔒 " + text;
    document.getElementById('messages').appendChild(msg);
}
