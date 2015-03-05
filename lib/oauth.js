var client_id, response_type, callback, redirect;
var access_token, uid;

function init(params){
   client_id = params.client_id;
   response_type = params.response_type;
   callback = params.callback;
   redirect = params.redirect;
}

function login(){
   window.location = "https://api.imgur.com/oauth2/authorize?client_id=" + client_id +
   "&response_type=" + response_type;
}

function accountInfoRetrieved(data){
   console.log("Success!");
   console.log(data);

}

function loginSuccess(){
   //Authorization: Bearer
   $.ajax({
       url: "https://api.imgur.com/3/account/me",
       headers: { 'Authorization': 'Bearer ' + access_token },
       success: function(data){
          $("#loginButton").removeClass("button");
          $("#loginButton").addClass("hide");
          $("#content").html("<h1> " + data.data.url + " is the best! </html>");
          alert("Welcome " + data.data.url);
       }
   });
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


$(document).ready(function(){
   init({client_id:"d22ed5fc5716588", response_type: "token", callback: loginSuccess, redirect: "http://taywoo.com/lib"});

   //I am aware this isnt the most bulletproof approach
   var oauth_response = window.location.hash.substr(1).split("&");
   if(oauth_response[0].split("=")[0] == "access_token" ){
      access_token = oauth_response[0].split("=")[1];
      uid = oauth_response[2].split("=")[1];
      loginSuccess();
   }
});
