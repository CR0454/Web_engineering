var xhttp = new XMLHttpRequest();

var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=YY51ZYK7TQUK57HU';

//xhttp.onreadystatechange()

xhttp.open("GET", url, true)

xhttp.send()