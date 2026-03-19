// --- Core Configuration ---
const REQUIRED_PIN = "Somu@Khushi";
const MAX_FILE_SIZE = 90 * 1024; // 90KB Limit
let client;
let roomTopic;
let myName;

// --- Error Handling ---
function showError(message) {
    const errBox = document.getElementById('login-error');
    errBox.innerText = "⚠️ " + message;
    errBox.style.display = 'block';
    const btn = document.getElementById('unlock-btn');
    if (btn) {
        btn.innerText = "Unlock Room (Ready)";
        btn.style.opacity = "1";
    }
}

// --- MASTER SETUP: Sandbox Bypass ---
document.addEventListener("DOMContentLoaded", function() {
    const unlockBtn = document.getElementById('unlock-btn');
    
    // 1. Visual proof that script.js is successfully linked!
    if(unlockBtn) {
        unlockBtn.innerText = "Unlock Room (Ready)";
        // Force bind the click event safely
        unlockBtn.addEventListener('click', joinChat);
    }

    // 2. Safe Keyboard mapping
    const codeInput = document.getElementById('secret-code');
    if(codeInput) codeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') joinChat(); });
    
    const msgInput = document.getElementById('msg-input');
    if(msgInput) msgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
    
    // 3. Setup Mic
    setupMicLogic(); 
});

// Expose functions globally just in case HTML needs them
window.joinChat = joinChat;
window.toggleAttachments = toggleAttachments;
window.closeAttachments = closeAttachments;
window.triggerInput = triggerInput;
window.sendMessage = sendMessage;
window.shareLocation = shareLocation;
window.handleRawFile = handleRawFile;
window.handleImageFile = handleImageFile;

// --- UI Controls ---
function toggleAttachments() { 
    const menu = document.getElementById('attachment-menu'); 
    menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid'; 
}
function closeAttachments() { document.getElementById('attachment-menu').style.display = 'none'; }
function triggerInput(id) { closeAttachments(); document.getElementById(id).click(); }

// --- Login & Connection ---
function joinChat() {
    try {
        document.getElementById('login-error').style.display = 'none';
        const btn = document.getElementById('unlock-btn');
        btn.innerText = "Decrypting...";
        btn.style.opacity = "0.7";

        // Validate Security Libraries
        if (typeof CryptoJS === 'undefined' || typeof mqtt === 'undefined') {
            return showError("Security libraries blocked. Check internet or turn off adblocker.");
        }

        myName = document.getElementById('username').value.trim();
        const code = document.getElementById('secret-code').value.trim();
        
        if (!myName) return showError("Please enter your Display Name!");
        if (code !== REQUIRED_PIN) return showError("Incorrect PIN! Try again.");

        // Successful Login UI
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'flex';
        document.getElementById('header-name').innerText = myName;

        // Secure Room Generation
        roomTopic = "e2ee_vault_xyz_998/" + CryptoJS.MD5(code).toString();
        
        // Connect to MQTT Broker
        client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

        client.on('connect', () => { 
            client.subscribe(roomTopic); 
            addSystemMessage("Connected to End-to-End Encrypted Vault.");
        });

        client.on('error', (err) => addSystemMessage("Network error: " + err.message));

        client.on('message', (topic, message) => {
            try {
                const bytes = CryptoJS.AES.decrypt(message.toString(), REQUIRED_PIN);
                const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                if (data && data.sender !== myName) {
                    renderMessage(data.sender, data.text, false, data.time, data.isFile, data.fileName, data.fileType, data.isVoiceNote);
                }
            } catch (e) { console.error("Decryption failed", e); }
        });

    } catch (error) { showError(error.message); }
}

// --- Messaging Logic ---
function sendMessage() {
    const text = document.getElementById('msg-input').value.trim();
    if (text) {
        sendPayload(text, false, "", "", false);
        document.getElementById('msg-input').value = '';
        closeAttachments();
    }
}

function shareLocation() {
    closeAttachments();
    if (navigator.geolocation) {
        addSystemMessage("Fetching GPS location...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const link = `https://www.google.com/maps?q=$${pos.coords.latitude},${pos.coords.longitude}`;
                sendPayload(`📍 My Location:\n${link}`, false, "", "", false);
            },
            () => addSystemMessage("Location access denied by phone settings.")
        );
    } else { addSystemMessage("Geolocation is not supported."); }
}

// --- File Handling ---
function handleRawFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
        addSystemMessage(`File too large (${Math.round(file.size/1024)}KB). Keep under 90KB.`);
        event.target.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = (e) => sendPayload(e.target.result, true, file.name, file.type, false);
    reader.readAsDataURL(file);
    event.target.value = '';
}

function handleImageFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    addSystemMessage("Encrypting & optimizing image...");

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400; 
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const base64Data = canvas.toDataURL('image/jpeg', 0.5); 
            if(base64Data.length > 120000) { addSystemMessage("Image too detailed after compression."); return; }
            sendPayload(base64Data, true, file.name, 'image/jpeg', false);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

// --- Voice Recording ---
function setupMicLogic() {
    let mediaRecorder, audioChunks = [], startTime, timerInterval, isRecording = false, startX; 
    const micBtn = document.getElementById('mic-btn-dedicated');
    const recordingViz = document.getElementById('recording-viz');
    const timerDisplay = document.getElementById('recording-timer');
    const inputArea = document.getElementById('input-area');

    if(!micBtn) return;

    micBtn.addEventListener('contextmenu', (e) => e.preventDefault());

    micBtn.addEventListener('pointerdown', (e) => {
        closeAttachments();
        micBtn.setPointerCapture(e.pointerId);
        startX = e.clientX;
        isRecording = true;
        micBtn.classList.add('active');
        startAudioRecording();
    });

    micBtn.addEventListener('pointermove', (e) => {
        if (!isRecording) return;
        if ((e.clientX - startX) < -50) cancelAudioRecording("Voice note cancelled."); 
    });

    micBtn.addEventListener('pointerup', () => stopAudioRecording(true));
    micBtn.addEventListener('pointerout', () => stopAudioRecording(true)); 

    function startAudioRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { 
            addSystemMessage("Microphone access blocked by browser."); 
            isRecording = false; micBtn.classList.remove('active'); return; 
        }

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            inputArea.style.opacity = '0'; 
            recordingViz.classList.add('active');
            
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", e => audioChunks.push(e.data));

            startTime = new Date();
            timerDisplay.innerText = '0:00';
            timerInterval = setInterval(() => {
                const elapsed = Math.round((new Date() - startTime) / 1000);
                timerDisplay.innerText = `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`;
                if(elapsed >= 30) cancelAudioRecording("30s limit reached to save data."); 
            }, 1000);

            mediaRecorder.start();
        }).catch(() => { addSystemMessage("Mic permission denied."); isRecording = false; micBtn.classList.remove('active'); });
    }

    function cancelAudioRecording(msg) {
        if (!isRecording) return;
        isRecording = false;
        stopAudioRecording(false);
        addSystemMessage(msg);
    }

    function stopAudioRecording(shouldSend) {
        if (!isRecording) return;
        isRecording = false;
        micBtn.classList.remove('active');
        clearInterval(timerInterval);
        recordingViz.classList.remove('active');
        inputArea.style.opacity = '1'; 

        if (!mediaRecorder) return;
        mediaRecorder.addEventListener("stop", () => {
            if(shouldSend) {
                addSystemMessage("Encrypting voice note...");
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                if (audioBlob.size > MAX_FILE_SIZE) { addSystemMessage(`Voice note too large! Try a shorter recording.`); return; }
                const reader = new FileReader();
                reader.onload = (e) => sendPayload(e.target.result, true, "VoiceNote.webm", 'audio/webm', true);
                reader.readAsDataURL(audioBlob);
            }
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            mediaRecorder = null;
        });
        mediaRecorder.stop();
    }
}

// --- Data Encryption & Rendering ---
function sendPayload(content, isFile, fileName, fileType, isVoiceNote) {
    if (!client) return;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payload = { sender: myName, text: content, time: timeString, isFile: isFile || false, fileName: fileName || "", fileType: fileType || "", isVoiceNote: isVoiceNote || false };
    
    const encryptedText = CryptoJS.AES.encrypt(JSON.stringify(payload), REQUIRED_PIN).toString();
    client.publish(roomTopic, encryptedText);
    renderMessage(myName, content, true, timeString, isFile, fileName, fileType, isVoiceNote);
}

function renderMessage(sender, content, isMine, time, isFile, fileName, fileType, isVoiceNote) {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-wrapper ' + (isMine ? 'my-msg-wrapper' : 'their-msg-wrapper');

    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + (isMine ? 'my-msg' : 'their-msg');

    if (isFile) {
        if (isVoiceNote || (fileType && fileType.startsWith('audio/'))) msgDiv.innerHTML = `<audio controls><source src="${content}"></audio>`;
        else if (fileType && fileType.startsWith('image/')) msgDiv.innerHTML = `<img src="${content}" alt="Image">`;
        else msgDiv.innerHTML = `<a href="${content}" download="${fileName}" class="file-link">📄 ${fileName}</a>`;
    } else {
        msgDiv.innerHTML = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="file-link">$1</a>');
    }

    const metaDiv = document.createElement('div');
    metaDiv.className = 'meta';
    metaDiv.innerText = isMine ? time : sender + " • " + time; 

    msgDiv.appendChild(metaDiv);
    wrapper.appendChild(msgDiv);
    
    const container = document.getElementById('messages');
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.style = "text-align:center; font-size:11px; color:#aaa; margin:5px; z-index:2; background: rgba(0,0,0,0.5); border-radius: 10px; padding: 4px 8px; align-self: center;";
    msg.innerText = "🔒 " + text;
    const container = document.getElementById('messages');
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}
