  var socket = io('http://up1.dfbert.com:666', {transports: ['websocket']});
  window.friendname = getUrlVars()["friendname"].toUpperCase();
  socket.emit('auth', { username: window.__myusername, password: window.__mypass });
  socket.on('auth', function (data) {
	if(data.welcome != true){
		logout();
	}
  });  
    socket.on('message', function (data) {
		add_msg_to_db(data.username, data.friend.toUpperCase(), data.msg, 'getting', data.time);
		if(data.username.toUpperCase() == window.friendname){
		$( "#displayer" ).append( "<div id=\"friend\">"+data.msg+"</div>" );
		$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
		}
  });
    socket.on('callback', function (data) {
		add_msg_to_db(data.username, data.friend.toUpperCase(), data.msg, 'sending', data.time);
		if(data.friend.toUpperCase() == window.friendname){
		$( "#displayer" ).append( "<div id=\"me\">"+data.msg+"</div>" );
		$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
		}
  });
    socket.on('sync', function (data) {
		add_msg_to_db(data.sender.toUpperCase(), window.__myusername, data.msg, 'getting', data.time);
		if(data.sender.toUpperCase() == window.friendname){
		$( "#displayer" ).append( "<div id=\"friend\">"+data.msg+"</div>" );
		$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
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
	fetch(__myusername, window.localStorage.getItem('auth_pass'), 'look', 'avatar', window.friendname);
	document.getElementById('myavtr').innerHTML=window.localStorage.getItem('look');
	var chaaa = window.localStorage.getItem(window.friendname+'_chatlogs');
	if(chaaa !== null){
	var i;
	for (i = 0; i < JSON.parse(chaaa).length; i++) {
	if((JSON.parse(JSON.parse(chaaa)[i])['receiver']) == window.friendname){
	tt = 'me';
	}
	else{
	tt = 'friend';
	}
	$( "#displayer" ).append( "<div id=\""+tt+"\">"+JSON.parse(JSON.parse(chaaa)[i])['message']+"</div>" );
	$('#displayer').scrollTop($('#displayer')[0].scrollHeight - $('#displayer')[0].clientHeight);
	}
	
	}

	
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