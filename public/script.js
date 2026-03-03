let currentMode = 'normal';
let queue = [];
let lastCall = 0;

// Check if user is logged in on page load
window.onload = function() {
    const session = localStorage.getItem('cursor_session');
    if (!session) {
        // Redirect to your Glassmorphism login page
        window.location.href = '/login.html';
    }
};


// Protects Gemini Key (9 RPM)
async function processQueue() {
    if (queue.length === 0) return;
    const now = Date.now();
    if (now - lastCall > 6667) {
        const { task, resolve } = queue.shift();
        lastCall = Date.now();
        resolve(await task());
        processQueue();
    } else {
        setTimeout(processQueue, 1000);
    }
}

function setStyleMode(mode) {
    currentMode = mode;
    document.getElementById('sidebar').classList.toggle('hidden', mode === 'normal');
    // Toggle active tabs
}

document.getElementById('send-btn').onclick = async () => {
    const prompt = document.getElementById('user-input').value;
    
    // Enforcement: Normal Mode cannot write files
    if (currentMode === 'normal' && prompt.includes("file")) {
        alert("Mode Not Supported: Switch to Coding Mode");
        return;
    }

    const task = async () => {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, mode: currentMode, model: 'gemini' })
        });
        return await res.json();
    };

    queue.push({ task, resolve: (data) => {
        document.getElementById('chat-screen').innerHTML += `<div>${data.response}</div>`;
    }});
    processQueue();
};
