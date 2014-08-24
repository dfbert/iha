		$.get("http://www.ihabi.net/IHABI_APP_BACKEND/ip.txt") //parametros do POST
		.done(function(ip) {
		window.localStorage.setItem('serverip', ip);
		window.__serverip = ip;
		});
		            
		            
		function valida_login(){
		var login_user = $("input[name='login-user']").val(); //login name
		var login_password = $("input[name='login-password']").val(); //login pass
		if(login_password.length > 0 && login_user.length > 0){ //checa se ele digitou
		document.getElementById('hidden').style.display='block'; //aciona animação de carregamento
		
		$.get("http://www.ihabi.net/IHABI_APP_BACKEND/gets.php", { login_user: login_user, login_password: login_password, parameter: 'only_auth' }) //parametros do POST
		.done(function(data) {
		document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
		
		if (data == "null"){
		status('open', 'Esta conta não existe', '3000');
		}
		
		if(data == "error"){
		status('open', 'Senha incorreta', '3000');
		}
		
		if(data == "true"){
		window.localStorage.setItem('auth', 'true');
		window.localStorage.setItem('auth_login', login_user);
		window.localStorage.setItem('auth_pass', login_password);
		window.location.replace('./index.html');
		}
		})
		
		.fail(function() {
		document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
		status('open', 'Não foi possível se conectar', '3000');
		});
		return false;
		}
		
		else{  //ele não digitou
		status('open', 'Preencha todos os campos', '3000');
		}
		}
		
		
		function face_login(id){
		document.getElementById('hidden').style.display='block'; //aciona animação de carregamento
		$.get("http://www.ihabi.net/IHABI_APP_BACKEND/gets.php", { login_password: id, parameter: 'face_auth' }) //parametros do POST
		.done(function(data) {
		
		if (data == "nonface"){
		status('open', 'Entre em www.ihabi.net e crie uma conta primeiro', '3000');
		}
		
		else{
		window.localStorage.setItem('auth', 'true');
		window.localStorage.setItem('auth_login', data);
		window.localStorage.setItem('auth_pass', id);
		window.location.replace('./index.html');
		}
		document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
		})
		.fail(function() {
		document.getElementById('hidden').style.display='none'; //desaciona animação de carregamento
		status('open', 'Não foi possível se conectar', '3000');
		});
		return false;
		}
		
		document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown(e) {
		  e.preventDefault();
		}

            
            
            
            function logina() {
                FB.login(
                         function(response) {
                         if (response.authResponse.userId) {
                         face_login(response.authResponse.userId);
                         } else {
                         alert('Tente novamente')
                         }
                         },
                         { scope: "email" }
                         );
            }
            
            document.addEventListener('deviceready', function() {
                                      try {
                                      FB.init({ appId: "193453177489005", nativeInterface: CDV.FB, useCachedDialogs: false });
                                      } catch (e) {
                                      }
                                      }, false);