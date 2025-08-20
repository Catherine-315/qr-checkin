// Paste your Google Apps Script URL here
const scriptUrl = "https://script.google.com/macros/s/AKfycbwPnT_MF9N5yMvsla3IbuN_nHycBTBU5J_hS1M68ii3wpWoRDiJ-ozf7fdkSdDXxbny/exec";

/**
 * Handles the successful scan of a QR code.
 * @param {string} decodedText - The data decoded from the QR code.
 */
function onScanSuccess(decodedText) {
    console.log(`Scan result: ${decodedText}`);
    document.getElementById('result').textContent = `QR Code Scanned: ${decodedText}`;

    // Send the scanned data to Google Apps Script
    sendDataToGoogleSheet(decodedText);
}

/**
 * Handles errors during QR code scanning.
 * @param {string} errorMessage - The error message from the scanner.
 */
function onScanError(errorMessage) {
    // It's good practice to log errors, but we won't show them on screen to keep the UI clean
    console.error(`Scan error: ${errorMessage}`);
}

/**
 * Sends the scanned data to the Google Apps Script.
 * @param {string} scannedId - The unique ID from the QR code.
 */
async function sendDataToMake(scannedId) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({ id: scannedId }),
            headers: { 'Content-Type': 'application/json' },
        });

        const resultElement = document.getElementById('result');
        const responseData = await response.json(); // Read the JSON response from Make.com

        if (response.ok) {
            if (responseData.message === "QR code not found") {
                resultElement.textContent = 'QR code not found. Please register first.';
                resultElement.className = 'error-message';
            } else {
                resultElement.textContent = 'Welcome, ' + scannedId + '! Check-in successful.';
                resultElement.className = 'success-message';
            }
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
        }, 3000);
    }
}
// Initialize the HTML5-QR code reader
const html5QrCode = new Html5Qrcode("reader");
const config = { fps: 10, qrbox: { width: 250, height: 250 } };
html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError);