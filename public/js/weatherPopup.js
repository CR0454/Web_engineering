var button = document.getElementById("wetterbutton")
var openSig = document.getElementById("createSig")



button.onclick = function() {
    console.log("open weather")
    window.open("/html/weather.html", "PopupWindow")
}

openSig.onclick = function() {
    console.log("open signature")
    window.open("/html/signature.html", "PopupWindow", "width=400,height=250")
}