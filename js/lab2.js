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

function getTemp(){
    $.getJSON("https://api.forecast.io/forecast/ce71be91edebab9e5b9962342dbc985c/35.300399,-120.662362?callback=?",
        function(data){
            $("#forecastLabel").html(data.daily.summary);
            $("#forecastIcon").attr("src", "img/" + data.daily.icon + ".png");

            var temp = data.daily.data[0].temperatureMax;
            var tempClass = ""

            if (temp >= 90)
                tempClass = "hot";
            else if (temp >= 80)
                tempClass = "warm";
            else if (temp >= 70)
                tempClass = "nice";
            else if (temp >= 60)
                tempClass = "chilly";
            else
                tempClass = "cold";

            $("body").addClass(tempClass)
        })
}

function hideAlarmPopup() {
   $("#popup").addClass("hide");
   $("#mask").addClass("hide");
}

function showAlarmPopup() {
   $("#popup").removeClass("hide");
   $("#mask").removeClass("hide");
}

function insertAlarm(hours, mins, ampm, name) {
   newDiv = $("<div>");
   newDiv.addClass("flexable");
   nameDiv = $("<div>").addClass("name").html(name + "   ");
   timeDiv = $("<div>").addClass("time padLeft").html(hours + ":" + mins + " " + ampm);
   newDiv.append(nameDiv)
   newDiv.append(timeDiv);
   $("#alarms").append(newDiv);
}

function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var name = $("#alarmName").val();

   insertAlarm(hours, mins, ampm, name);
   hideAlarmPopup();
}

$(document).ready(function(){
    setTimeout(function(){ getTime() }, 1000);
    getTemp();
})
