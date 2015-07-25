Array.prototype.destroy = function(obj){
	// Return null if no objects were found and removed
	var destroyed = null;

	for(var i = 0; i < this.length; i++){
		// Use while-loop to find adjacent equal objects
		while(this[i] === obj){
			// Remove this[i] and store it within destroyed
			destroyed = this.splice(i, 1)[0];
		}
	}

	return destroyed;
}

Array.prototype.existsPlaneID = function(id){
    for(var i = 0 ; i < this.length ; i++) {
        if(this[i].id == id) return this[i];
    }
    return false;
}


function distance(obj1, obj2) {
    return Math.pow((Math.floor(obj1[0])-Math.floor(obj2[0])),2)+Math.pow((Math.floor(obj1[1])-Math.floor(obj2[1])),2);
}

function modPI(a) {
	return (((a))%(2*Math.PI)+2*Math.PI)%(2*Math.PI)
}