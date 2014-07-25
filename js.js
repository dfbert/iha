var db = openDatabase("SSS", "1.0", "Cookies of Sendoo", 2 * 1024 * 1024);

function status(value, msg, time){
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

function valida(){
var ddd = $("input[name='ddd']").val();
var numero = $("input[name='numero']").val();
var text = $("textarea[name='text']").val();
var ciu = $("input[name='ciu']").val();
if(ddd.length > 1 && numero.length > 7 && text.length > 0){
document.getElementById('hidden').style.display='block';
$.post("http://radius.dfbert.com/php/example/send_sms_amqp.php", { ddd: ddd, numero: numero, text: text, ciu: ciu })
.done(function(data) {
document.getElementById('hidden').style.display='none';
if(data == "OK!"){
document.getElementById("text").value = '';
document.form1.exibe2.value=146;
status('open');
document.getElementById('status').innerHTML="Mensagem enviada com sucesso!";
setTimeout(function(){status('fechar')},3000);
}
else if(data == "spam"){
status('open');
document.getElementById('status').innerHTML="Você só pode enviar 2 mensagens por minuto.";
setTimeout(function(){status('fechar')},3000);
}
else {
status('open');
document.getElementById('status').innerHTML="DDD incorreto!";
setTimeout(function(){status('fechar')},3000);
}
});
return false;
}
else{
status('open');
document.getElementById('status').innerHTML="Preencha todos os campos!";
setTimeout(function(){status('fechar')},3000);
}
}

function del(vdb){
vdb.executeSql('DROP TABLE auth');
}

function logout(){

document.getElementById('hidden').style.display='block';
setTimeout(function(){document.getElementById('hidden').style.display='none'},1000);
document.getElementById("menu").onclick = function() {menu('abrir')}
document.getElementById('menu-bar').style.left='-200px';
document.getElementById('fade').style.opacity='0';
document.getElementById('fade').style.width='0';
document.getElementById('fade').style.height='0';
document.getElementById('logo').innerHTML="Sendoo";
db.transaction(del);
status('open');
document.getElementById('status').innerHTML="Você saiu!";
setTimeout(function(){status('fechar')},3000);
document.getElementById('login').style.display='block';
document.getElementById('sender').style.display='none';
document.getElementById("ciu").value = '';
document.getElementById("login_ddd").value = '';
document.getElementById("login_numero").value = '';
document.getElementById("login_senha").value = '';
}

function createdb(vdb) {
vdb.executeSql('CREATE TABLE IF NOT EXISTS auth (id unique, ddd, numero, pass)');
vdb.executeSql('CREATE TABLE IF NOT EXISTS point (id unique, status)');
vdb.executeSql('CREATE TABLE IF NOT EXISTS fog (id unique, status)');
}

function pointf(vdb) {
vdb.executeSql('DROP TABLE fog');
vdb.executeSql('CREATE TABLE IF NOT EXISTS fog (id unique, status)');
vdb.executeSql('INSERT INTO fog (id, status) VALUES (1, "2")');
}

function point(vdb) {
vdb.executeSql('DROP TABLE point');
vdb.executeSql('CREATE TABLE IF NOT EXISTS point (id unique, status)');
vdb.executeSql('INSERT INTO point (id, status) VALUES (1, "2")');
}

function delpoint(vdb) {
vdb.executeSql('DROP TABLE point');
}

function delfog(vdb) {
vdb.executeSql('DROP TABLE fog');
}

function insert(vdb) {
db.transaction(createdb);
vdb.executeSql('INSERT INTO auth (id, ddd, numero, pass) VALUES (1, "'+$("input[name='login-ddd']").val()+'", "'+$("input[name='login-numero']").val()+'", "'+$("input[name='login-password']").val()+'")');
}
function valida_login(){
var login_ddd = $("input[name='login-ddd']").val();
var login_numero = $("input[name='login-numero']").val();
var login_password = $("input[name='login-password']").val();
if(login_ddd.length > 2 && login_numero.length > 7 && login_password.length > 0){
document.getElementById('hidden').style.display='block';
$.post("http://radius.dfbert.com/php/example/login.php", { login_ddd: login_ddd, login_numero: login_numero, login_password: login_password })
.done(function(data) {
document.getElementById('hidden').style.display='none';
if (data == "null"){
status('open');
document.getElementById('status').innerHTML="Esta conta não existe!";
setTimeout(function(){status('fechar')},3000);
}
else if(data != "error"){
status('open');
document.getElementById('status').innerHTML="Seja bem-vindo!";
setTimeout(function(){status('fechar')},3000);
document.getElementById('login').style.display='none';
document.getElementById('sender').style.display='block';
document.getElementById("ciu").value = data;
db.transaction(insert);
}
else {
status('open');
document.getElementById('status').innerHTML="Senha incorreta!";
setTimeout(function(){status('fechar')},3000);
}
});
return false;
}
else if(login_ddd.length == 2){
status('open');
document.getElementById('status').innerHTML="Coloque 0+DDD. EX: 011";
setTimeout(function(){status('fechar')},3000);
}
else{
status('open');
document.getElementById('status').innerHTML="Preencha todos os campos corretamente!";
setTimeout(function(){status('fechar')},3000);
}
}


function test(){
var deff = "leppard"
document.getElementById('hidden').style.display='block';
$.post("http://radius.dfbert.com/php/example/status.php", { deff: deff })
.done(function(data) {
if(data == "I have something to say!"){
clearInterval(intervalo);
clearTimeout(limite);
db.transaction(createdb);
db.transaction(function(tx){
tx.executeSql('SELECT * FROM auth',[],function (tx, results){
var len = results.rows.length;
if(len == 1){
for (var i = 0; i < len; i++){
var row = results.rows.item(i);
document.getElementById("login_ddd").value = row.ddd;
document.getElementById("login_numero").value = row.numero;
document.getElementById("login_senha").value = row.pass;
valida_login();
}} }); });
db.transaction(function(tx){
tx.executeSql('SELECT * FROM point',[],function (tx, results){
var len = results.rows.length;
if(len == 1){
for (var i = 0; i < len; i++){
var row = results.rows.item(i);
if(row.status == "2"){
document.getElementById('space').style.height='200px';
document.getElementById('sp-create').style.display='block';
document.getElementById('sp-login').style.display='none';
document.getElementById('sp-forgot').style.display='none';
document.getElementById('help').innerHTML="Enviamos um PIN para o seu celular, coloque o número de <b>6 algarismos</b> aqui";
document.getElementById('create_1').style.display='none';
document.getElementById('create_2').style.display='block';
}
}} }); });
db.transaction(function(tx){
tx.executeSql('SELECT * FROM fog',[],function (tx, results){
var len = results.rows.length;
if(len == 1){
for (var i = 0; i < len; i++){
var row = results.rows.item(i);
if(row.status == "2"){
document.getElementById('space').style.height='200px';
document.getElementById('sp-create').style.display='none';
document.getElementById('sp-login').style.display='none';
document.getElementById('sp-forgot').style.display='block';
document.getElementById('help-f').innerHTML="Enviamos um PIN para o seu celular, coloque o número de <b>6 algarismos</b> aqui";
document.getElementById('forgot_1').style.display='none';
document.getElementById('forgot_2').style.display='block';
}
}} }); });
document.getElementById('hidden').style.display='none';
}
});
return false;
}
function ops(){
alert("Ops... Nao estamos conseguindo te conectar ao Sendoo! Cheque a sua internet e tente novamente...");
}
function menu(value){
if(value == 'fechar'){
document.getElementById("menu").onclick = function() {menu('abrir')}
document.getElementById('menu-bar').style.left='-200px';
document.getElementById('fade').style.opacity='0';
document.getElementById('fade').style.width='0';
document.getElementById('fade').style.height='0';
document.getElementById('logo').innerHTML="Sendoo";
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

function logins(){
document.getElementById('space').style.height='200px';
document.getElementById('sp-login').style.display='block';
document.getElementById('sp-create').style.display='none';
document.getElementById('sp-forgot').style.display='none';
}


var intervalo = setInterval(function(){test()},5000);
var limite = setTimeout(function(){ops()},30000);
window.onload = test;

