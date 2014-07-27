
function valida_login(){
var login_user = $("input[name='login-user']").val(); //login name
var login_password = $("input[name='login-password']").val(); //login pass
if(login_password.length > 0 && login_user.length > 0){ //checa se ele digitou
document.getElementById('hidden').style.display='block'; //aciona animação de carregamento

$.post("https://www.ihabi.net/IHABI_APP_BACKEND/gets.php", { login_user: login_user, login_password: login_password, parameter: 'only_auth' }) //parametros do POST
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
window.location='./index.html'
}
});
return false;
}

else{  //ele não digitou
status('open', 'Preencha todos os campos', '3000');
}
}


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