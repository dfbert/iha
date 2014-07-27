		document.getElementById('hidden').style.display='block'; //desaciona animação de carregamento
		var wsUri = "ws://162.209.59.54:9000/daemon.php?username=ColaQuente";   
		websocket = new WebSocket(wsUri); 
		
		websocket.onopen = function(ev) {
		}	
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
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'friends', 'amigos');
	}
	
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'friends', 'amigos');
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'look', 'avatar');
	
	
	websocket.onmessage = function(ev) {
			var msg = JSON.parse(ev.data); //PHP sends Json data
			var type = msg.type; //message type
			var umsg = msg.message; //message text
			var uname = msg.name; //user name
			var last = msg.last; //color
			var timee = msg.time; //color

			if(type == 'usermsg') 
			{
				add_msg_to_db(uname, __myusername, umsg, 'getting', timee);
			}
			if(type == 'auth')
			{
				var auth = {
				type: 'auth',
				name: ''+__myusername+'',
				password: window.localStorage.getItem('auth_pass'),
				message: ''+umsg+''
				};
				websocket.send(JSON.stringify(auth));
				document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
			}
			if(type == 'callback')
			{
				add_msg_to_db(__myusername, uname, umsg, 'sending', timee);
			}
			if(type == 'logout')
			{
				logout();
			}
		};
		
		websocket.onerror   = function(ev){alert(ev.data);}; 
		websocket.onclose   = function(ev){alert('close');}; 
		
		
		
    // Call onDeviceReady when PhoneGap is loaded.
    //
    // At this point, the document has loaded but phonegap-1.0.0.js has not.
    // When PhoneGap is loaded and talking with the native device,
    // it will call the event `deviceready`.
    // 
    document.addEventListener("deviceready", onDeviceReady, false);

    // PhoneGap is loaded and it is now safe to make calls PhoneGap methods
		//
	function onDeviceReady(){
		document.addEventListener("backbutton", onBackKeyDown, false);
	}