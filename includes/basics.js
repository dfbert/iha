

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
}
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    tokenHandler:function(msg) {
        console.log("Token Handler " + msg);
    },
    errorHandler:function(error) {
        console.log("Error Handler  " + error);
        alert(error);
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('Success! Result = '+result)
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var pushNotification = window.plugins.pushNotification;
        // TODO: Enter your own GCM Sender ID in the register call for Android
        if (device.platform == 'android' || device.platform == 'Android') {
            pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"554205989074","ecb":"app.onNotificationGCM"});
        }
        else {
            pushNotification.register(this.tokenHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
        }
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // iOS
    onNotificationAPN: function(event) {
        var pushNotification = window.plugins.pushNotification;
        console.log("Received a notification! " + event.alert);
        console.log("event sound " + event.sound);
        console.log("event badge " + event.badge);
        console.log("event " + event);
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }
        if (event.badge) {
            console.log("Set badge on  " + pushNotification);
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    },
    // Android
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    alert('registration id = '+e.regid);
                }
            break;

            case 'message':
              // this is the actual push notification. its format depends on the data model
              // of the intermediary push server which must also be reflected in GCMIntentService.java
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;

            case 'error':
              alert('GCM error = '+e.msg);
            break;

            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }

};
