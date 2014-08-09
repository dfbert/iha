  var socket = io('http://up1.dfbert.com:666', {transports: ['websocket']});
  socket.on('auth', function (data) {
	if(data.welcome != true){
		logout();
	}
  });  
    socket.on('message', function (data) {
		add_msg_to_db(data.username, data.friend.toUpperCase(), data.msg, 'getting', data.time);
		if(data.friend.toUpperCase() == window.friendname){
		$( "#displayer" ).append( "<div id=\"friend\">"+data.msg+"</div>" );
		
		}
  });
    socket.on('callback', function (data) {
		add_msg_to_db(data.username, data.friend.toUpperCase(), data.msg, 'sending', data.time);
		if(data.friend.toUpperCase() == window.friendname){
		$( "#displayer" ).append( "<div id=\"me\">"+data.msg+"</div>" );
		
		}
  });
    socket.on('sync', function (data) {
		add_msg_to_db(data.sender.toUpperCase(), window.__myusername, data.msg, 'getting', data.time);
		if(data.sender.toUpperCase() == window.friendname){
		$( "#displayer" ).append( "<div id=\"friend\">"+data.msg+"</div>" );
		
		}
  });
		function fetch(user, pass, paramm, divid)
		{	
		var parammtim = paramm+'_created';
        var value = window.localStorage.getItem(paramm);
        var valuetim = window.localStorage.getItem(parammtim);
		if(value === null){
		$.post("https://www.ihabi.net/IHABI_APP_BACKEND/gets.php", { login_user: user, login_password: pass, parameter: paramm }) //parametros do POST
		.done(function(data) 
		{
					if (data == "null"){
					logout();
					}
					if(data == "error"){
					logout();
					}
			window.localStorage.setItem(paramm, data);					
			window.localStorage.setItem(parammtim, Math.round(+new Date()/1000));	
			document.getElementById(divid).innerHTML=data;
			document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
		});
		}
		else{
			if((parseInt(valuetim)-(Math.round(+new Date()/1000)-60)) < 0){
				$.post("https://www.ihabi.net/IHABI_APP_BACKEND/gets.php", { login_user: user, login_password: pass, parameter: paramm }) //parametros do POST
				.done(function(data) 
				{
					if (data == "null"){
					logout();
					}
					if(data == "error"){
					logout();
					}
					window.localStorage.removeItem(paramm);
					window.localStorage.removeItem(parammtim);
					window.localStorage.setItem(paramm, data);					
					window.localStorage.setItem(parammtim, Math.round(+new Date()/1000));	
					document.getElementById(divid).innerHTML=data;
					document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
				});
			}
			document.getElementById(divid).innerHTML=window.localStorage.getItem(paramm);
		}
		
	}
	
	
	var valuea = window.localStorage.getItem('auth');
	if(valuea === null){
		logout();
	}
	
	function atualizar(){
	document.getElementById('hidden').style.display='block'; //aciona animação de carregamento
	window.localStorage.setItem('friends-created', Math.round(+new Date()/1000)-2000);
	fetch(window.__myusername, window.__mypass, 'friends', 'amigos');
	}
	
	function onDeviceReadys(){
	document.addEventListener("backbutton", onBackKeyDown, false);
	fetch(window.__myusername, window.__mypass, 'friends', 'amigos');
	fetch(window.__myusername, window.__mypass, 'look', 'avatar');
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
        document.addEventListener('deviceready', function() { app.onDeviceReady(); onDeviceReadys(); }, false);
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
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var pushNotification = window.plugins.pushNotification;
        // TODO: Enter your own GCM Sender ID in the register call for Android
        if (device.platform == 'android' || device.platform == 'Android') {
            pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"372611656025","ecb":"app.onNotificationGCM"});
        }
        console.log('Received Event: ' + id);
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
					socket.emit('auth', { username: window.__myusername, password: window.__mypass, not: e.regid});
                }
            break;

            case 'message':
				navigator.notification.vibrate(2500);
				// if this flag is set, this notification happened while we were in the foreground.
				// you might want to play a sound to get the user's attention, throw up a dialog, etc.
				if ( e.foreground )
				{
				}
				else
				{  // otherwise we were launched because the user touched a notification in the notification tray.
					if ( e.coldstart )
					{
						window.location.replace('chat.html?friendname='+e.sender);
					}
					else
					{
					   status('open', e.sender, '3000');
					}
				}
            break;

            case 'error':
            break;

            default:
              break;
        }
    }

	};
	app.initialize();