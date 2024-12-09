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
        }
        default: break
    }

    code += "</div></div>"
    return code
}

async function getTimetable(evaNo, datestr) {
    fetch("../db-timetable?evaNo=" + evaNo + "&date=" + datestr[0] + "&hour=" + datestr[1])
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
            traindiv.innerHTML = ""
            for(var i in sorted) {
                traindiv.innerHTML += createIsland(data.s[sorted[i][1]], stationName)
            }


        })
}

/*Search for Station*/
var header = {
    "DB-Client-Id": "6b0179d0470222752b7c6e8be113403b",
    "DB-Api-Key": "24f026e231c0136bd94e44dc0d8c5769", 
    "accept": "application/json"

}
async function getStations(string) {
    var url = "https://apis.deutschebahn.com/db-api-marketplace/apis/station-data/v2/stations?limit=10&searchstring=*" + string + "*"
    const response = await fetch(url, {
        method: "GET",
        headers: header
    })
    return await response.json()
}

const searchBar = document.getElementById("stationInput")
const stationSelect = document.getElementById("stationSelect")
var stationList = []
searchBar.onkeyup = function() {
    getStations(this.value).then(data => {
        stationList = data.result
        if(data.result.length == 1) {
            stationSelect.innerHTML = "<option value=0>" + data.result[0].name + "</option>"
        }
        else {
            stationSelect.innerHTML = "<option value=error>--Please select station--</option>"
            sortStations(data.result, stationSelect)
        }
    })

}

function sortStations(list, htmlElem) {
    var index
    var toGo = []
    for(var x in list) {
        toGo.push(x)
    }
    while(toGo.length > 0) {
        index = toGo[0]
        for(var i in toGo) {
            if(list[toGo[i]].name.length < list[index].name.length) {
                index = toGo[i]
            }
        }

        htmlElem.innerHTML += "<option value=" + index + ">" + list[index].name + "</option>"
        for(var i in toGo) {
            if(toGo[i] == index) {
                toGo.splice(i, 1)
                break
            }
        }
    }
}

const sButton = document.getElementById("searchbutton")
const datetime = document.getElementById("datetime")
sButton.onclick = function() {
    var datetimeStr = datetime.value.split("T")
    datetimeStr[0] = datetimeStr[0].replace(/-/g, "").substring(2)
    datetimeStr[1] = datetimeStr[1].replace(":", "").substring(0, 2)

    getChanges(stationList[stationSelect.value].evaNumbers[0].number)
    getTimetable(stationList[stationSelect.value].evaNumbers[0].number, datetimeStr)
}


/*Changes*/
async function getChanges(evaNo) {
    fetch("../db-changes?evaNo=" + evaNo)
        .then(result => result.json())
        .then(data => {
            data = data.timetable.s
        })
}

