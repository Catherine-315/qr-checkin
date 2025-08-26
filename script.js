// Paste your Make.com webhook URL here
const webhookUrl = "https://hook.eu2.make.com/nskxlifx9ppncoivfp3z5yqwa2yj22cv";

// Set your private password here.
const adminPassword = "sdev";

let html5QrCode;
let selectedDeviceId;

// --- Login Functions ---

function handleLogin() {
    const passwordInput = document.getElementById('password-input').value;
    const loginMessage = document.getElementById('login-message');

    if (passwordInput === adminPassword) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('scanner-container').classList.remove('hidden');
        populateCameraDropdown();
    } else {
        loginMessage.textContent = 'Incorrect password. Please try again.';
        loginMessage.style.color = 'red';
    }
}

// --- Scanning Functions (same as before) ---

function onScanSuccess(decodedText) {
    document.getElementById('result').textContent = `QR Code Scanned: ${decodedText}`;
    sendDataToMake(decodedText);
}

function onScanError(errorMessage) {
    console.error(`Scan error: ${errorMessage}`);
}

async function sendDataToMake(scannedId) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({ id: scannedId }),
            headers: { 'Content-Type': 'application/json' },
        });

        const resultElement = document.getElementById('result');
        const successSound = document.getElementById('successSound');

        if (response.ok) {
            resultElement.textContent = 'Welcome, ' + scannedId + '! Check-in successful.';
            resultElement.className = 'success-message';
            successSound.play();
        } else {
            resultElement.textContent = 'Error during check-in. Please try again.';
            resultElement.className = 'error-message';
        }
    } catch (error) {
        console.error('Network or fetch error:', error);
        document.getElementById('result').textContent = 'Network error. Please try again.';
        resultElement.className = 'error-message';
    } finally {
        setTimeout(() => {
            document.getElementById('result').textContent = 'Waiting for QR Code...';
            document.getElementById('result').className = '';
        }, 5000);
    }
}

async function startScanner() {
    try {
        const qrboxElement = document.getElementById('reader');
        if (!qrboxElement) {
            document.getElementById('result').textContent = "Error: Scanner element not found in HTML.";
            return;
        }
        
        const cameraSelect = document.getElementById('cameraSelect');
        selectedDeviceId = cameraSelect.value;
        if (selectedDeviceId) {
            html5QrCode = new Html5Qrcode("reader");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            
            html5QrCode.start(selectedDeviceId, config, onScanSuccess, onScanError)
                .then(() => {
                    document.getElementById('startButton').style.display = 'none';
                    document.getElementById('result').textContent = 'Waiting for QR Code...';
                    const successSound = document.getElementById('successSound');
                    if (successSound) {
                         successSound.play();
                    }
                })
                .catch(error => {
                    console.error("Failed to start scanner:", error);
                    document.getElementById('result').textContent = "Error: Camera access denied or not available. Please check permissions.";
                });
        } else {
            document.getElementById('result').textContent = "Error: No camera selected.";
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        document.getElementById('result').textContent = "Unexpected error. Please try again later.";
    }
}

async function populateCameraDropdown() {
    try {
        const cameras = await Html5Qrcode.getCameras();
        const cameraSelect = document.getElementById('cameraSelect');
        if (cameras && cameras.length) {
            cameras.forEach(camera => {
                const option = document.createElement('option');
                option.value = camera.id;
                option.text = camera.label || `Camera ${cameraSelect.length + 1}`;
                cameraSelect.appendChild(option);
            });
            const rearCamera = cameras.find(camera => camera.label.toLowerCase().includes('back') || camera.label.toLowerCase().includes('environment'));
            if (rearCamera) {
                cameraSelect.value = rearCamera.id;
            }
        } else {
            document.getElementById('result').textContent = "Error: No cameras found on this device.";
            document.getElementById('cameraSelect').style.display = 'none';
        }
    } catch (error) {
        console.error("Error getting camera devices:", error);
        document.getElementById('result').textContent = "Error getting camera devices. Please check permissions.";
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-button').addEventListener('click', handleLogin);
    document.getElementById('password-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
    document.getElementById('startButton').addEventListener('click', startScanner);
});