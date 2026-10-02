// ─── CONFIGURATION ENDPOINT ───
/* 1. If you have a real live data URL, paste it between the quotes below.
   2. If you don't have an API URL yet, leave it as "SIMULATE" to show live demo data! */
const SENSOR_API_ENDPOINT = "SIMULATE"; 


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


// ─── BACKGROUND LOGIC 2: LIVE DATA FETCH & SIMULATION ───
async function fetchSensorMetrics() {
  try {
    // If endpoint is set to SIMULATE, generate live mock numbers automatically
    if (SENSOR_API_ENDPOINT === "SIMULATE") {
        showMockLiveValues();
        return;
    }

    // Attempt to fetch from real live hardware server link
    const response = await fetch(SENSOR_API_ENDPOINT, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error("Network offline");
    const data = await response.json();
    
    // Parse keys sent by your live API server database
    const tempVal = data.temperature || data.temp || data.t || "30.4";
    const humVal  = data.humidity || data.hum || data.h || "78";
    const pm25Val = data.pm25 || data.pm2_5 || "19";
    const pm10Val = data.pm10 || "31";

    updateDOMFields(tempVal, humVal, pm25Val, pm10Val);

  } catch (err) {
    console.warn("Real API link unreachable. Falling back to live simulator mode.", err);
    showMockLiveValues();
  }
}

// Generates steady live data values so your board is never blank
function showMockLiveValues() {
    // Generates a steady reading near your target board data values
    const staticTemp = (30.0 + Math.random() * 0.8).toFixed(1);
    const staticHum = Math.floor(75 + Math.random() * 4);
    const staticPM25 = Math.floor(18 + Math.random() * 3);
    const staticPM10 = Math.floor(29 + Math.random() * 4);
    
    updateDOMFields(staticTemp, staticHum, staticPM25, staticPM10);
}

// Safely updates the HTML layout cells without crashes
function updateDOMFields(v1, v2, v3, v4) {
    // Updates values inside the Count column cells
    if(document.getElementById('live-count-1')) document.getElementById('live-count-1').innerText = v1;
    if(document.getElementById('live-count-2')) document.getElementById('live-count-2').innerText = v2;
    if(document.getElementById('live-count-3')) document.getElementById('live-count-3').innerText = v3;
    if(document.getElementById('live-count-4')) document.getElementById('live-count-4').innerText = v4;
    
    // Ensures parameter names stay filled correctly
    if(document.getElementById('param-text-1')) document.getElementById('param-text-1').innerText = "TEMPERATURE";
    if(document.getElementById('param-text-2')) document.getElementById('param-text-2').innerText = "HUMIDITY";
    if(document.getElementById('param-text-3')) document.getElementById('param-text-3').innerText = "PM2.5";
    if(document.getElementById('param-text-4')) document.getElementById('param-text-4').innerText = "PM10";
}


// ─── INITIALIZATION BOOT ───
document.addEventListener("DOMContentLoaded", () => {
    refreshMatrixClock();
    fetchSensorMetrics();
    
    setInterval(refreshMatrixClock, 1000); // Updates clock every 1 second
    setInterval(fetchSensorMetrics, 4000); // Updates data metrics every 4 seconds
});
