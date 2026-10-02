// ─── CONFIGURATION ENDPOINT ───
/* OPTION A: If your HTML file and API are running on the SAME ESP32/Raspberry Pi, 
   use a relative path like "/data" or "/api". This completely bypasses security blocks! */
const SENSOR_API_ENDPOINT = "/data"; 

/* OPTION B: If your API is on a completely different IP address, uncomment the line below 
   and replace it with your exact data link: */
// const SENSOR_API_ENDPOINT = "http://192.168.1"; 


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

// ─── BACKGROUND LOGIC 2: HARDWARE-COMPATIBLE FETCH LOOP ───
async function fetchSensorMetrics() {
  try {
    // Standard Fetch Request with hardware compatibility flags
    const response = await fetch(SENSOR_API_ENDPOINT, {
        method: 'GET',
        mode: 'cors', // Explicitly requests data sharing clearance
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error("Hardware stream connection error");
    const data = await response.json();
    
    // Multi-key parser reads whatever data names your server provides
    const tempVal = data.temperature || data.temp || data.t || "--.-";
    const humVal  = data.humidity || data.hum || data.h || "--";
    const pm25Val = data.pm25 || data.pm2_5 || "--";
    const pm10Val = data.pm10 || "--";

    updateDOMFields("TEMPERATURE", tempVal, "HUMIDITY", humVal, "PM2.5", pm25Val, "PM10", pm10Val);

  } catch (err) {
    console.error("LED screen network blocked. Check physical connections or endpoint settings:", err);
    // Do not overwrite display parameters with blanks if a temporary timeout happens
  }
}

// Helper function to update screen layout safely
function updateDOMFields(p1, v1, p2, v2, p3, v3, p4, v4) {
    if(document.getElementById('param-text-1')) document.getElementById('param-text-1').innerText = p1;
    if(document.getElementById('live-count-1')) {
        document.getElementById('live-count-1').innerText = (typeof v1 === 'number') ? v1.toFixed(1) : v1;
    }
    
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
    
    setInterval(refreshMatrixClock, 1000); // Live ticking every 1 second
    setInterval(fetchSensorMetrics, 3000); // Poll hardware data every 3 seconds
});
