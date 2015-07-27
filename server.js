var WebSocketServer = require('websocket').server;
var http = require('http');

var nb_message_send = 0;
var clients = {};
var gameBullets = [];
var PI = Math.PI;
var SECOND = 1000;
var FRAME_RATE = 70;
var MAX_BOOST_TIME = 0.3*FRAME_RATE; 
var REFRESH_BOOST = -5*FRAME_RATE
var V_MAX = 8;
var V_BOOST = 9;
var V_MIN = 2;
var BULLET_SPEED = 15;
var D_SPEED = 0.1;
var V_ANGLE = PI / 128;
var BULLET_LIFE = 5.0;
var D_BULLET_LIFE = 0.08;
var HIT_DISTANCE = 100;
var PLANE_INIT_STAT = {x:0,y:50,a:0,vx:0,vy:0};

var DEATH_TIMEOUT = 5 * SECOND;
var ratio = 1/1000;
var F_MIN = 20*ratio;
var F_MAX = 40*ratio;
var D_F = ratio;
var m = 1;
var G = 9.8*ratio;
var rho = 100;
var S = 1;
var Cx = 1.0003;
var Cz = 1;

var PLANE_LIFE = 5;

var WINDOW_SIZE = {w:2398, h:1798};

var box = [0, 0, WINDOW_SIZE.w*2, WINDOW_SIZE.h*2];

console.log("launch server");
var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(443, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});
var i = 0;
// WebSocket server
wsServer.on('request', function(request) {
    var timeoutBoost = null;
    var timeoutReload = null;
    var connection = request.accept(null, request.origin);
    connection.id = getID();
    
    sendToOne({type:"welcome", data:connection.id, world:{box:box}}, connection);
    
    initPlane(connection);
    connection.bullet = false;
    connection.hits = {from:0, to:0};
    connection.boost = MAX_BOOST_TIME;
    connection.shift = false;
    connection.life = PLANE_LIFE;

    clients[connection.id] = connection;

    connection.old_speed = null;

    console.log("new player");

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        var json;
        try {
            json = JSON.parse(message.utf8Data);

        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message);
            return;
        }

        if(json.action == "T") {
            if(json.value == "l") {
                connection.gamePlane.angle -= V_ANGLE;
                if(connection.gamePlane.angle< -PI) 
                    connection.gamePlane.angle += 2*PI
            } else if(json.value == "r") {
                connection.gamePlane.angle += V_ANGLE;
                if(connection.gamePlane.angle > PI) 
                    connection.gamePlane.angle -= 2*PI
            }
        } else if(json.action == "S") {
            if(json.value == "p") {
                if(connection.gamePlane.F < F_MAX)
                    connection.gamePlane.F += D_F;
            } else if(json.value == "m") {
                if(connection.gamePlane.F > F_MIN)
                    connection.gamePlane.F -= D_F;
            }
        } else if(json.action == "F") {
            connection.bullet = true;
        } else if(json.action == "P") {
            //console.log(json)
            connection.pseudo = json.value;
            //sendToAll({type:"pseudo", id:connection.id, data:connection.pseudo})
            sendToAll({type:"players", data: {players:getUsers()}});
        } else if(json.action == "B") {
            if(json.value == "d") {
                connection.shift = true;
            } else if(json.value == "u") {
                connection.shift = false;
            }
        }
    });

    connection.on('close', function(connection) {
        // close user connection
        console.log("player quit ", this.id);
        delete clients[this.id];
        sendToAll({type: "delete", data:this.gamePlane.id})        
    });
});


var interval = setInterval(function() {
    var date_start = new Date(); 
    var data = [];

    //BULLETS

    for(var b in gameBullets) {
        var bul = gameBullets[b];

        if(bul.l < 0) {
            gameBullets.splice(b,1);
        } else {
            bul.l-=D_BULLET_LIFE;

            bul.x+=Math.cos(bul.a)*bul.s;
            bul.y+=Math.sin(bul.a)*bul.s;
            data.push(bul);
        }
    }
    //PLANES
    for(var i in clients) {
        if(clients.hasOwnProperty(i) && !clients[i].dead) {
            

            //BOOST
           /* if(clients[i].shift == true) {

                if(clients[i].boost > 0) {
                    if(clients[i].old_speed == null) {
                        clients[i].old_speed = clients[i].gamePlane.F;
                        clients[i].gamePlane.F = V_BOOST;
                    }

                    clients[i].boost--;
                } else if (clients[i].boost < -5) {}
                else{
                    clients[i].boost = REFRESH_BOOST;
                    clients[i].gamePlane.F = clients[i].old_speed;
                }
            } else {
                if(clients[i].old_speed != null) {
                    clients[i].gamePlane.F = clients[i].old_speed;
                    clients[i].old_speed = null;
                }

                if(clients[i].boost < MAX_BOOST_TIME) {
                    console.log(clients[i].boost);
                    clients[i].boost++;
                }
            }*/


            var plane = clients[i].gamePlane;
            
            /*var angleMod = plane.angle;
            
            if(angleMod < 0) {
                if(angleMod < -Math.PI || angleMod > -(2*Math.PI)) {
                    if(plane.speed < V_MAX)
                        plane.speed += D_SPEED;
                } else {
                    if(plane.speed > V_MIN)
                        plane.speed -= D_SPEED;
                }
            } else {
                if(angleMod < Math.PI || angleMod > 0) {
                    if(plane.speed < V_MAX)
                        plane.speed += D_SPEED;
                } else {
                    if(plane.speed > V_MIN)
                        plane.speed -= D_SPEED;
                }
            }
*/

            var sina = Math.sin(plane.angle);
            var cosa = Math.cos(plane.angle);

            ax = (0.5*rho*S*Cz)*plane.vx - (0.5*rho*S*Cx)*plane.vx +  + plane.F*cosa 
            ay = (m*G) - (0.5*rho*S*Cx)*plane.vy + (0.5*rho*S*Cz)*plane.vy + plane.F*sina 

            plane.vx += ax;
            plane.vy += ay;

            plane.x += plane.vx;
            plane.y += plane.vy; 

           
            //console.log(angleMod, plane.speed);
                        //end of screen
            if(plane.x > WINDOW_SIZE.w || plane.x < 0 || plane.y > WINDOW_SIZE.h || plane.y < 0) {
                //TODO : suicide
                playerDie(clients[i]);
                clients[i].hits.from++;
                data.push({type:"event", message: (new Date()).toLocaleTimeString() + " : " + clients[i].pseudo + " has committed suicide!"});
            }
            
            data.push({type:"plane", id: plane.id, x:plane.x, 
                y:plane.y, sv:{vx: plane.vx, vy:plane.vy}, l: clients[i].life, a:plane.angle, s:Math.sqrt(Math.pow(plane.vx,2)+Math.pow(plane.vy,2))});


            if(clients[i].bullet) {
                
                clients[i].bullet = false;
                
                var bul = {type:"bullet", origin_id:plane.id, id:getBulletID(),
                    x:plane.x, y:plane.y, a:plane.angle, s:BULLET_SPEED, 
                    l:BULLET_LIFE};

                gameBullets.push(bul);
                data.push(bul);
            }


            //COLLISIONS

            for(var bul in gameBullets) {
                if(gameBullets.hasOwnProperty(bul)) {
                    if(gameBullets[bul].origin_id != clients[i].id) {
                        if(distance(gameBullets[bul], clients[i].gamePlane) < HIT_DISTANCE) {
                            var hitMsg = {type:"hit", from:gameBullets[bul].origin_id,
                            to:clients[i].id};
                            data.push(hitMsg);

                            clients[i].life--;

                            if(clients[i].life == 0) {
                                clients[i].hits.from++;
                                clients[gameBullets[bul].origin_id].hits.to++;
                                data.push({type:"event", message: (new Date()).toLocaleTimeString() + " : " + clients[i].pseudo + " killed by " + clients[gameBullets[bul].origin_id].pseudo + "!"});
                                
                                playerDie(clients[i]);
                            }

                            gameBullets[bul].l = -1;
                        }
                    }
                }
            }
            sendToAll({type:"players", data: {players:getUsers()}});
        }
    }


    sendToAll({type: "update", data:data});
    var date_end = new Date(); 
    //console.log(date_end-date_start, 1000/60)
}, SECOND/FRAME_RATE)

var count_idPlanes = 0;
function getID() {
    return "p"+(++count_idPlanes);
}

function initPlane(connection) {
    connection.gamePlane = {};
    connection.gamePlane.id = connection.id;
    connection.dead = false;
    resetPlane(connection);
}

function resetPlane(client) {
    client.life = PLANE_LIFE;

    client.gamePlane.x = Math.random()*WINDOW_SIZE.w*0.9+1;
    client.gamePlane.y = Math.random()*WINDOW_SIZE.h*0.9+1;

    var reverse = PLANE_INIT_STAT.a;

    if(client.gamePlane.x > WINDOW_SIZE.w/2) reverse = PLANE_INIT_STAT.a-Math.PI;

    client.gamePlane.angle = reverse;


    client.gamePlane.F = F_MIN;
    client.gamePlane.vx = PLANE_INIT_STAT.vx;
    client.gamePlane.vy = PLANE_INIT_STAT.vy;
}

function getBulletID() {
    return "b"+(++count_idPlanes);
}

function sendToAll(data) {
    nb_message_send++;
    var msg = JSON.stringify(data);
    //console.log(msg);
    for(var i in clients) {
        if(clients.hasOwnProperty(i)) {
            clients[i].send(msg);
        }
    }
}

function sendToOne(data, client) {
    var msg = JSON.stringify(data);
    client.send(msg);
}

function distance(obj1, obj2) {
    return Math.pow((obj1.x-obj2.x),2)+Math.pow((obj1.y-obj2.y),2);;
}

function getUsers() {
    var res = [];
    for(var c in clients) {
         if(clients.hasOwnProperty(c)) {
            res.push({id:clients[c].id, pseudo:clients[c].pseudo, hits:clients[c].hits});
        }
    }
    return res;
}

function playerDie(client) {
    client.dead = true;

    setTimeout(function() {
        resetPlane(client);
        client.dead = false;
    }, DEATH_TIMEOUT);
}

setInterval(function() {
    //console.log(nb_message_send);
    nb_message_send = 0;
},1000)
