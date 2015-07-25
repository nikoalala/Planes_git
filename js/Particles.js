var aListParticles = [];
var particleSize = 2;
var particleSpeed = 2;
var particleAngle = 0;

function Particles(x,y) {
	this.posX = x;
	this.posY = y;

	this.changeSpeed = function(s) {
		this.speed = s;
	}

	this.changeAngle = function(a) {
		this.angle = a;
	}

	this.init = function(gs) {

	};
	
	this.update = function() {
		var planePosCam = world.camera(planePos);

		if(distance([this.posX, this.posY], planePosCam) > Math.pow(canvasWidth/2, 2)) {
			gs.delEntity(this);
			aListParticles.destroy(this);
		} else {
        	this.posX+=Math.cos(particleAngle)*particleSpeed;
        	this.posY+=Math.sin(particleAngle)*particleSpeed;
        }
	};
	
	this.draw = function(c,gs) {
		c.fillStyle = 'rgb(0,0,255)';
		c.fillRect(this.posX, this.posY, particleSize, particleSize);
	}
}