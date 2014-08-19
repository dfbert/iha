  var socket = io('http://up1.dfbert.com:666');
  window.friendname = getUrlVars()["friendname"].toUpperCase();
  window.localStorage.setItem(window.__myusername+'_'+window.friendname+"_chatlogs_unread", 0);
  socket.on('auth', function (data) {
	if(data.welcome != true){
		logout();
	}
	else{
	clearTimeout(myVar);
	$("input[type=submit]").removeAttr("disabled");
	}
  });  
    socket.on('message', function (data) {
		add_msg_to_db(data.username, data.friend.toUpperCase(), data.msg, 'getting', data.time);
		if(data.username.toUpperCase() == window.friendname){
		$( "#table" ).append( "<tr>   <td><div id=\"friend\">"+data.msg+"<span id=\"time\">"+new Date(data.time*1000).toISOString().match(/(\d{2}:\d{2})/)[1]+"</span></div></td> </tr>" );
		$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
		}		
		else{
			var aaa = window.localStorage.getItem(window.__myusername+'_'+data.friend.toUpperCase()+'_chatlogs_unread');
			if(aaa === null){
			aaa = 0;
			}
			aaa++;
			window.localStorage.setItem(window.__myusername+'_'+data.friend.toUpperCase()+"_chatlogs_unread", aaa);
			delete aaa;
		}
  });
    socket.on('callback', function (data) {
		add_msg_to_db(data.username, data.friend.toUpperCase(), data.msg, 'sending', data.time);
		if(data.friend.toUpperCase() == window.friendname){
		$( "#table" ).append( "<tr>   <td><div id=\"me\">"+data.msg+"<span id=\"time\">"+new Date(data.time*1000).toISOString().match(/(\d{2}:\d{2})/)[1]+"</span></div></td> </tr>" );
		$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
		}
  });
    socket.on('sync', function (data) {
		add_msg_to_db(data.sender.toUpperCase(), window.__myusername, data.msg, 'getting', data.time);
		if(data.sender.toUpperCase() == window.friendname){
			$( "#table" ).append( "<tr>   <td><div id=\"friend\">"+data.msg+"<span id=\"time\">"+new Date(data.time*1000).toISOString().match(/(\d{2}:\d{2})/)[1]+"</span></div></td> </tr>" );
			$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
		}
		else{
			var aaa = window.localStorage.getItem(window.__myusername+'_'+data.sender.toUpperCase()+'_chatlogs_unread');
			if(aaa === null){
			aaa = 0;
			}
			aaa++;
			window.localStorage.setItem(window.__myusername+'_'+data.sender.toUpperCase()+"_chatlogs_unread", aaa);
			delete aaa;
		}
  });

	function fetch(user, pass, paramm, divid, friend)
	{	
		var parammtim = friend+'_'+paramm+'_created';
        var value = window.localStorage.getItem(friend+'_'+paramm);
        var valuetim = window.localStorage.getItem(parammtim);
		if(value === null){
		$.post("https://www.ihabi.net/IHABI_APP_BACKEND/friend.php", { login_user: user, login_password: pass, parameter: paramm, friend: friend }) //parametros do POST
		.done(function(data) 
		{
					if (data == "null"){
					go_to('me.html');
					}
					if(data == "error"){
					logout();
					}
			window.localStorage.setItem(friend+'_'+paramm, data);					
			window.localStorage.setItem(parammtim, Math.round(+new Date()/1000));	
			document.getElementById(divid).innerHTML=data;
		});
		.fail(function() {
		status('open', 'Não foi possível se conectar', '3000');
		});
		}
		else{
			if((parseInt(valuetim)-(Math.round(+new Date()/1000)-60)) < 0){
				$.post("https://www.ihabi.net/IHABI_APP_BACKEND/friend.php", { login_user: user, login_password: pass, parameter: paramm, friend: friend }) //parametros do POST
				.done(function(data) 
				{
					if (data == "null"){
					logout();
					}
					if(data == "error"){
					logout();
					}
					window.localStorage.removeItem(friend+'_'+paramm);
					window.localStorage.removeItem(parammtim);
					window.localStorage.setItem(friend+'_'+paramm, data);					
					window.localStorage.setItem(parammtim, Math.round(+new Date()/1000));	
					document.getElementById(divid).innerHTML=data;
				});
				
				.fail(function() {
				status('open', 'Não foi possível se conectar', '3000');
				});
			}
			document.getElementById(divid).innerHTML=window.localStorage.getItem(friend+'_'+paramm);
		}
		
	}
	var valuea = window.localStorage.getItem('auth');
	if(valuea === null){
		logout();
	}
	function getUrlVars()
	{
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
	
	$( "#frindname" ).append('</div><div id="avatar"></div><div style="position: absolute; left: 114px;">'+getUrlVars()["friendname"]+'</div>');
	fetch(__myusername, window.localStorage.getItem('auth_pass'), 'look', 'avatar', window.friendname);
	document.getElementById('myavtr').innerHTML=window.localStorage.getItem('look');
	var chaaa = window.localStorage.getItem(window.__myusername+'_'+window.friendname+'_chatlogs');
	if(chaaa !== null){
	var i;
	for (i = 0; i < JSON.parse(chaaa).length; i++) {
	if((JSON.parse(JSON.parse(chaaa)[i])['receiver']) == window.friendname){
	tt = 'me';
	}
	else{
	tt = 'friend';
	}
	$( "#table" ).append( "<tr>   <td><div id=\""+tt+"\">"+JSON.parse(JSON.parse(chaaa)[i])['message']+"<span id=\"time\">"+new Date(JSON.parse(JSON.parse(chaaa)[i])['time']*1000).toISOString().match(/(\d{2}:\d{2})/)[1]+"</span></div></td> </tr>" );
	$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
	}
	
	}
	delete chaaa;

	
	function send_message(txt){
			socket.emit('message', { username: window.__myusername, password: window.__mypass, friend: window.friendname, msg: txt });
	}
	$( "#former" ).submit(function( event ) {
		if($('#texarea').val() != ''){
		send_message($('#texarea').val());
		$('#texarea').val('');
		}
		event.preventDefault();
	});
	function onDeviceReadys(){
	document.addEventListener("backbutton", onBackKeyDown, false);
	myVar = setTimeout(function(){status('open', 'Não foi possível se conectar', '3000')}, 10000);
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
					setTimeout(function(){socket.emit('auth', { username: window.__myusername, password: window.__mypass, not: e.regid})}, 950);
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