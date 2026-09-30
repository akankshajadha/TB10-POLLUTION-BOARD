function startLiveClock() {
    function update() {
        const now = new Date();
        
        // Date formatting
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        
        const dateElem = document.getElementById("dateDisplay");
        if (dateElem) {
            dateElem.innerText = `${day}/${month}/${year}`;
        }

        // Time formatting
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strHours = String(hours).padStart(2, '0');

        const timeElem = document.getElementById("timeDisplay");
        if (timeElem) {
            timeElem.innerText = `${strHours}:${minutes}:${seconds} ${ampm}`;
        }
    }

    update();
    setInterval(update, 1000);
}

// Ensure execution starts as soon as script loads
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLiveClock);
} else {
    startLiveClock();
}
