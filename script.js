// Paste your Google Apps Script URL here
const scriptUrl = "https://script.google.com/macros/s/AKfycbyoFqv8SyBXJl2PxO3EPKVAkz1tBkpAJN2baKcCMxqNN304CT4WpyVXl5cRG43D94y-/execE";

/**
 * Handles the successful scan of a QR code.
 * @param {string} decodedText - The data decoded from the QR code.
 */
function onScanSuccess(decodedText) {
    console.log(`Scan result: ${decodedText}`);
    document.getElementById('result').textContent = `QR Code Scanned: ${decodedText}`;

    sendDataToGoogleSheet(decodedText);
}

/**
 * Handles errors during QR code scanning.
 * @param {string} errorMessage - The error message from the scanner.
 */
function onScanError(errorMessage) {
    console.error(`Scan error: ${errorMessage}`);
}

/**
 * Sends the scanned data to the Google Apps Script.
 * @param {string} scannedId - The unique ID from the QR code.
 */
async function sendDataToGoogleSheet(scannedId) {
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify({ id: scannedId }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Data sent to Google Sheet successfully');
            document.getElementById('result').textContent = 'Check-in successful! Waiting for next scan...';
        } else {
            const errorText = await response.text();
            console.error('Server responded with an error:', response.status, errorText);
            document.getElementById('result').textContent = 'Error during check-in. Please try again.';
        }
    } catch (error) {
        console.error('Network or fetch error:', error);
        document.getElementById('result').textContent = 'Network error. Please try again.';
    } finally {
        setTimeout(() => {
            document.getElementById('result').textContent = 'Waiting for QR Code...';
        }, 3000);
    }
}

/**
 * Initializes the QR code scanner.
 */
function initializeScanner() {
    // We check if the 'reader' element exists before initializing
    const qrboxElement = document.getElementById('reader');
    if (qrboxElement) {
        const html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        // Request the user's environment-facing camera
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError);
    } else {
        console.error("HTML element with id 'reader' not found. Cannot initialize scanner.");
    }
}

// Add an event listener to ensure the scanner is initialized only after the page is fully loaded.
document.addEventListener('DOMContentLoaded', initializeScanner);