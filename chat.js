		document.getElementById('hidden').style.display='block'; //desaciona animação de carregamento
		var wsUri = "ws://162.209.59.54:9000/daemon.php?username=ColaQuente";   
		websocket = new WebSocket(wsUri); 
		
		websocket.onopen = function(ev) {
		}	
	var friendname = getUrlVars()["friendname"].toUpperCase();

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
	document.getElementById('frindname').innerHTML='<div id="back" onclick="go_to(\'me.html\');"></div><div id="avatar"></div><div style="float:left;">'+getUrlVars()["friendname"]+'</div>';
	fetch(__myusername, window.localStorage.getItem('auth_pass'), 'look', 'avatar', friendname);
	document.getElementById('myavtr').innerHTML=window.localStorage.getItem('look');
	var chaaa = window.localStorage.getItem(friendname+'_chatlogs');
	if(chaaa !== null){
	var i;
	for (i = 0; i < JSON.parse(chaaa).length; i++) {
	if((JSON.parse(JSON.parse(chaaa)[i])['receiver']) == friendname){
	tt = 'me';
	}
	else{
	tt = 'friend';
	}
	$( "#displayer" ).append( "<div id=\""+tt+"\">"+JSON.parse(JSON.parse(chaaa)[i])['message']+"</div>" );
	}
	
	
	
	
	
	
	
	
	
	}

	
	function send_message(to, txt, myname){
			websocket.send(JSON.stringify({ 			type: 'msg', 			message: txt, 			name: myname, 			friend: to 			}));
			websocket.send(JSON.stringify({ 			type: 'callback', 			message: txt, 			name: myname, 			friend: to 			}));
	}
	$( "#former" ).submit(function( event ) {
		var mymessage = $('#texarea').val(); //get message text
		send_message(friendname, mymessage, __myusername);
		$('#texarea').val(''); //get message text
		event.preventDefault();
	});
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
				$( "#displayer" ).append( "<div id=\"friend\">"+umsg+"</div>" );
				$("#displayer").animate({ scrollTop: $('#displayer')[0].scrollHeight}, 1000);
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
				$( "#displayer" ).append( "<div id=\"me\">"+umsg+"</div>" );
				$("#displayer").animate({ scrollTop: $('#displayer')[0].scrollHeight}, 1000);
			}
			if(type == 'logout')
			{
				logout();
			}
		};
		
		websocket.onerror   = function(ev){alert(ev.data);}; 
		websocket.onclose   = function(ev){alert('close');}; 
		