var countDownFrom = 10;
var now = 0;
var x = setInterval(function() {
    var distance = countDownFrom - now;
    var seconds = Math.floor(distance);
    document.getElementById("countdown").innerHTML = seconds + "s";
    if (distance < 0){
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "LOS!!!";
    }
    }, 1000);

