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

var user_id = null;

function getAllAlarms() {

   Parse.initialize("9wVKj7FtVb3xpTPXJLLowOd1JDxa32JX7TqIElLH", "LrilQx72ISPCSScfHhFWWZ1zXMWFxi5a9bfkb9P8");

   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.equalTo("user_id", user_id);
   query.find({
     success: function(results) {
         for (var i = 0; i < results.length; i++) {
            insertAlarm(results[i].attributes.hours, results[i].attributes.mins, results[i].attributes.ampm, results[i].attributes.alarmName, results[i].id);
         }
     }
   });

}

function showAlarmPopup() {
   $("#popup").removeClass("hide");
   $("#mask").removeClass("hide");
}

function deleteAlarm(){
   var clickedButton = $(this);
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);

   query.get(clickedButton.attr('id'), {

     success: function(obj) {
       //Remove the object from parse
       obj.destroy({});
       //Remove the div from HTML
       clickedButton.parent("div").remove();
     },

     error: function(object, error) {
        console.log(error)
     }
   });
}

function insertAlarm(hours, mins, ampm, name, id) {
   newDiv = $("<div>").addClass("flexable");
   nameDiv = $("<div>").addClass("name").html(name + "   ");
   timeDiv = $("<div>").addClass("time padLeft").html(hours + ":" + mins + " " + ampm);

   delButton = $("<input>").addClass("pullRight").attr("type", "button").attr("value", "Delete").attr("id", id);
   delButton.on("click", deleteAlarm);

   newDiv.append(nameDiv).append(timeDiv).append(delButton);
   $("#alarms").append(newDiv);
}

function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var name = $("#alarmName").val();


   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();
   alarmObject.save({"hours": hours, "mins": mins, "ampm": ampm, "alarmName": name, "user_id": user_id}, {
   success: function(object) {
      console.log(object)
      insertAlarm(hours, mins, ampm, name, object.id);
      hideAlarmPopup();
   }
   });
}

function signInCallback(authResult) {
  if (authResult['status']['signed_in']) {
    //Use auth token to get user information
    gapi.client.load('plus','v1', function(){
    var request = gapi.client.plus.people.get({
       'userId': 'me'
    });
    request.execute(function(resp) {
       user_id = resp.id
       $("signInContainer").addClass("hide")
       $("#alarmContainer").removeClass("hide")
       getAllAlarms()
    });
   });

  } else {
    console.log('Sign-in state: ' + authResult['error']);
  }
}

$(document).ready(function(){
    getTemp();
})
