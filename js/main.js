var PI = Math.PI;
var gs;
var r;
var myPlayerID;
var world;
var canvasHeight;
var canvasWidth; 
var ctx;
var canvasData;
var sNoise;

var distanceMax;

var old_framecount = 0;

function startGame(gs) {
    // our game entity
    r = new SeedableRandom();
    var d = new Date;
    r.seed(d.getTime());

    world = new World();
    gs.addEntity(world);

}

function launch() {
    sNoise = PerlinSimplex;

    Prng.seed = 282;
    sNoise.setRng(Prng);
    sNoise.noiseDetail(3,.5);

    

    var mobile_offset = mobile == true ? 200 : 0;
    //$("#rightSideContent").
    canvasHeight = 600;// window.innerHeight - 200 - mobile_offset; //window.innerHeight pour firefox qui n'aime pas $(window).height()...
    canvasWidth = 800;//$("#surface").width();

    distanceMax = Math.pow(canvasWidth/2, 2) + Math.pow(canvasHeight/2, 2);
    
    console.log($(document).height())
    // grab the surface div and insert a canvas of the same size inside it
    var surface = document.getElementById("surface");
    var newcanvas = document.createElement("canvas");
    // set the width and height of our canvas to be the same as the container div
    newcanvas.width = 800;//newcanvas.width = (canvasWidth);
    newcanvas.height = 600; //newcanvas.height = (canvasHeight);
    surface.appendChild(newcanvas);

    ctx = newcanvas.getContext("2d");
    canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    // launch the gamesoup loop on the new canvas we just created
    gs = new JSGameSoup(newcanvas, 60);
    startGame(gs);
    gs.launch();


    setInterval(function() {
        var fps = gs.frameCount - old_framecount;
        old_framecount = gs.frameCount;
        $("#framerateSpan").html(fps);

        $("#socketrateSpan").html(nb_socket_message);
        nb_socket_message = 0;

        $("#nb_plane_drawSpan").html(nb_plane_draw);
        nb_plane_draw = 0
    }, 1000);
}