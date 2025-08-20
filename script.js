// This is the complete and final JavaScript file for your QR code scanner.

// Paste your Make.com webhook URL here. This is the unique URL that connects your
// web app to your Make.com scenario.
const webhookUrl = "https://hook.eu2.make.com/nskxlifx9ppncoivfp3z5yqwa2yj22cv";

// This variable will hold the HTML5-QR code scanner object.
let html5QrCode;

/**
 * Handles a successful QR code scan.
 * @param {string} decodedText - The text decoded from the QR code.
 */
function onScanSuccess(decodedText) {
    // Display the scanned text on the screen for immediate feedback.
    document.getElementById('result').textContent = `QR Code Scanned: ${decodedText}`;

    // Send the scanned data to the Make.com webhook.
    sendDataToMake(decodedText);
}

/**
 * Handles errors during the QR code scanning process.
 * @param {string} errorMessage - The error message from the scanner library.
 */
function onScanError(errorMessage) {
    // Log the error to the console for debugging purposes.
    console.error(`Scan error: ${errorMessage}`);
}

/**
 * Sends the scanned data to the Make.com webhook using a POST request.
 * @param {string} scannedId - The unique ID from the QR code.
 */
async function sendDataToMake(scannedId) {
    try {
        // Send the data as a JSON object to the Make.com webhook.
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({ id: scannedId }),
            headers: { 'Content-Type': 'application/json' },
        });

        const resultElement = document.getElementById('result');
        const successSound = document.getElementById('successSound');

        // Check if the response from Make.com was successful (HTTP status code 200-299).
        if (response.ok) {
            // Display a success message and play the sound.
            resultElement.textContent = 'Welcome, ' + scannedId + '! Check-in successful.';
            resultElement.className = 'success-message';
            successSound.play();
        } else {
            // If the response was not okay, display an error message.
            resultElement.textContent = 'Error during check-in. Please try again.';
            resultElement.className = 'error-message';
        }
    } catch (error) {
        // Catch any network-level errors (e.g., no internet connection).
        console.error('Network or fetch error:', error);
        document.getElementById('result').textContent = 'Network error. Please try again.';
        document.getElementById('result').className = 'error-message';
    } finally {
        // Reset the message after a delay, regardless of success or failure.
        setTimeout(() => {
            document.getElementById('result').textContent = 'Waiting for QR Code...';
            document.getElementById('result').className = '';
        }, 5000); // The message will last for 5 seconds.
    }
}

/**
 * Initializes the QR code scanner when the "Start Scanner" button is clicked.
 */
async function startScanner() {
    try {
        const qrboxElement = document.getElementById('reader');
        if (!qrboxElement) {
            document.getElementById('result').textContent = "Error: Scanner element not found in HTML.";
            return;
        }

        // Check if cameras are available on the device.
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
            // Initialize the scanner object.
            html5QrCode = new Html5Qrcode("reader");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            // Start the camera and begin scanning.
            html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
                .then(() => {
                    // Hide the start button after the scanner has successfully started.
                    document.getElementById('startButton').style.display = 'none';
                    document.getElementById('result').textContent = 'Waiting for QR Code...';
                    // Play a sound to confirm the scanner has started, fulfilling browser audio policies.
                    const successSound = document.getElementById('successSound');
                    if (successSound) {
                         successSound.play();
                    }
                })
                .catch(error => {
                    // Handle errors that occur while starting the scanner.
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

// Add an event listener to the "Start Scanner" button to trigger the startScanner function.
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', startScanner);
    }
});