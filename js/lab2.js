function getTime(){
    var d = new Date();
    var hours = doubleDigit(d.getHours());
    var minutes = doubleDigit(d.getMinutes());
    var seconds = doubleDigit(d.getSeconds());
    document.getElementById("clock").innerHTML = hours + 
    ":" + minutes + ":" + seconds;
    setTimeout(function(){ getTime() }, 1000);
}

function doubleDigit(num){
    if (num < 10){
        return "0" + num
    }
    return num
}

setTimeout(function(){ getTime() }, 1000);