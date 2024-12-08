function showFollStops() {
    console.log("click")
}

function dbToDate(datestr) {
    return datestr.substring(6,8) + ":" + datestr.substring(8,10)
}

function sortTimes(times) {
    var sorted = []
    var tempMin = []
    for(var x in times){
        if(sorted.length == 0) {
            sorted.unshift(times[x])
        }
        else{
            var sortLen = sorted.length
            for(var i = 0; i <= sortLen; i++) {
                if(sorted.length == 0) {
                    sorted.unshift(times[x])
                    break
                }
                else if(!(times[x][0] > sorted[i][0])) {
                    sorted.unshift(times[x])
                    break
                }
                else {
                    tempMin.unshift(sorted.shift())
                    i--
                }
            }
            var tempLength = tempMin.length
            for(var i = 0; i < tempLength; i++) {
                sorted.unshift(tempMin.shift())
            }
        }
    }
    return sorted
}

function stoparray(stops) {
    var array = stops.split("|")
    return array
}

function lastElement(array) {
    return
}

function createIsland(item, sName) {
    var code = ""
    var tripLabel = item.tl[0].$
    var ArDepInd = 0       /*0=ar&dep; 1=ar; 2=dep*/
    var arrival, departure
    var prevStops = []
    var follStops = []
    var plattform = "error"
    try {
        arrival = item.ar[0].$
        prevStops = stoparray(arrival.ppth)
        plattform = arrival.pp
    }
    catch (e){
        ArDepInd = 2
    }
    try {
        departure = item.dp[0].$
        follStops = stoparray(departure.ppth)
        plattform = departure.pp
    }
    catch (e){
        ArDepInd = 1
    }

    code += "<div class='trainIsland'>"
    code += "<div class='" + tripLabel.c + "'>"
    switch(ArDepInd) {
        case 0: {
            code += "<h4 class='trainName'>" + tripLabel.c + " " + tripLabel.n + " to " + follStops[follStops.length-1] + "</h4>"
            code += "<p>Platform " + plattform + "</p>"
            code += "<p>Arrival: " + dbToDate(arrival.pt) + " from " + prevStops[prevStops.length-1] + "</p>"
            code += "<p>Departure: " + dbToDate(departure.pt) + " to " + follStops[0] + "</p>"
            code += "<p class='FollowStopsButton'>Following stops</p>"
            code += "<div class='followStopsClass'>"
            for(var i in follStops) {
                code += "<p>" + follStops[i] + "</p>"
            }
            code += "</div>"
            break
        }
        case 1: {
            code += "<h4 class='trainName'>" + tripLabel.c + " " + tripLabel.n + " to " + sName + "</h4>"
            code += "<p>Platform " + plattform + "</p>"
            code += "<p>Arrival: " + dbToDate(arrival.pt) + " from " + prevStops[prevStops.length-1] + "</p>"
            code += "<p>Train ending at " + sName + ".</p>"
            break
        }
        case 2: {
            code += "<h4 class='trainName'>" + tripLabel.c + " " + tripLabel.n + " to " + follStops[follStops.length-1] + "</h4>"
            code += "<p>Platform " + plattform + "</p>"
            code += "<p>Train starting at " + sName + ".</p>"
            code += "<p>Departure: " + dbToDate(departure.pt) + " to " + follStops[0] + "</p>"
            code += "<p class='FollowStopsButton'>Following stops</p>"
            code += "<div class='followStopsClass'>"
            for(var i in follStops) {
                code += "<p>" + follStops[i] + "</p>"
            }
            code += "</div>"
            break
            break
        }
        default: break
    }

    code += "</div></div>"
    return code
}

const response = fetch("../db-timetable?evaNo=8000096&date=241208&hour=13")
    .then(result => result.json())
    .then(data => {
        data = data.timetable
        console.log(data.s)
        const traindiv = document.getElementById("trainsid")
        const stationName = data.$.station

        var times = []
        for(var i in data.s) {
            try {
                times.push([parseInt(data.s[i].ar[0].$.pt.substring(8,10)), parseInt(i)])
            }
            catch {
                times.push([parseInt(data.s[i].dp[0].$.pt.substring(8,10)), parseInt(i)])
            }
        }

        var sorted = sortTimes(times)
        console.log(sorted)
        for(var i in sorted) {
            traindiv.innerHTML += createIsland(data.s[sorted[i][1]], stationName)
        }
    })
