// Configuration: Replace with your actual local sensor API endpoint if available
const SENSOR_API_URL = 'http://localhost:5000/api/sensors'; 

// 1. CLOCK LOGIC: Updates Date & Time every second
function updateClock() {
    const now = new Date();

    // Format Date: DD/MM/YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('live-date').innerText = `DATE: ${day}/${month}/${year}`;

    // Format Time: HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const strHours = String(hours).padStart(2, '0');

    document.getElementById('live-time').innerText = `TIME: ${strHours}:${minutes}:${seconds} ${ampm}`;
}

// 2. LIVE PARAMETER FETCH LOGIC
async function fetchSensorData() {
    try {
        // Remove the comment lines below when deploying to a live API server:
        // const response = await fetch(SENSOR_API_URL);
        // const data = await response.json();
        
        // --- SIMULATED REAL-TIME DATA FOR TESTING (Matches your image values) ---
        const data = {
            temperature: (30.0 + Math.random() * 1.2).toFixed(1), // e.g. 30.6
            humidity: Math.floor(75 + Math.random() * 4),         // e.g. 77
            pm25: Math.floor(18 + Math.random() * 5),             // e.g. 20
            pm10: Math.floor(28 + Math.random() * 5)              // e.g. 30
        };
        // -----------------------------------------------------------------------

        // Push data values directly to the DOM elements
        document.getElementById('val-temp').innerText = data.temperature;
        document.getElementById('val-humid').innerText = data.humidity;
        document.getElementById('val-pm25').innerText = data.pm25;
        document.getElementById('val-pm10').innerText = data.pm10;

    } catch (error) {
        console.error("Failed to load environment parameters from sensor:", error);
        // Fallback display if connections fail so screen doesn't break
        document.getElementById('val-temp').innerText = "ERR";
    }
}

// 3. INITIALIZE RUNNERS
// Run time-sync every second
setInterval(updateClock, 1000);
updateClock();

// Run environmental data pull every 5 seconds (Avoid overloading sensor microcontrollers)
setInterval(fetchSensorData, 5000);
fetchSensorData();
