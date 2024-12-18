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

function createIsland(object, sName) {
    const item = object[0]
    const changes = object[1]
    var code = ""
    var tripLabel = item.tl[0].$
    var ArDepInd = 0       /*0=ar&dep; 1=ar; 2=dep*/
    var arrival, departure
    var prevStops = []
    var follStops = []
    var plattform = "error"
    var cancelMess = "p"
    try {
        arrival = item.ar[0].$
        prevStops = stoparray(arrival.ppth)
        plattform = arrival.pp
        try {
            cancelMess = changes.ar[0].$.cs
        } catch {}
    }
    catch (e){
        ArDepInd = 2
    }
    try {
        departure = item.dp[0].$
        follStops = stoparray(departure.ppth)
        plattform = departure.pp
        try {
            cancelMess = changes.dp[0].$.cs
        } catch {}
    }
    catch (e){
        if(ArDepInd == 0) {
            ArDepInd = 1
        }
        else {
            ArDepInd = -1
        }
    }

    console.log(cancelMess)

    code += "<div class='trainIsland'>"
    code += "<div class='" + tripLabel.c + "'>"

    if(cancelMess != "c"){
        switch(ArDepInd) {
            case 0: {
                code += "<h4 class='trainName' onClick='hideInfo(this)'>" + tripLabel.c + " " + tripLabel.n + " to " + follStops[follStops.length-1] + "</h4>"
                code += "<div class='hidden'><div class='singleInfo'><p>From " + prevStops[0] + "</p></div>"
                code += corrPlattform(plattform, changes) + "</div>"
                code += corrArrival([arrival.pt, prevStops], changes)
                code += "<div class='hidden'>" + corrDeparture([departure.pt, follStops], changes)
                code += "<div class='singleInfo'><p class='FollowStopsButton'>Following stops</p>"
                code += "<div class='followStopsClass'>"
                for(var i in follStops) {
                    code += "<p>" + follStops[i] + "</p>"
                }
                code += "</div></div></div>"
                break
            }
            case 1: {
                code += "<h4 class='trainName' onClick='hideInfo(this)'>" + tripLabel.c + " " + tripLabel.n + " to " + sName + "</h4>"
                code += "<div class='hidden'><div class='singleInfo'><p>From " + prevStops[0] + "</p></div>"
                code += corrPlattform(plattform, changes) + "</div>"
                code += corrArrival([arrival.pt, prevStops], changes)
                code += "<div class='hidden'><div class='singleInfo'><p>Train ending at " + sName + "</p></div></div>"
                break
            }
            case 2: {
                code += "<h4 class='trainName' onClick='hideInfo(this)'>" + tripLabel.c + " " + tripLabel.n + " to " + follStops[follStops.length-1] + "</h4>"
                code += "<div class='hidden'>" + corrPlattform(plattform, changes)
                code += "<div class='singleInfo'><p>Train starting at " + sName + "</p></div></div>"
                code += corrDeparture([departure.pt, follStops], changes)
                code += "<div class='hidden'><div class='singleInfo'><p class='FollowStopsButton'>Following stops</p>"
                code += "<div class='followStopsClass'>"
                for(var i in follStops) {
                    code += "<p>" + follStops[i] + "</p>"
                }
                code += "</div></div></div>"
                break
            }
            default: break
        }
    }
    else {
        console.error(tripLabel.c + " " + tripLabel.n + ": cancelled")
        if(follStops[0] != undefined) {
            code += "<h4 class='trainName' style='text-decoration:line-through;color:red;'>" + tripLabel.c + " " + tripLabel.n + " to " + follStops[follStops.length-1] + "</h4>"
        }
        else {
            code += "<h4 class='trainName' style='text-decoration:line-through;color:red;'>" + tripLabel.c + " " + tripLabel.n + " to " + sName + "</h4>"
        }
        try {
            code += "<div class='singleInfo'><p style='color:grey;'>original arrival: " + dbToDate(arrival.pt) + "</p></div>"
        }
        catch (e){
            code += "<div class='singleInfo'><p style='color:grey;'>original departure: " + dbToDate(departure.pt) + "</p></div>"
        }
        code += "<div class='singleInfo'><p>Train cancelled</p></div>"
    }

    code += "</div></div>"
    return code
}

async function getTimetable(evaNo, datestr) {
    return await fetch("../db-timetable?evaNo=" + evaNo + "&date=" + datestr[0] + "&hour=" + datestr[1])
        .then(result => result.json())
        .then(data => {
            data = data.timetable

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
            return [data, sorted]

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
    datetimeStr[1] = datetimeStr[1].replace(":", "").substring(0, 2);

    (async() => {
        const changes = await getChanges(stationList[stationSelect.value].evaNumbers[0].number)
        const response = await getTimetable(stationList[stationSelect.value].evaNumbers[0].number, datetimeStr)
        console.log(changes)
        console.log(response)

        const traindiv = document.getElementById("trainsid")
        const stationName = response[0].$.station
        traindiv.innerHTML = ""
        var items = response[0].s
        var objects = []
        for(var x in items) {
            objects.push(createObject(items[x], changes))
        }
        for(var i in response[1]) {
            console.log(objects[response[1][i][1]][0].tl[0].$.n, objects[response[1][i][1]])
            traindiv.innerHTML += createIsland(objects[response[1][i][1]], stationName)
        }
    })()
}


/*Changes*/
async function getChanges(evaNo) {
    return await fetch("../db-changes?evaNo=" + evaNo)
        .then(result => result.json())
        .then(data => {
            return data.timetable.s
        })
}

function createObject(item, changes) {
    const identifier = item.$.id
    var idchanges
    for(var j in changes) {
        if(identifier == changes[j].$.id){
            idchanges = changes[j]
            changes.splice(j, 1)
        }
    }

    return [item, idchanges]
}

function corrPlattform(planned, changed) {
    var code = "<div class='singleInfo'>"
    var newPlattform = 0
    try {
        newPlattform = changed.ar[0].$.cp
        }
    catch {
        try{
            newPlattform = changed.dp[0].$.cp
        }
        catch {
        }
        
    }
    if(newPlattform) {
        code += "<div style='display:grid;grid-auto-flow:column;grid-auto-columns:max-content;'><p>Platform&nbsp</p><p style='text-decoration:line-through;color:red;'>" + planned + "</p><p>&nbsp" + newPlattform + "</p></div>"
    }
    else {
        code += "<p>Platform " + planned + "</p>"
    }

    code += "</div>"
    return code
}

function corrArrival(planned, changed) {
    var code = "<div class='singleInfo'>"
    var newArrival = planned[0]
    try {
        newArrival = changed.ar[0].$.ct
        }
    catch {}
        
    if(newArrival != planned[0] && newArrival !== undefined) {
        code += "<div class='correctionOut'><div style='display:grid;grid-auto-flow:column;grid-auto-columns:max-content;'><p>Arrival:&nbsp</p><p style='text-decoration:line-through;color:red;'>" + dbToDate(planned[0]) + "&nbsp</p><p>" + dbToDate(newArrival) + "&nbsp</p></div><p> from " + planned[1][planned[1].length-1] + "</p></div>"
    }
    else {
        code += "<p>Arrival: " + dbToDate(planned[0]) + " from " + planned[1][planned[1].length-1] + "</p>"
    }
    code += "</div>"
    return code
}

function corrDeparture(planned, changed) {
    var code = "<div class='singleInfo'>"
    var newDeparture = planned[0]
    try {
        newDeparture = changed.dp[0].$.ct
        }
    catch {}
    if(newDeparture != planned[0] && newDeparture !== undefined) {
        code += "<div class='correctionOut'><div style='display:grid;grid-auto-flow:column;grid-auto-columns:max-content;'><p>Departure:&nbsp</p><p style='text-decoration:line-through;color:red;'>" + dbToDate(planned[0]) + "&nbsp</p><p>" + dbToDate(newDeparture) + "&nbsp</p></div><p>to " + planned[1][0] + "</p></div>"
    }
    else {
        code += "<p>Departure: " + dbToDate(planned[0]) + " to " + planned[1][0] + "</p>"
    }
    code += "</div>"
    return code
}

function dbDateRange(message, trainTime){
    return message.from < trainTime < message.to
}

/*Show information*/
function hideInfo() {
    console.log("click")
}