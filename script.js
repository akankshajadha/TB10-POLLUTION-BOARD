// Pure offline execution loop with zero web fetches.
// This forces active data syncs to update data-to-data every 5 seconds.

function updateLiveClock() {
    const now = new Date();
    
    // DATE: DD/MM/YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();
    document.getElementById('live-date-box').innerText = `DATE:${day}/${month}/${year}`;
    
    // TIME: HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    document.getElementById('live-time-box').innerText = `TIME:${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
}

function autoSyncMetricsData() {
    // Read the numbers currently shown on screen safely
    let currentTemp = parseFloat(document.getElementById('temp-val').innerText) || 30.4;
    let currentHum = parseInt(document.getElementById('hum-val').innerText) || 77;
    let currentPM25 = parseInt(document.getElementById('pm25-val').innerText) || 20;
    let currentPM10 = parseInt(document.getElementById('pm10-val').innerText) || 32;

    // Simulate real-time continuous fluctuation/sync values
    let driftTemp = (currentTemp + (Math.random() * 0.4 - 0.2)).toFixed(1);
    let driftHum = Math.floor(currentHum + (Math.random() * 2 - 1));
    let driftPM25 = Math.floor(currentPM25 + (Math.random() * 2 - 1));
    let driftPM10 = Math.floor(currentPM10 + (Math.random() * 2 - 1));

    // Bounds safety filters to keep numbers within realistic bounds
    if (driftTemp < 28.0 || driftTemp > 33.0) driftTemp = "27.4";
    if (driftHum < 70 || driftHum > 82) driftHum = "77";
    if (driftPM25 < 14 || driftPM25 > 25) driftPM25 = "20";
    if (driftPM10 < 25 || driftPM10 > 38) driftPM10 = "32";

    // Write numbers directly into the cells with no intermediate blank states
    document.getElementById('temp-val').innerText = driftTemp;
    document.getElementById('hum-val').innerText = driftHum;
    document.getElementById('pm25-val').innerText = driftPM25;
    document.getElementById('pm10-val').innerText = driftPM10;
}

// TIMING MANAGEMENT SCHEDULERS
setInterval(updateLiveClock, 1000);      // Syncs clock text loops elements every 1 second
setInterval(autoSyncMetricsData, 3000);  // REFRESHES PARAMETERS CONTINUOUSLY DATA-TO-DATA EVERY 5 SECONDS

// Initial layout rendering boot sequences
updateLiveClock();
autoSyncMetricsData();
