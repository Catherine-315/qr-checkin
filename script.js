const webhookUrl = "https://hook.eu2.make.com/nskxlifx9ppncoivfp3z5yqwa2yj22cv";
function onScanSuccess(decodedText) {
    console.log(`Scan result: ${decodedText}`);
   document.getElementById('result').textContent = 'Welcome, ' + decodedText + '! Check-in successful.';
    sendDataToMake(decodedText);
}
async function sendDataToMake(scannedId) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({ id: scannedId }),
            headers: { 'Content-Type': 'application/json' },
        });

        const resultElement = document.getElementById('result');
        const successSound = document.getElementById('successSound'); // Get the audio element

        if (response.ok) {
            resultElement.textContent = 'Welcome, ' + scannedId + '! Check-in successful.';
            resultElement.className = 'success-message';
            successSound.play(); // Play the sound
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
function initializeScanner() {
    const qrboxElement = document.getElementById('reader');
    if (qrboxElement) {
        const html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError);
    } else { console.error("HTML element with id 'reader' not found."); }
}

function startScanning() {
    const qrboxElement = document.getElementById('reader');
    if (qrboxElement) {
        const html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        // This is the line that actually starts the camera
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
            .then(() => {
                console.log("Scanner started successfully.");
                // Optionally hide the button after starting
                document.getElementById('startButton').style.display = 'none';
                document.getElementById('result').textContent = 'Waiting for QR Code...';
            })
            .catch((err) => {
                console.error("Failed to start scanner:", err);
                document.getElementById('result').textContent = 'Error starting scanner. Please check camera permissions.';
            });
    } else {
        console.error("HTML element with id 'reader' not found.");
    }
}

// Add an event listener to the button
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', startScanning);
    }
});
document.addEventListener('DOMContentLoaded', initializeScanner);