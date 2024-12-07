var button = document.getElementById("wetterbutton")



button.onclick = function openpopup() {
    console.log("open weather")
    window.open("/html/weather.html", "PopupWindow")
}