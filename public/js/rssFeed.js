const header = document.getElementById("headerid")
header.onclick = function() {
    window.location.href = "http://localhost:6001"
}

var xhttp = new XMLHttpRequest()
xhttp.onload = function() {
    var xmlDoc = this.responseXML
    var feedCode = ""
    
    for(var x in xmlDoc.getElementsByTagName("item")) {
       try {
        var item = xmlDoc.getElementsByTagName("item")[x]
        feedCode += "<div class='feedElement' id='element" + x + "'>"
        feedCode += "<p class='publishDate'>" + item.getElementsByTagName("pubDate")[0].textContent + "</p>"
        feedCode += "<h3>" + item.getElementsByTagName("title")[0].textContent + "</h3>"
        var img = item.getElementsByTagName("content:encoded")[0].textContent.match(/<img[^>]*src="([^"]+)"/)
        feedCode += "<img src='" + img[1] + "' class='feedImage'>"
        feedCode += "<p class='paragraph'>" + item.getElementsByTagName("description")[0].textContent + "</p>"
        feedCode += "<a class='readmore' href='" + item.getElementsByTagName("link")[0].textContent + "'>Read more</a>"
        feedCode += "</div>"
       }
       catch {}
    }

    document.getElementById("feedid").innerHTML = feedCode
}

var url = "https://www.tagesschau.de/index~rss2.xml"

xhttp.open("GET", url, true)
xhttp.send()

//show more 