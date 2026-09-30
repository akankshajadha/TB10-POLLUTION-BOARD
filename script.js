// Default sample dataset used if Wi-Fi drops or API fails
const FALLBACK_DATA = {
    temp: "29.2",
    humidity: "77",
    pm25: "20",
    pm10: "30"
};

// Update Date & Time in real-time
function updateClock() {
    const now = new Date();
    
    // Format Date: DD/MM/YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById("dateDisplay").innerText = `${day}/${month}/${year}`;

    // Format Time: HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    const strHours = String(hours).padStart(2, '0');

    document.getElementById("timeDisplay").innerText = `${strHours}:${minutes}:${seconds} ${ampm}`;
}

// Render values into DOM
function renderTelemetry(temp, hum, pm25, pm10) {
    document.getElementById("tempDisplay").innerText = temp;
    document.getElementById("humDisplay").innerText = hum;
    document.getElementById("pm25Display").innerText = pm25;
    document.getElementById("pm10Display").innerText = pm10;
}

// Fetch live weather data from Open-Meteo API
async function fetchLiveTelemetry() {
    if (!navigator.onLine) {
        console.warn("TB10 Offline: Using cached/fallback data.");
        renderTelemetry(FALLBACK_DATA.temp, FALLBACK_DATA.humidity, FALLBACK_DATA.pm25, FALLBACK_DATA.pm10);
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        // Replace coordinates below with your target location if needed
        const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=19.45&longitude=72.82&current_weather=true',
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Network issue");

        const data = await response.json();
        
        const liveTemp = data.current_weather.temperature ? data.current_weather.temperature.toFixed(1) : FALLBACK_DATA.temp;
        const liveHum = data.current_weather.relativehumidity || FALLBACK_DATA.humidity;

        renderTelemetry(liveTemp, liveHum, FALLBACK_DATA.pm25, FALLBACK_DATA.pm10);

    } catch (err) {
        console.warn("API failure/timeout on TB10. Loading default parameters:", err);
        renderTelemetry(FALLBACK_DATA.temp, FALLBACK_DATA.humidity, FALLBACK_DATA.pm25, FALLBACK_DATA.pm10);
    }
}

// Initialization and Timers
document.addEventListener("DOMContentLoaded", () => {
    // Clock runs every 1 second
    updateClock();
    setInterval(updateClock, 1000);

    // Initial Live Data Fetch & Refresh every 30 seconds
    fetchLiveTelemetry();
    setInterval(fetchLiveTelemetry, 30000);
});

// Immediately switch data when connection changes
window.addEventListener("offline", () => {
    renderTelemetry(FALLBACK_DATA.temp, FALLBACK_DATA.humidity, FALLBACK_DATA.pm25, FALLBACK_DATA.pm10);
});
window.addEventListener("online", fetchLiveTelemetry);