// Configuration: Replace with your actual local sensor API endpoint if available
const SENSOR_API_URL = 'http://localhost:5000/api/sensors'; 

// 1. CLOCK LOGIC: Updates Date & Time every second
function updateClock() {
    const now = new Date();

    // Format Date: DD/MM/YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const liveDateEl = document.getElementById('live-date');
    if (liveDateEl) {
        liveDateEl.innerText = `DATE: ${day}/${month}/${year}`;
    }

    // Format Time: HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
   
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const strHours = String(hours).padStart(2, '0');

    const liveTimeEl = document.getElementById('live-time');
    if (liveTimeEl) {
        liveTimeEl.innerText = `TIME: ${strHours}:${minutes}:${seconds} ${ampm}`;
    }
}

// 2. LIVE PARAMETER FETCH LOGIC
async function fetchSensorData() {
    try {
        // --- LIVE API FETCH ---
        // Uncomment the two lines below when connecting to your live hardware:
        // const response = await fetch(SENSOR_API_URL);
        // const data = await response.json();
        
        // --- SIMULATED REAL-TIME DATA FOR TESTING ---
        const data = {
            temperature: (30.0 + Math.random() * 1.2).toFixed(1),
            humidity: Math.floor(75 + Math.random() * 4),         
            pm25: Math.floor(18 + Math.random() * 5),             
            pm10: Math.floor(28 + Math.random() * 5)              
        };

        // Update elements only if they exist on the page
        if (document.getElementById('val-temp')) document.getElementById('val-temp').innerText = data.temperature;
        if (document.getElementById('val-humid')) document.getElementById('val-humid').innerText = data.humidity;
        if (document.getElementById('val-pm25')) document.getElementById('val-pm25').innerText = data.pm25;
        if (document.getElementById('val-pm10')) document.getElementById('val-pm10').innerText = data.pm10;

    } catch (error) {
        console.error("Failed to load environment parameters from sensor:", error);
        
        // Error fallback text
        if (document.getElementById('val-temp')) document.getElementById('val-temp').innerText = "ERR";
        if (document.getElementById('val-humid')) document.getElementById('val-humid').innerText = "ERR";
        if (document.getElementById('val-pm25')) document.getElementById('val-pm25').innerText = "ERR";
        if (document.getElementById('val-pm10')) document.getElementById('val-pm10').innerText = "ERR";
    }
}

// 3. INITIALIZE RUNNERS SAFELY AFTER THE DOM LOADS
window.addEventListener('DOMContentLoaded', () => {
    // Run time-sync every second
    updateClock();
    setInterval(updateClock, 1000);

    // Run environmental data pull every 5 seconds
    fetchSensorData();
    setInterval(fetchSensorData, 5000);
});
