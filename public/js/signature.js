const canvas = document.getElementById("sigId")
const context = canvas.getContext("2d")
var clearBut = document.getElementById("clear")
var saveBut = document.getElementById("save")
var closeBut = document.getElementById("close")

let isDrawing = false

function startDrawing(event) {
    isDrawing = true
    draw(event)
}

function draw(event) {
    if(!isDrawing) return;
    const x = event.clientX - canvas.offsetLeft
    const y = event.clientY - canvas.offsetTop
    context.lineTo(x, y)
    context.stroke()
}

function stopDrawing() {
    isDrawing = false
    context.beginPath()
}

function saveCanvas() {
    const dataURL = canvas.toDataURL("image/png")
    
}

canvas.addEventListener("mousedown", startDrawing)
canvas.addEventListener("mousemove", draw)
canvas.addEventListener("mouseup", stopDrawing)
canvas.addEventListener("mouseout", stopDrawing)

closeBut.onclick = function() {
     window.close()
}
clearBut.onclick = function() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}