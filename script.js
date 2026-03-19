* { box-sizing: border-box; }

:root {
    --primary: #075e54; 
    --secondary: #128c7e;
    --input-bg: #202c33;
    --mic-active: #ff416c;
}

body { 
    font-family: 'Poppins', sans-serif; 
    margin: 0; padding: 0; 
    background: #111; color: white; 
    overflow: hidden; 
    position: fixed; 
    top: 0; bottom: 0; left: 0; right: 0; 
}

.app-container { 
    width: 100%; height: 100%; 
    max-width: 450px; 
    margin: 0 auto;
    background: #0b141a; display: flex; flex-direction: column; position: relative; 
}

#login { display: flex; flex-direction: column; gap: 20px; padding: 40px; margin: auto; width: 100%; max-width: 350px; text-align: center; z-index: 100; }
h2 { margin: 0; font-weight: 600; font-size: 24px; color: #fff; }
input[type="text"], input[type="password"] { padding: 15px; border-radius: 8px; border: none; background: #2a2f32; color: white; font-size: 15px; outline: none; width: 100%;}
button.primary-btn { padding: 15px; background: #00a884; color: #111; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%;}

#chat { display: none; flex-direction: column; height: 100%; position: relative; z-index: 10; overflow: hidden; }
.chat-header { padding: 15px 20px; background: #202c33; border-bottom: 1px solid #2a2f32; font-weight: 600; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }

.active-status-bar {
    background: #111b21;
    color: #00a884;
    font-size: 11px;
    padding: 5px 20px;
    border-bottom: 1px solid #2a2f32;
    font-weight: 500;
    display: none;
}

#messages { 
    flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; 
    background-image: url('bg.jpg'); 
    background-size: cover; background-position: center; position: relative; 
}
#messages::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.35); z-index: 1; pointer-events: none;}
#messages * { z-index: 2; } 

.msg-wrapper { display: flex; flex-direction: column; max-width: 80%; z-index: 2;}
.my-msg-wrapper { align-self: flex-end; align-items: flex-end; }
.their-msg-wrapper { align-self: flex-start; align-items: flex-start; }

.msg { padding: 8px 12px; border-radius: 12px; font-size: 15px; word-wrap: break-word; line-height: 1.4; color: #e9edef; box-shadow: 0 1px 2px rgba(0,0,0,0.3); position: relative; }
.my-msg { background: #005c4b; border-top-right-radius: 0; }
.their-msg { background: #202c33; border-top-left-radius: 0; }
.meta { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 2px; text-align: right; }

.msg img { max-width: 100%; border-radius: 6px; margin-bottom: 5px; display: block; }
.file-link { color: #53bdeb; text-decoration: none; font-weight: 500; display: flex; align-items: center; gap: 5px; }

.msg audio { width: 220px; max-width: 100%; height: 35px; border-radius: 12px; background: transparent; }

#input-area-container { 
    min-height: 70px; display: flex; align-items: center; z-index: 20; 
    background: var(--input-bg); border-top: 1px solid #2a2f32; 
    padding: 10px 10px calc(10px + env(safe-area-inset-bottom)); 
    width: 100%; flex-shrink: 0; 
}
#input-area { display: flex; width: 100%; gap: 8px; align-items: center; }
#msg-input { 
    flex-grow: 1; border-radius: 20px; padding: 12px 15px; background: #2a2f32; 
    border: none; color: white; outline: none; font-family: 'Poppins', sans-serif;
    min-width: 0; 
}
.icon-btn { background: transparent; border: none; font-size: 24px; color: #8696a0; cursor: pointer; padding: 5px; flex-shrink: 0;}
#send-btn { background: #00a884; color: white; border-radius: 50%; width: 45px; height: 45px; display: flex; justify-content: center; align-items: center; font-size: 18px; flex-shrink: 0; border: none; margin: 0; }

#mic-btn-dedicated.active { color: var(--mic-active); animation: pulseRed 1s infinite; }
@keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(255, 65, 108, 0.7); border-radius: 50%;} 70% { box-shadow: 0 0 0 15px rgba(255, 65, 108, 0); border-radius: 50%;} 100% { box-shadow: 0 0 0 0 rgba(255, 65, 108, 0); border-radius: 50%;} }

#recording-viz { display: none; position: absolute; bottom: 0; left: 0; right: 0; height: 70px; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 30; align-items: center; justify-content: center; padding: 0 20px; color: white; gap: 15px; font-size: 14px; border-top: 1px solid #2a2f32; box-sizing: border-box;}
#recording-viz.active { display: flex; }

.rec-icon { color: var(--mic-active); font-size: 18px; animation: flashDot 0.8s infinite; }
@keyframes flashDot { 50% { opacity: 0; } }
#recording-timer { font-weight: 600; color: #e9edef;}
.rec-wave-container { display: flex; gap: 3px; align-items: flex-end; height: 15px; }
.rec-wave-bar { width: 3px; height: 3px; background-color: var(--mic-active); border-radius: 2px; animation: waveBar 0.8s infinite ease-in-out; }
@keyframes waveBar { 0%, 100% { height: 3px; } 50% { height: 15px; } }
#recording-cancel { position: absolute; bottom: 15px; font-size: 12px; color: #aaa; width: 100%; display: flex; align-items: center; justify-content: center; gap: 5px;}
.cancel-btn { font-size: 10px; padding: 3px; background: rgba(255,255,255,0.1); border-radius: 50%; width: 15px; height: 15px; display: flex; justify-content: center; align-items: center; color: white;}

#attachment-menu { 
    display: none; position: absolute; bottom: 70px; left: 10px; right: 10px; 
    background: #233138; border-radius: 16px; padding: 20px; 
    grid-template-columns: repeat(3, 1fr); gap: 20px; 
    box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 20; animation: popUp 0.2s ease-out;
}
@keyframes popUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.attach-item { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #e9edef; font-size: 12px; cursor: pointer; }
.attach-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; color: white; }
.bg-doc { background: #7f66ff; } .bg-cam { background: #d3396d; } .bg-gal { background: #bf59cf; } .bg-aud { background: #f26522; } .bg-loc { background: #009966; }
input[type="file"] { display: none; }
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
    micBtn.addEventListener('pointerdown', (e) => {
        micBtn.setPointerCapture(e.pointerId); startX = e.clientX; isRecording = true;
        micBtn.classList.add('active'); startAudio();
    });
    micBtn.addEventListener('pointermove', (e) => { if (isRecording && (e.clientX - startX) < -50) stopAudio(false); });
    micBtn.addEventListener('pointerup', () => stopAudio(true));
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

    const meta = document.createElement('div'); 
    meta.className = 'meta'; 
    meta.innerText = time; 

    wrapper.appendChild(nameLabel);
    msgDiv.appendChild(meta); 
    wrapper.appendChild(msgDiv);

    const container = document.getElementById('messages');
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.style = "text-align:center; font-size:11px; color:#aaa; margin:5px; z-index:2; background: rgba(0,0,0,0.5); border-radius: 10px; padding: 4px 8px; align-self: center;";
    msg.innerText = "🔒 " + text;
    document.getElementById('messages').appendChild(msg);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}
        // Fetch messages and listen for new ones
        chatRef.on('child_added', (snapshot) => {
            const msgData = snapshot.val();
            
            // --- THE 7-DAY AUTO-JANITOR ---
            const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - msgData.timestamp > SEVEN_DAYS_MS) {
                snapshot.ref.remove(); // Silently destroy it from the cloud
                return;
            }

            try {
                // Decrypt the payload
                const bytes = CryptoJS.AES.decrypt(msgData.payload, REQUIRED_PIN);
                const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                
                if (data) {
                    const isMine = (data.sender === myName);
                    renderMessage(data.sender, data.text, isMine, data.time, data.isFile, data.fileName, data.fileType, data.isVoiceNote);
                }
            } catch (e) { console.error("Decryption skip (wrong key or broken data)"); }
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

// --- Data Encryption & Database Push ---
function sendPayload(content, isFile, fileName, fileType, isVoiceNote) {
    if (!chatRef) return;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payloadObj = { 
        sender: myName, 
        text: content, 
        time: timeString, 
        isFile: isFile || false, 
        fileName: fileName || "", 
        fileType: fileType || "", 
        isVoiceNote: isVoiceNote || false 
    };
    
    // Encrypt the entire message
    const encryptedText = CryptoJS.AES.encrypt(JSON.stringify(payloadObj), REQUIRED_PIN).toString();
    
    // Send to Firebase (Firebase will automatically trigger the renderMessage function for us)
    chatRef.push({
        payload: encryptedText,
        timestamp: Date.now()
    });
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
    const msgInput = document.getElementById('msg-input');
    if(msgInput) msgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
    
    setupMicLogic(); 
});

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

        if (typeof CryptoJS === 'undefined' || typeof mqtt === 'undefined') {
            return showError("Security libraries blocked. Check internet or turn off adblocker.");
        }

        myName = document.getElementById('username').value.trim();
        const code = document.getElementById('secret-code').value.trim();
        
        if (!myName) return showError("Please enter your Display Name!");
        if (code !== REQUIRED_PIN) return showError("Incorrect PIN! Try again.");

        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'flex';
        document.getElementById('header-name').innerText = myName;

        roomTopic = "e2ee_vault_xyz_998/" + CryptoJS.MD5(code).toString();
        client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

        client.on('connect', () => { 
            client.subscribe(roomTopic); 
            // Load saved messages BEFORE showing the connection message
            loadHistoryFromPhone();
            addSystemMessage("Connected to End-to-End Encrypted Vault.");
        });

        client.on('error', (err) => addSystemMessage("Network error: " + err.message));

        client.on('message', (topic, message) => {
            try {
                const msgStr = message.toString();
                const bytes = CryptoJS.AES.decrypt(msgStr, REQUIRED_PIN);
                const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                if (data && data.sender !== myName) {
                    saveMessageToPhone(msgStr); // Save their message to memory
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
    
    saveMessageToPhone(encryptedText); // Save our own message to memory
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
