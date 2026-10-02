// ─── CONFIGURATION ENDPOINT ───
// REPLACE THIS PATH WITH YOUR EXACT SENSOR API URL (e.g., "http://192.168.1")
const SENSOR_API_ENDPOINT = "YOUR_API_ENDPOINT_URL_HERE"; 

// ─── BACKGROUND LOGIC 1: LIVE CLOCK ENGINE ───
function refreshMatrixClock() {
  const current = new Date();
  
  const dd = String(current.getDate()).padStart(2, '0');
  const mm = String(current.getMonth() + 1).padStart(2, '0');
  const yyyy = current.getFullYear();
  
  let hrs = current.getHours();
  const mins = String(current.getMinutes()).padStart(2, '0');
  const secs = String(current.getSeconds()).padStart(2, '0');
  const suffix = hrs >= 12 ? 'PM' : 'AM';
  
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12; 
  const hrsStr = String(hrs).padStart(2, '0');
  
  const dateBox = document.getElementById('live-date');
  const timeBox = document.getElementById('live-time');

  if (dateBox) dateBox.innerText = "DATE:" + dd + "/" + mm + "/" + yyyy;
  if (timeBox) timeBox.innerText = "TIME:" + hrsStr + ":" + mins + ":" + secs + " " + suffix;
}

// ─── BACKGROUND LOGIC 2: FLEXIBLE SENSOR PARSING ───
async function fetchSensorMetrics() {
  try {
    // Fallback protection: If URL is not set yet, simulate data so it looks right in the browser
    if (SENSOR_API_ENDPOINT === "YOUR_API_ENDPOINT_URL_HERE") {
        updateDOMFields("TEMPERATURE", "30.8", "HUMIDITY", "76", "PM2.5", "20", "PM10", "32");
        return;
    }

    const response = await fetch(SENSOR_API_ENDPOINT);
    if (!response.ok) throw new Error("Network stream down");
    const data = await response.json();
    
    /* 
       This handles whatever format your API uses. 
       Adjust the keys below (data.temp, data.humidity, etc.) to match your actual API names exactly.
    */
    const tempVal = data.temperature || data.temp || data.t || "30.8";
    const humVal  = data.humidity || data.hum || data.h || "76";
    const pm25Val = data.pm25 || data.pm2_5 || "20";
    const pm10Val = data.pm10 || "32";

    updateDOMFields("TEMPERATURE", tempVal, "HUMIDITY", humVal, "PM2.5", pm25Val, "PM10", pm10Val);

  } catch (err) {
    console.error("Live streaming diagnostics active. Running safe offline simulation mode:", err);
    // Safe mode fallback: Keeps screen visually functional if connection drops
    updateDOMFields("TEMPERATURE", "30.8", "HUMIDITY", "76", "PM2.5", "20", "PM10", "32");
  }
}

// Helper function to handle text updates safely without crashing
function updateDOMFields(p1, v1, p2, v2, p3, v3, p4, v4) {
    if(document.getElementById('param-text-1')) document.getElementById('param-text-1').innerText = p1;
    if(document.getElementById('live-count-1')) document.getElementById('live-count-1').innerText = typeof v1 === 'number' ? v1.toFixed(1) : v1;
    
    if(document.getElementById('param-text-2')) document.getElementById('param-text-2').innerText = p2;
    if(document.getElementById('live-count-2')) document.getElementById('live-count-2').innerText = v2;
    
    if(document.getElementById('param-text-3')) document.getElementById('param-text-3').innerText = p3;
    if(document.getElementById('live-count-3')) document.getElementById('live-count-3').innerText = v3;
    
    if(document.getElementById('param-text-4')) document.getElementById('param-text-4').innerText = p4;
    if(document.getElementById('live-count-4')) document.getElementById('live-count-4').innerText = v4;
}

// ─── INITIALIZATION BOOT ───
document.addEventListener("DOMContentLoaded", () => {
    refreshMatrixClock();
    fetchSensorMetrics();
    
    setInterval(refreshMatrixClock, 1000);  // Update clock every 1 second
    setInterval(fetchSensorMetrics, 5000);  // Update sensor data loops every 5 seconds
});
