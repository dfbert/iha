  var socket = io('http://up1.dfbert.com:666', {transports: ['websocket']});
  socket.emit('auth', { username: window.__myusername, password: window.__mypass });
  socket.on('auth', function (data) {
	if(data.welcome != true){
		logout();
	}
  });  
    socket.on('message', function (data) {
		add_msg_to_db(data.username, data.friend, data.msg, 'getting', data.time);
  });
    socket.on('callback', function (data) {
		add_msg_to_db(data.username, data.friend, data.msg, 'sending', data.time);
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
	
	fetch(window.__myusername, window.__mypass, 'friends', 'amigos');
	fetch(window.__myusername, window.__mypass, 'look', 'avatar');
	
	
	