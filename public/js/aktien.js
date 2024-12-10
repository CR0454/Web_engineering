const ibmBut = document.getElementById("ibmBut")
const porscheBut = document.getElementById("porscheBut")
const mercedesBut = document.getElementById("mercedesBut")

ibmBut.onclick = function() {
  console.log("click")
  getAktie("IBM")
}

porscheBut.onclick = function() {
  getAktie("DRPRF")
}

mercedesBut.onclick = function() {
  getAktie("MBGAF")
}

var data


function getAktie(name) {
  var xhttp = new XMLHttpRequest();

  var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + name + "&apikey=YY51ZYK7TQUK57HU";

  xhttp.onload = function() {

    var response = JSON.parse(this.responseText)
    console.log(response)

    var stockName = response["Meta Data"]["2. Symbol"]

    document.getElementById("aktieName").innerHTML = stockName
    document.getElementById("aktieDatum").innerHTML = response["Meta Data"]["3. Last Refreshed"]
    document.getElementById("aktieMax").innerHTML = getMax(response["Time Series (Daily)"])
    document.getElementById("aktieMin").innerHTML = getMin(response["Time Series (Daily)"])

    var dates = []
    var close = []
    for(var date in response["Time Series (Daily)"]) {
      dates.unshift(date)
      close.unshift(response["Time Series (Daily)"][date]["4. close"])
    }
    

    data = {
    labels: dates,
    datasets: [{
      label: stockName,
      data: close,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
    }

  document.getElementById("Aktienchart").innerHTML = "<canvas id='Aktienkurs'></canvas>"
  const ctx = document.getElementById('Aktienkurs')
  new Chart(ctx, {
    type: 'line', 
    data: data,
    options: {
      responsive: true
    }
  })

  }



  xhttp.open("GET", url, true)

  xhttp.send()
}

function getMax(history) {
  var max = 0.0
  for(var x in history) {
    if(parseFloat(history[x]["2. high"]) > max) {
      max = parseFloat(history[x]["2. high"])
    }
  }
  return max
}

function getMin(history) {
  var min = -1.0
  for(var x in history) {
    if(parseFloat(history[x]["3. low"]) < min || min == -1.0) {
      min = parseFloat(history[x]["3. low"])
    }
  }
  return min
}