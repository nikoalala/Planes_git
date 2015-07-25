// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

var loc = window.location;
var nb_socket_message = 0
var connection = new WebSocket('ws://'+loc.host+':443');

connection.onopen = function () {
    // connection is opened and ready to use
    if(!localStorage.pseudo) {
        var p = window.prompt("Who are you ?","");
        localStorage.pseudo = p;
    }
    connection.send(JSON.stringify({action:"P", value:localStorage.pseudo}));
};

connection.onerror = function (error) {
    // an error occurred when sending/receiving data
};

connection.onmessage = function (message) {
    // try to decode json (I assume that each message from server is json)
    nb_socket_message++;
    var json;
    try {
        json = JSON.parse(message.data);
    } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message);
        return;
    }
    handleMsg(json); 
};