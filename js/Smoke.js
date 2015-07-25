var smokeStrength = [];
for (var r=0; r<50; r++) {
	smokeStrength[r] = 'rgba(204, 50, 50, ' + (r/50) + ')';
}
	
function Smoke(x, y, a, s, life, origin_id, id) {
	this.x = x;
	this.y = y;
	this.angle = a;
	this.life = life;
	this.speed = s;
	this.origin_id = origin_id;
	this.id = id;
	
	this.draw = function(c) {
		console.debug("draw Smoke");
		c.strokeStyle = smokeStrength[Math.floor(this.life * 10)];
		c.beginPath();
		c.arc(world.camera([this.x,this.y])[0], world.camera([this.x,this.y])[1], 2, 0, 2*Math.PI, true);
		c.closePath();
		c.stroke();
	}
	
	this.update = function() {
		if (this.life < 0)
		{
			gs.delEntity(this);

		} 
	}
}











