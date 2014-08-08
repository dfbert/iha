

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
	window.__myusername = window.localStorage.getItem('auth_login');
	window.__mypass = window.localStorage.getItem('auth_pass');
	
	function status(value, msg, time){  //função do fade-popup
	if(value == 'open'){
	document.getElementById('status').style.width='280';
	document.getElementById('status').style.height='21';
	document.getElementById('status').style.opacity='1';
	document.getElementById('status').innerHTML=msg;
	setTimeout(function(){status('fechar', 0, 0)},time);
	}
	else{
	document.getElementById('status').style.opacity='0';
	setTimeout(function(){document.getElementById('status').style.width='0'},1000);
	setTimeout(function(){document.getElementById('status').style.height='0'},1000);
	}
	}
	function menu(value){
	if(value == 'fechar'){
	document.getElementById("menu").onclick = function() {menu('abrir')}
	document.getElementById('menu-bar').style.left='-200px';
	document.getElementById('fade').style.opacity='0';
	document.getElementById('fade').style.width='0';
	document.getElementById('fade').style.height='0';
	document.getElementById('logo').innerHTML="iHabi Messenger";
	}
	else{
	document.getElementById("menu").onclick = function() {menu('fechar')}
	document.getElementById('menu-bar').style.left='0px';
	document.getElementById('fade').style.width='100%';
	document.getElementById('fade').style.height='100%';
	document.getElementById('fade').style.opacity='.8';
	document.getElementById('logo').innerHTML="Menu";
	}
	}
	
	function logout(){
	menu('fechar');
	localStorage.removeItem("auth");
	localStorage.removeItem("auth_login");
	localStorage.removeItem("auth_pass");
	localStorage.removeItem("friends");
	localStorage.removeItem("friends-created");
	localStorage.removeItem("look");
	localStorage.removeItem("look-created");
	window.localStorage.setItem('welcome', 'true');
	window.location.replace('./index.html');
	}
	
	function go_to(hehe){
	window.location.replace(hehe);
	}
	
		function add_msg_to_db(sender, receiver, text, method, time){
			var msg = {
			message: text,
			sender: sender,
			receiver: receiver,
			time: time
			};
			if(method == 'getting'){
				var friend = sender;
			}
			if(method == 'sending'){
				var friend = receiver;
			}
			var value = window.localStorage.getItem(window.__myusername+'_'+friend+"_chatlogs");
			if(value !== null){
			window[friend+"_chatlogs"] = JSON.parse(value);
			}
			else{
			window[friend+"_chatlogs"] = [];
			}
			window[friend+"_chatlogs"].push(JSON.stringify(msg));
			window.localStorage.setItem(window.__myusername+'_'+friend+"_chatlogs", JSON.stringify(window[friend+"_chatlogs"]));
			delete msg;
			delete friend;
			delete value;
			delete window[friend+"_chatlogs"];
	}
	
	    document.addEventListener("deviceready", onDeviceReady, false);

function onBackKeyDown(){

var pathArray = window.location.pathname.split( '/' );
var pathArray = pathArray.pop();
if(pathArray == 'chat.html'){
go_to('me.html');
}
else{
navigator.app.exitApp();
}
return false;
}

function onDeviceReady(){
    document.addEventListener("backbutton", onBackKeyDown, false);
	window.plugin.backgroundMode.enable();
var pushNotification;
pushNotification = window.plugins.pushNotification;
alert(device.platform);
if ( device.platform == 'android' || device.platform == 'Android' )
{

    alert('result = ' + device.platform);
    pushNotification.register(
        successHandler,
        errorHandler, {
            "senderID":"eminent-prism-666",
            "ecb":"onNotificationGCM"
        });
}
else
{
    pushNotification.register(
        tokenHandler,
        errorHandler, {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN"
        });
}

function successHandler (result) {
    alert('result = ' + result);
	 alert("regID = " + e.regid);
}
function errorHandler (error) {
    alert('error = ' + error);
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    alert('device token = ' + result);
}

// iOS
function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

// Android
function onNotificationGCM(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            alert("regID = " + e.regid);
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

            // if the notification contains a soundname, play it.
            var my_media = new Media("/android_asset/www/"+e.soundname);
            my_media.play();
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
            }
            else
            {
                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
            }
        }

        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
    break;

    case 'error':
        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}



}

