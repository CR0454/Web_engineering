document.getElementById("searchbutton").onclick = function() {wikiquery()};


function wikiquery() {

    var query = document.getElementById("wikisearch")

    var xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
        var out = document.getElementById("wikiout")

        var response = JSON.parse(this.responseText)

        var pages = response.response.query.pages
        console.log("Data ", pages)

        var output = "<table id=wikiouttable><tr>"
        for(var page in pages) {
            output += "<td>" + pages[page].title + "</td>"
            output += "<td>" + pages[page].description + "</td>"
            output += "<td>" + pages[page].extract + "</td>"
            output += "</tr>"
        }
        output += "</table>"

        out.innerHTML = output
    }

    var url = "http://localhost:6001/proxy/?url=https://de.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpslimit=4&format=json&prop=extracts%7Cdescription&exintro=1&explaintext=1&exsentences=3&gpssearch=" + query.value

    xhttp.open("GET", url, true)

    xhttp.send()
}