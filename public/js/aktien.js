var xhttp = new XMLHttpRequest();

//var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YY51ZYK7TQUK57HU';

xhttp.onload = function() {

  var response = JSON.parse(this.responseText)

  var stockName = response["Meta Data"]["2. Symbol"]

  var dates = []
  var close = []
  for(var date in response["Time Series (Daily)"]) {
    dates.unshift(date)
    close.unshift(response["Time Series (Daily)"][date]["4. close"])
  }
  

  const data = {
  labels: dates,
  datasets: [{
    label: stockName,
    data: close,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
  }

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

const ctx = document.getElementById('Aktienkurs')

/*
const data = {
    labels = 
}
*/

