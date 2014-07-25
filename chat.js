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
	var friendname = getUrlVars()["friendname"];
	document.getElementById('frindname').innerHTML='<div id="back" onclick="go_to(\'me.html\');"></div><div id="avatar"></div><div style="float:left;">'+friendname+'</div>';
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'look', 'avatar', friendname);
	document.getElementById('myavtr').innerHTML=window.localStorage.getItem('look');
