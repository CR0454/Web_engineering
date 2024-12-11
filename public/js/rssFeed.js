const tsfeed = document.getElementById("tsfeedid")
const tsBanner = document.getElementById("tsBanner")
tsBanner.onclick = function() {
    if(tsfeed.checkVisibility()) {
        tsfeed.style.display = "none"
    } else {
        tsfeed.style.display = "grid"
    }
}

const nytfeed = document.getElementById("nytfeedid")
const nytBanner = document.getElementById("nytBanner")
nytBanner.onclick = function() {
    if(nytfeed.checkVisibility()) {
        nytfeed.style.display = "none"
    } else {
        nytfeed.style.display = "grid"
    }
}

function tscomposeArticle(item, itemNr) {
    var code = "<div class='feedElement' id='element" + itemNr + "'>"
    code += "<p class='publishDate'>" + item.getElementsByTagName("pubDate")[0].textContent + "</p>"
    code += "<h3>" + item.getElementsByTagName("title")[0].textContent + "</h3>"
    var img = item.getElementsByTagName("content:encoded")[0].textContent.match(/<img[^>]*src="([^"]+)"/)
    code += "<img src='" + img[1] + "' class='feedImage'>"
    code += "<p class='paragraph'>" + item.getElementsByTagName("description")[0].textContent + "</p>"
    code += "<a class='readmore' href='" + item.getElementsByTagName("link")[0].textContent + "'>Read more</a>"
    code += "</div>"

    return code
}

function nytcomposeArticle(item, itemNr) {
    var code = "<div class='feedElement' id='element" + itemNr + "'>"
    code += "<p class='publishDate'>" + item.getElementsByTagName("pubDate")[0].textContent + "</p>"
    code += "<h3>" + item.getElementsByTagName("title")[0].textContent + "</h3>"
    var img = item.getElementsByTagName("media:content")[0].getAttribute("url")
    code += "<img src='" + img + "' class='feedImage'>"
    code += "<p class='paragraph'>" + item.getElementsByTagName("description")[0].textContent + "</p>"
    code += "<a class='readmore' href='" + item.getElementsByTagName("link")[0].textContent + "'>Read more</a>"
    code += "</div>"

    return code
}

var tsxhttp = new XMLHttpRequest()
tsxhttp.onload = function() {
    var xmlDoc = this.responseXML
    var feedCode = ""
    
    for(var x = 0; x < 10; x++) {
       try {
        var item = xmlDoc.getElementsByTagName("item")[x]
        feedCode += tscomposeArticle(item, x)
       }
       catch (e){
        console.log(e)
       }
    }

    tsfeed.innerHTML = feedCode
}
var tsurl = "https://www.tagesschau.de/index~rss2.xml"

tsxhttp.open("GET", tsurl, true)
tsxhttp.send()



var nytxhttp = new XMLHttpRequest()
nytxhttp.onload = function() {
    var xmlDoc = this.responseXML
    var feedCode = ""
    
    for(var x = 0; x < 10; x++) {
       try {
        var item = xmlDoc.getElementsByTagName("item")[x]
        feedCode += nytcomposeArticle(item, x)
       }
       catch (e){
        console.log(e)
       }
    }

    nytfeed.innerHTML = feedCode
}
var nyturl = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"

nytxhttp.open("GET", nyturl, true)
nytxhttp.send()