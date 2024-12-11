var header = document.getElementById("headerid")

var footer = document.getElementById("footerid")
function resize() {
    document.getElementById("mainid").style.paddingBottom = (footer.offsetHeight + 30) + "px"
    document.getElementById("mainid").style.paddingTop = header.offsetHeight + "px"
}
resize()

window.addEventListener("resize", resize)