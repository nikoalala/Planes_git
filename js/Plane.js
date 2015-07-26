var cursordX = 10;
var cursordY = 10;
var nb_plane_draw = 0;

function Plane(sprite) {
	
	this.id = "";
	this.pseudo = ""
	this.FLY_FRAME = 2;
	this.sprite = new Sprite(["center", "center"], { 	
		"fly-right":[[sprite, 1],],
		"fly-hit":[["images/planeHit.gif",3],]
	}, $.proxy(function() {
		console.log("chargé");
		this.sprite.action("fly-right");
	},this));
	this.speed = 0;
	
	this.x = 0;
	this.y = 50;

	this.angle = 0; // rad	
	this.life = 5;
	

	this.init = function(gs) {

	};
	
	this.update = function() {
		this.sprite.action("fly-right");
		if(this.hit) {
			this.hit = false;
			this.sprite.action("fly-hit");
		}
		this.sprite.angle(this.angle)
		this.sprite.update();
	};
	
	this.draw = function(c,gs) {
		//console.debug("draw Plane");
		var planePosCam = world.camera([this.x,this.y]);
		nb_plane_draw++;
		//this.sprite.set_scale(2);
		c.font = "10px Arial";

		c.fillText(this.pseudo, world.camera([this.x,this.y])[0],world.camera([this.x,this.y-12])[1]);

		//console.log(planePosCam, world.getCameraPos())
		
		if(planePosCam[0] > canvasWidth) {
			if(planePosCam[1] < 0)
				drawCursor(canvasWidth-cursordX, cursordY, c);
			else if(planePosCam[1] >  canvasHeight)
				drawCursor(canvasWidth-cursordX, canvasHeight-cursordY, c);
			else
				drawCursor(canvasWidth-cursordX, planePosCam[1], c);
		} else if(planePosCam[0] < 0) {
			if(planePosCam[1] < 0)
				drawCursor(cursordX, cursordY, c);
			else if(planePosCam[1] > canvasHeight)
				drawCursor(cursordX, canvasHeight-cursordY, c);
			else
				drawCursor(cursordX, planePosCam[1], c);
		} else if(planePosCam[1] > canvasHeight) {

			if(planePosCam[0] < 0)
				drawCursor(cursordX, canvasHeight-cursordY, c);
			else if(planePosCam[0] > canvasWidth)
				drawCursor(canvasWidth-cursordX, canvasHeight-cursordY, c);
			else
				drawCursor(planePosCam[0], canvasHeight-cursordY, c);
			
		} else if(planePosCam[1] < 0) {

			if(planePosCam[0] < 0)
				drawCursor(cursordX, cursordY, c);
			else if(planePosCam[0] > canvasWidth)
				drawCursor(canvasWidth-cursordX, cursordY, c);
			else
				drawCursor(planePosCam[0], cursordY, c);
		}

		this.sprite.draw(c, planePosCam);
	};
}


function drawCursor(x,y, c) {
	var cursPos = [x,y]; // world.camera([x,y]);

	c.strokeStyle = 'rgb(0, 0, 0)';
	c.beginPath();
	c.arc(cursPos[0], cursPos[1], 2, 0, 2*Math.PI, true);
	c.closePath();
	c.stroke();
}