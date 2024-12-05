var xhttp = new XMLHttpRequest();

var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YY51ZYK7TQUK57HU';

//xhttp.onreadystatechange()

xhttp.open("GET", url, true)

xhttp.send()

const ctx = document.getElementById('Aktienkurs');

/*
const data = {
    labels = 
}
*/

const labels = [1,2,3,4,5,6,7];
const data = {
  labels: labels,
  datasets: [{
    label: 'IBM',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

new Chart(ctx, {
    type: 'line', 
    data: data
})