var planes = [];
var bullets = [];

var hits= {from:0, to:0};

function handleMsg(json) {
    if(json.type == "update") {
        handleUpdateMsg(json);
    } else if(json.type == "delete") {
        handleDeleteMsg(json)
    } else if(json.type == "welcome") {
        welcome = true;
        //console.log(json);
        var data = json.data; 
        myPlayerID = data;
        serverBox = json.world.box;
    } else if(json.type == "players") {
        //console.log(json);
        var players=json.data.players;
        for(var p in players) {
            if(players.hasOwnProperty(p)) {
                refreshPlayer(players[p])
            }
        }
    } else if (json.type == "death") {
        handleDeathMsg(json);
    }
}

function refreshHit() {
    $("#counterFrom").html(hits.from);
    $("#counterTo").html(hits.to);
}

function refreshPlayer(player) {
    if(planes.existsPlaneID(player.id)) {
        planes.existsPlaneID(player.id).pseudo = player.pseudo;
    }
    
    var player$ = $(".player[data-id="+player.id+"]");
    if(player$.length == 0) { //create 
        var html = "<li class='player' data-id='"+player.id+"'>"
        +player.pseudo +" : " + player.hits.from +" / " + player.hits.to
        +"</li>";
        $("#listPlayers").append(html)
    } else { //update
        player$.html(player.pseudo +" : " + player.hits.from +" / " + player.hits.to)
    }


}
function deletePlayerStats(id) {
    $(".player[data-id="+id+"]").remove();
}

function handleDeathMsg(json) {
    var id = json.player;

    var plane = planes.existsPlaneID(id);
    if(plane)
        plane.die();
}

function handleUpdateMsg(json) {
    var datas = json.data;
    for(var i = 0 ; i < datas.length ; i++) {
        var data = datas[i];

        if(data.type == "plane") {
            handlePlaneMsg(data);
        } else if(data.type == "bullet") {
            handleBulletMsg(data);                    
        } else if(data.type == "hit") {
            handleHitMsg(data);
        } if(data.type == "event") {
            handleEventMsg(data);
        }             
    }
}

function handleEventMsg(data) {
    var listEvent = $("#listEvents");

    listEvent.append("<li>"+data.message+"</li>");

    if($("#listEvents li").length > 5)
        $("#listEvents li")[0].remove();
}

function handlePlaneMsg(data) {
     var plane = planes.existsPlaneID(data.id);
    if(plane) {

        plane.updateData(data.x, data.y, data.a, data.s, data.sv, data.l);
        ////console.log("update plane "+data.id)
        plane.x = data.x;
        plane.y = data.y;
        plane.angle = data.a;
        plane.speed = data.s;
        plane.speedVector = data.sv; //{vx, vy}
        plane.life = data.l;

        if(data.id == myPlayerID) {
            planePos = [data.x, data.y, data.s, data.a];
            world.updateCameraPos([data.x, data.y], plane.angle);
            world.updateParticles(plane.angle, plane.speed);
        }

    } else {
        if(myPlayerID == undefined) return;
        //console.log("create plane "+data.id, myPlayerID, data.id == myPlayerID);

        var p_sprite = "images/planeV2.png"
        if(data.id == myPlayerID) 
            p_sprite = "images/planeV2.png"

        //console.log(p_sprite);

        plane = new Plane(p_sprite);
        plane.id = data.id;
        plane.x = data.x;
        plane.y = data.y;
        plane.angle = data.a;

        if(data.id == myPlayerID) 
            plane.me = true;

        gs.addEntity(plane);


        planes.push(plane);
        //console.log(planes)
    }
}

function handleBulletMsg(data) {

    var bullet = bullets.existsPlaneID(data.id);
    if(bullet) {
            bullet.x = data.x;
            bullet.y = data.y;
            bullet.life = data.l;

        if(bullet.life < 0) {
            bullets.destroy(bullet);
        }
    } else {
        bullet = new Smoke(data.x, data.y, 
            data.a, data.s, data.l, 
            data.origin_id, data.id);
        bullets.push(bullet);
        gs.addEntity(bullet);
    }
}

function handleHitMsg(data) {
    if(data.from == myPlayerID) {
        hits.from++;
    } else if(data.to == myPlayerID) {
        hits.to++;
    }
    refreshHit();
    var plane = planes.existsPlaneID(data.to);
    plane.hit = true;
}

function handleDeleteMsg(json) {
    var plane = planes.existsPlaneID(json.data);
    planes.destroy(plane);
    gs.delEntity(plane);
    deletePlayerStats(plane.id);
}

function updatePlayerStats(player) {

}
