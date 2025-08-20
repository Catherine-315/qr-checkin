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
document.addEventListener('DOMContentLoaded', initializeScanner);