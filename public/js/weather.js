var searchBut = document.getElementById("locButton")
const forecastDiv = document.getElementById("forecastDiv")
const genweatherDiv = document.getElementById("genweatherDiv")

const weekday = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"]

function getTimepoint(time) {
    var date = new Date(time)
    return weekday[date.getDay()] + ", " + date.getHours() + " Uhr"
}

function weatherIsland(weather, temp, time, icon) {
    var fullDiv = "<div class='weatIslandClass' style='padding:10px;text-align:center;'>"
    fullDiv += "<h4>" + getTimepoint(time) + "</h4>"
    fullDiv += "<img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'>"
    fullDiv += "<p>" + weather + "</p>"
    fullDiv += "<p>" + Math.round(temp*10)/10 + " &degC</p>"

    fullDiv += "</div>"
    return fullDiv
}

function genWeather(temperatures) {
    console.log(temperatures)
    var code = ""
    code += "<p>Max. Temp. (24h): " + Math.round(Math.max(...temperatures)*10)/10 + " &degC</p>"
    code += "<p>Min. Temp. (24h): " + Math.round(Math.min(...temperatures)*10)/10 + " &degC</p>"
    return code
}


searchBut.onclick = function() {
    var search = document.getElementById("locSearch").value
    var urlLoc = "http://api.openweathermap.org/geo/1.0/direct?q=" + search + "&limit=1&appid=b937975e24e00fe98e27cd1e0fb798e3"

    var xhttpLoc = new XMLHttpRequest()

    xhttpLoc.onload = function readLoc() {
        var response = JSON.parse(this.responseText)
        var locInfo = [response[0].name, response[0].country, response[0].lat, response[0].lon]
        console.log(locInfo)

        const locOut = document.getElementById("locationid")
        locOut.innerHTML = "<h3 style='padding:10px'>Weather for " + locInfo[0] + ", " + locInfo[1] + "</h3>"

        var url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + locInfo[2] + "&lon=" + locInfo[3] + "&units=metric&appid=b937975e24e00fe98e27cd1e0fb798e3"

        var xhttp = new XMLHttpRequest()

        xhttp.onload = function() {
            var weatherResponse = JSON.parse(this.responseText)
            const count = weatherResponse.cnt
            console.log(count)


            var temperatures = []
            var times = []
            var weather = []
            var icons = []
            for(var x = 0; x < count; x++) {
                temperatures.push(weatherResponse.list[x].main.temp)
                times.push(weatherResponse.list[x].dt_txt)
                weather.push(weatherResponse.list[x].weather[0].description)
                icons.push(weatherResponse.list[x].weather[0].icon)
            }
            console.log(temperatures)
            console.log(weather)

            var fullCode = ""
            var temp24 = []
            for(var x = 0; x < 8; x++) {
                fullCode += weatherIsland(weather[x], temperatures[x], times[x], icons[x])
                temp24.push(temperatures[x])
            }



            forecastDiv.innerHTML = fullCode
            genweatherDiv.innerHTML = genWeather(temp24)


    }

        xhttp.open("GET", url, true)
        xhttp.send()        

    }

    xhttpLoc.open("GET", urlLoc, true)
    xhttpLoc.send()
}
