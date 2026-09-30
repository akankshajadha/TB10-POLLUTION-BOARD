         var activeLat = "19.45";
        var activeLon = "72.81";

        function classicPadZero(num) {
            return num < 10 ? '0' + num:'' + num;
        }

        function updateLiveClock() {
            var now = new Date();
            var day = classicPadZero(now.getDate());
            var month = classicPadZero(now.getMonth() + 1); 
            var year = now.getFullYear();
            
            var hours = now.getHours();
            var minutes = classicPadZero(now.getMinutes());
            var seconds = classicPadZero(now.getSeconds());
            var ampm = hours >=12 ?'PM':'AM';
            
            hours = hours % 12;
            hours = hours ? hours : 12; 
            var formattedHours = classicPadZero(hours);
            
            var timeString = formattedHours +':'+minutes+':'+seconds+' '+ ampm;
            
            var dateEl = document.getElementById("dateDisplay");
            var timeEl = document.getElementById("timeDisplay");
            
            if (dateEl) dateEl.innerText =day+'/'+month +'/'+year;
            if (timeEl) timeEl.innerText =timeString;
        }

        function fetchLiveBackendData() {
            var weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + activeLat + "&longitude=" + activeLon + "&current=temperature_2m,relative_humidity_2m";
            var airQualityUrl = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + activeLat + "&longitude=" + activeLon + "&current=pm10,pm2_5";

            fetch(weatherUrl)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data && data.current) {
                        document.getElementById("tempDisplay").innerText = parseFloat(data.current.temperature_2m).toFixed(1);
                        document.getElementById("humDisplay").innerText = Math.round(data.current.relative_humidity_2m);
                    }
                })
                .catch(function(e) { console.error("Weather Fetch Error", e); });

            fetch(airQualityUrl)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data && data.current) {
                        document.getElementById("pm25Display").innerText = Math.round(data.current.pm2_5);
                        document.getElementById("pm10Display").innerText = Math.round(data.current.pm10);
                    }
                })
                .catch(function(e) { console.error("Air Quality Fetch Error", e); });
        }

        // Run clock right away on load
        window.onload = function() {
            updateLiveClock();
            setInterval(updateLiveClock, 1000);

            fetchLiveBackendData();
            setInterval(fetchLiveBackendData, 3000);
        };
   
