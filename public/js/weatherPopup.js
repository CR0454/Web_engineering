var button = document.getElementById("wetterbutton")
var openSig = document.getElementById("createSig")
var image = document.getElementById("sigImg")



button.onclick = function() {
    console.log("open weather")
    window.open("/html/weather.html", "PopupWindow")
}

openSig.onclick = function() {
    console.log("open signature")
    var win = window.open("/html/signature.html", "PopupWindow", "width=400,height=250")
    win.addEventListener("beforeunload", loadSig)
}

function loadSig() {
    const sigUrl = localStorage.getItem("signatureURL")
    image.src = sigUrl
}