{\rtf1\ansi\ansicpg950\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset136 PingFangHK-Regular;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Paste your Google Apps Script URL here\
const scriptUrl = "
\f1\fs22 \cf2 https://script.google.com/macros/s/AKfycbwPnT_MF9N5yMvsla3IbuN_nHycBTBU5J_hS1M68ii3wpWoRDiJ-ozf7fdkSdDXxbny/exec
\f0\fs24 \cf0 ";\
\
function onScanSuccess(decodedText, decodedResult) \{\
    console.log(`Scan result: $\{decodedText\}`);\
    document.getElementById('result').textContent = `QR Code Scanned: $\{decodedText\}`;\
\
    // Send the scanned data to Google Apps Script\
    sendDataToGoogleSheet(decodedText);\
\}\
\
function onScanError(errorMessage) \{\
    console.error(`Scan error: $\{errorMessage\}`);\
\}\
\
function sendDataToGoogleSheet(scannedId) \{\
    fetch(scriptUrl, \{\
        method: 'POST',\
        mode: 'no-cors', // Use 'no-cors' if you encounter CORS issues, otherwise 'cors'\
        body: JSON.stringify(\{ id: scannedId \})\
    \})\
    .then(response => \{\
        // Since we are using no-cors, we can't check for response.ok\
        console.log('Data sent to Google Sheet successfully');\
        document.getElementById('result').textContent = 'Check-in successful! Waiting for next scan...';\
        \
        setTimeout(() => \{\
            document.getElementById('result').textContent = 'Waiting for QR Code...';\
        \}, 3000);\
    \})\
    .catch((error) => \{\
        console.error('Network error:', error);\
        document.getElementById('result').textContent = 'Network error. Please try again.';\
    \});\
\}\
\
const html5QrCode = new Html5Qrcode("reader");\
const config = \{ fps: 10, qrbox: \{ width: 250, height: 250 \} \};\
html5QrCode.start(\{ facingMode: "environment" \}, config, onScanSuccess, onScanError);}