// Global State for Hyper Self
let hyperActive = false;
let startTime = null;
const RPM_LIMIT = 9;
let requestCount = 0;

async function startHyperSelf(initialTask) {
    hyperActive = true;
    startTime = Date.now();
    renderTerminal("✨ HYPER SELF Mode Activated: Initializing 1-hour deep-fix loop...");

    while (hyperActive) {
        // Check 1-hour limit (3600000 ms)
        if (Date.now() - startTime > 3600000) {
            stopHyperSelf("Time limit reached.");
            break;
        }

        // 9 RPM Rate Limiter
        if (requestCount >= RPM_LIMIT) {
            renderTerminal("⏳ Rate limit reached. Cooling down for 60s...");
            await new Promise(r => setTimeout(r, 60000));
            requestCount = 0;
        }

        try {
            const response = await executeAgenticCycle(initialTask);
            if (response.status === 'fixed') {
                renderTerminal("✅ Logic Self-Corrected successfully.");
                hyperActive = false;
            }
            requestCount++;
        } catch (err) {
            renderTerminal(`⚠️ Error detected: ${err.message}. Re-routing to Gemini for fix...`);
        }
    }
}

function renderTerminal(msg) {
    const term = document.getElementById('hyper-terminal');
    term.innerHTML += `<div>[${new Date().toLocaleTimeString()}] ${msg}</div>`;
    term.scrollTop = term.scrollHeight;
}
