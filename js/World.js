var mouseControl = true;
var planePos = [0,0];
var anglePlane = 0;
var serverBox = [0,0,0,0];
//var MAX_PARTICLES = 20;
//var ANGLE_NEW_PARTICLES = 45; //degree

function World() {
	var camPos = [0,0];
	//var background;
	var backgroundPos = [0,0,0,0];
	/**
	* returns position of the object relative to the camera
	* pos : array [x,y]
	**/
	this.camera = function(pos) { 
		return [pos[0]-camPos[0], pos[1]-camPos[1]];
	}
	
	this.getCameraPos = function() {
		return camPos;
	}

	this.updateCameraPos = function(pos, angle){

		camPos = [pos[0]-canvasWidth/2, pos[1]-canvasHeight/2];
		anglePlane = angle;
		//console.log(pos, camPos);
	} 

	this.init = function(gs) {
		//background = new Background();
		//gs.addEntity(background);
	};

	this.updateParticles = function(angle, speed) {
		particleSpeed = speed;
		particleAngle = angle+PI;
	};


	this.draw = function(c,gs) {
		gs.clear();
		gs.background('rgba(40, 40, 40, 1.0)');

		c.rect(backgroundPos[0],backgroundPos[1],backgroundPos[2],backgroundPos[3]);

		// add linear gradient
		var grd = c.createLinearGradient(backgroundPos[0],backgroundPos[1],
		 								backgroundPos[0],backgroundPos[3]);
		// light blue
		grd.addColorStop(1, '#8ED6FF');   
		// dark blue
		grd.addColorStop(0, '#004CB3');
		//c.fillStyle = grd;
		c.fill();
		

		
		/*for(var i = camPos[0] ; i < camPos[0] + canvasWidth ; i++) {
			for(var j = camPos[1] ; j < camPos[1] + canvasHeight ; j++) {
				var a = sNoise.noise(i,j);
				drawPixel(i,j,227,227,227,a);
			}
		}
		*/
		updateCanvas();
		
	};
	
	this.update = function(gs) {

		backgroundOr = world.camera(serverBox); // nouvelle origine du background

		backgroundPos = [backgroundOr[0], backgroundOr[1], 
						serverBox[2] + backgroundOr[0], serverBox[3] + backgroundOr[1]];

/*		if(mouseControl) {
			gs.pointerPosition;
			planePos;

			var dist = distance(gs.pointerPosition, planePos);
			//console.log(dist);
			var angleMP = Math.abs(Math.atan2((gs.pointerPosition[1] - planePos[1]) , (planePos[0] - gs.pointerPosition[0]))-Math.PI) * (180 / Math.PI);
			//var angleMP = Math.atan2((planePos[1] - gs.pointerPosition[1]) , (gs.pointerPosition[0] - planePos[0])) + Math.PI //* (180 / Math.PI);

			var angleP = modPI(planePos[3])*(360/(2*Math.PI))
			console.log(angleMP-angleP);



		}*/
		/*
		if(aListParticles.length < MAX_PARTICLES) {
			var angleParticle = anglePlane + ((Math.random()*ANGLE_NEW_PARTICLES*2)-ANGLE_NEW_PARTICLES);
			var x = (Math.cos(angleParticle)*Math.sqrt(distanceMax))//+canvasWidth/3;
			var y = (Math.sin(angleParticle)*Math.sqrt(distanceMax))//+canvasHeight/3;

			var par = new Particles(x,y);
			aListParticles.push(par);
			//console.log(par)
			gs.addEntity(par);
		}
		*/
	};
	
	this.keyHeld_37 = function() {	//left

		connection.send(JSON.stringify({action:"T", value:"l"}));
	};
	
	this.keyHeld_39 = function() {	//right
		connection.send(JSON.stringify({action:"T", value:"r"}));
	};	
	
	this.keyHeld_38 = function() {	//up
		connection.send(JSON.stringify({action:"S", value:"p"}));
	};
	
	this.keyHeld_40 = function() {	//down
		connection.send(JSON.stringify({action:"S", value:"m"}));
	};

	this.keyDown_32 = function() {	//space
		connection.send(JSON.stringify({action:"F"}));
	};

	this.keyDown_16 = function() {	//shift
		console.log("shift held")
		connection.send(JSON.stringify({action:"B", value:"d"})); //boost
	};

	this.keyUp_16 = function() {	//shift
		console.log("shift up")
		connection.send(JSON.stringify({action:"B", value:"u"})); //boost
	};
}

function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

// That's how you update the canvas, so that your //
// modification are taken in consideration //
function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}