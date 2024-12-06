var searchBut = document.getElementById("locButton")
const ctx = document.getElementById("tempchart")

searchBut.onclick = function() {
    var search = document.getElementById("locSearch").value
    var urlLoc = "http://api.openweathermap.org/geo/1.0/direct?q=" + search + "&limit=1&appid=b937975e24e00fe98e27cd1e0fb798e3"

    var xhttpLoc = new XMLHttpRequest()

    xhttpLoc.onload = function readLoc() {
        var response = JSON.parse(this.responseText)
        var locInfo = [response[0].name, response[0].country, response[0].lat, response[0].lon]
        console.log(locInfo)

        const locOut = document.getElementById("locationid")
        locOut.innerHTML = "Weather for " + locInfo[0] + ", " + locInfo[1]

        var url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + locInfo[2] + "&lon=" + locInfo[3] + "&units=metric&appid=b937975e24e00fe98e27cd1e0fb798e3"

        var xhttp = new XMLHttpRequest()

        xhttp.onload = function() {
            var weatherResponse = JSON.parse(this.responseText)
            const count = weatherResponse.cnt
            console.log(count)


            var temperatures = []
            var times = []
            for(var x = 0; x < count; x++) {
                temperatures.push(weatherResponse.list[x].main.temp)
                times.push(weatherResponse.list[x].dt_txt)
            }
            console.log(temperatures)

                var tempData =  {
                    labels: times, 
                    datasets: [{
                        label: "Temperature",
                        data: temperatures, 
                        fill: false, 
                        borderColor: "orange", 
                        tension: 0.1
                    }]
                }
        
                new Chart(ctx, {
                    type: 'line', 
                    data: tempData
                })
        }

        xhttp.open("GET", url, true)
        xhttp.send()        

    }

    xhttpLoc.open("GET", urlLoc, true)
    xhttpLoc.send()
}
