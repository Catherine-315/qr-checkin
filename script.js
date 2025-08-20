// Paste your Make.com webhook URL here
const webhookUrl = "https://hook.eu2.make.com/nskxlifx9ppncoivfp3z5yqwa2yj22cv";

let html5QrCode;

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

        if (response.ok) {
            resultElement.textContent = 'Welcome, ' + scannedId + '! Check-in successful.';
            resultElement.className = 'success-message';
        } else {
            resultElement.textContent = 'Error during check-in. Please try again.';
            resultElement.className = 'error-message';
        }
    } catch (error) {
        console.error('Network or fetch error:', error);
        document.getElementById('result').textContent = 'Network error. Please try again.';
        document.getElementById('result').className = 'error-message';
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

        // Check for cameras before starting
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
            // Found a camera, so we can initialize the scanner
            html5QrCode = new Html5Qrcode("reader");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            
            // Start the scanner and handle the promises
            html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
                .then(() => {
                    document.getElementById('startButton').style.display = 'none';
                    document.getElementById('result').textContent = 'Waiting for QR Code...';
                })
                .catch(error => {
                    console.error("Failed to start scanner:", error);
                    document.getElementById('result').textContent = "Error: Camera access denied or not available. Please check permissions.";
                });
        } else {
            document.getElementById('result').textContent = "Error: No camera found on this device.";
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        document.getElementById('result').textContent = "Unexpected error. Please try again later.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', startScanner);
    }
});