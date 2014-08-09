

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
	window.__myusername = window.localStorage.getItem('auth_login');
	window.__mypass = window.localStorage.getItem('auth_pass');
	
	function status(value, msg, time){  //função do fade-popup
	if(value == 'open'){
	document.getElementById('status').style.width='280';
	document.getElementById('status').style.height='21';
	document.getElementById('status').style.opacity='1';
	document.getElementById('status').innerHTML=msg;
	setTimeout(function(){status('fechar', 0, 0)},time);
	}
	else{
	document.getElementById('status').style.opacity='0';
	setTimeout(function(){document.getElementById('status').style.width='0'},1000);
	setTimeout(function(){document.getElementById('status').style.height='0'},1000);
	}
	}
	function menu(value){
	if(value == 'fechar'){
	document.getElementById("menu").onclick = function() {menu('abrir')}
	document.getElementById('menu-bar').style.left='-200px';
	document.getElementById('fade').style.opacity='0';
	document.getElementById('fade').style.width='0';
	document.getElementById('fade').style.height='0';
	document.getElementById('logo').innerHTML="iHabi Messenger";
	}
	else{
	document.getElementById("menu").onclick = function() {menu('fechar')}
	document.getElementById('menu-bar').style.left='0px';
	document.getElementById('fade').style.width='100%';
	document.getElementById('fade').style.height='100%';
	document.getElementById('fade').style.opacity='.8';
	document.getElementById('logo').innerHTML="Menu";
	}
	}
	
	function logout(){
	menu('fechar');
	localStorage.removeItem("auth");
	localStorage.removeItem("auth_login");
	localStorage.removeItem("auth_pass");
	localStorage.removeItem("friends");
	localStorage.removeItem("friends-created");
	localStorage.removeItem("look");
	localStorage.removeItem("look-created");
	window.localStorage.setItem('welcome', 'true');
	window.location.replace('./index.html');
	}
	
	function go_to(hehe){
	window.location.replace(hehe);
	}
	
		function add_msg_to_db(sender, receiver, text, method, time){
			var msg = {
			message: text,
			sender: sender,
			receiver: receiver,
			time: time
			};
			if(method == 'getting'){
				var friend = sender;
			}
			if(method == 'sending'){
				var friend = receiver;
			}
			var value = window.localStorage.getItem(window.__myusername+'_'+friend+"_chatlogs");
			if(value !== null){
			window[friend+"_chatlogs"] = JSON.parse(value);
			}
			else{
			window[friend+"_chatlogs"] = [];
			}
			window[friend+"_chatlogs"].push(JSON.stringify(msg));
			window.localStorage.setItem(window.__myusername+'_'+friend+"_chatlogs", JSON.stringify(window[friend+"_chatlogs"]));
			delete msg;
			delete friend;
			delete value;
			delete window[friend+"_chatlogs"];
	}
function onBackKeyDown(){
var pathArray = window.location.pathname.split( '/' );
var pathArray = pathArray.pop();
if(pathArray == 'chat.html'){
go_to('me.html');
}
else{
navigator.app.exitApp();
}
return false;
}
