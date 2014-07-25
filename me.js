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
<<<<<<< HEAD
			document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
=======
>>>>>>> 7fd2935f8538633f8838e13eb75818ba3724c31f
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
<<<<<<< HEAD
					document.getElementById(divid).innerHTML=data;
					document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
=======
>>>>>>> 7fd2935f8538633f8838e13eb75818ba3724c31f
				});
			}
			document.getElementById(divid).innerHTML=window.localStorage.getItem(paramm);
		}
		
	}
	var valuea = window.localStorage.getItem('auth');
	if(valuea === null){
		logout();
	}
<<<<<<< HEAD
	
	function atualizar(){
	document.getElementById('hidden').style.display='block'; //aciona animação de carregamento
	window.localStorage.setItem('friends-without_created', Math.round(+new Date()/1000)-65);
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'friends-without', 'amigos-sem');
	}
	
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'friends-without', 'amigos-sem');
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'look', 'avatar');
	
	function go_to(value){
	window.location=value;
	}
=======
	//fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'friends', 'amigos');
	fetch(window.localStorage.getItem('auth_login'), window.localStorage.getItem('auth_pass'), 'friends-without', 'amigos-sem');
>>>>>>> 7fd2935f8538633f8838e13eb75818ba3724c31f
