//global weather mode constants
var WEATHER_NONE = 0;
var WEATHER_SNOW = 1;
var WEATHER_RAIN = 2;

//particle object
function Particle(x, y, z, weatherType){
	this.startPos = {"x": x, "y": y, "z": z};
	this.position = {"x": x, "y": y, "z": z};

	if(weatherType == WEATHER_SNOW){
		this.velocity = {"x": (Math.random()*0.1)-0.1, "y": Math.random()+0.4, "z": (Math.random()*0.1)-0.1};
	}else if(weatherType == WEATHER_RAIN){
		var signx = Math.random() < 0.5 ? -1 : 1;
		var signz = Math.random() < 0.5 ? -1 : 1;
		this.velocity = {"x": signx*Math.random()*0.1, "y": Math.random()+1.6, "z": signz*Math.random()*0.1};
		// this.velocity = {"x": 0, "y": Math.random()+0.6, "z": 0};
	}
	this.update = function(dt, endHeight) {
		this.position.x += this.velocity.x * dt;
		this.position.y -= this.velocity.y * dt;
		this.position.z += this.velocity.z * dt;
	}

	this.updateVelocity = function(newMode){
		if(newMode == WEATHER_SNOW){
			this.velocity = {"x": (Math.random()*0.1)-0.1, "y": (Math.random()*0.4)+0.1, "z": (Math.random()*0.1)-0.1};
		}else if(newMode == WEATHER_RAIN){
			var signx = Math.random() < 0.5 ? -1 : 1;
			var signz = Math.random() < 0.5 ? -1 : 1;
			this.velocity = {"x": signx*Math.random()*0.1, "y": Math.random()+0.6, "z": signz*Math.random()*0.1};
		}
	}

}


//particle system initializer, doesn't actually emit particles but rather scatters them across the map according to start pos and width/height
function Emitter(x, y, z, width, height, weatherType){
	
	this.totalParticles = 5000;
	this.particlePool = [];
	this.particleSize = 0.5; //arbitrary for now

	this.startHeight = y;
	this.endHeight = 0;

	this.vertices = [];
	this.indices = [];
	this.texture_coords = [];
	this.center_coords = [];

	this.weather = weatherType;

	if(this.weather == WEATHER_SNOW){
		this.particleSize = 0.5;
	}else if(this.weather == WEATHER_RAIN){
		this.particleSize = 3;
	}

	for( var i = 0; i < this.totalParticles; i++ ){
		var p = new Particle(x+Math.random()*width,y,z+Math.random()*height, this.weather);
		this.particlePool.push(p);
		addSquare(p.position.x, p.position.y, p.position.z, this.particleSize, this.vertices, this.indices, this.texture_coords, this.center_coords, this.weather);
	}

	this.update = function(dt) {

		var offset = 0;
		var dp = this.particleSize/2;
		for( var ii = 0; ii < this.totalParticles; ii++ ){
			var particle = this.particlePool[ii];
			if( particle.position.y <= this.endHeight ){
				particle.position.x = particle.startPos.x;
				particle.position.y = this.startHeight;
				particle.position.z = particle.startPos.z;
			}
			offset = 12*ii;
			particle.update(dt);

			this.vertices[offset+0] = particle.position.x;
			this.vertices[offset+3] = particle.position.x+this.particleSize;
			this.vertices[offset+6] = particle.position.x+this.particleSize;
			this.vertices[offset+9] = particle.position.x;

			this.vertices[offset+1] = particle.position.y;
			this.vertices[offset+4] = particle.position.y;
			this.vertices[offset+7] = particle.position.y+this.particleSize;
			this.vertices[offset+10] = particle.position.y+this.particleSize;

			this.vertices[offset+2] = particle.position.z;
			this.vertices[offset+5] = particle.position.z;
			this.vertices[offset+8] = particle.position.z;
			this.vertices[offset+11] = particle.position.z;

			//updating centers
			this.center_coords[offset+0] = particle.position.x+dp;
			this.center_coords[offset+3] = particle.position.x+dp;
			this.center_coords[offset+6] = particle.position.x+dp;
			this.center_coords[offset+9] = particle.position.x+dp;

			this.center_coords[offset+1] = particle.position.y+dp;
			this.center_coords[offset+4] = particle.position.y+dp;
			this.center_coords[offset+7] = particle.position.y+dp;
			this.center_coords[offset+10] = particle.position.y+dp;

			this.center_coords[offset+2] = particle.position.z;
			this.center_coords[offset+5] = particle.position.z;
			this.center_coords[offset+8] = particle.position.z;
			this.center_coords[offset+11] = particle.position.z;

		}
	}

	this.updateMode = function(newMode){
		//console.log(newMode == WEATHER_SNOW);
		//console.log(newMode == WEATHER_RAIN);
		this.weather = newMode;
		if(newMode == WEATHER_SNOW){
			this.particleSize = 0.5;
		}else if(newMode == WEATHER_RAIN){
			this.particleSize = 3;
		}
		for(var i = 0; i < this.totalParticles; i++ ){
			this.particlePool[i].updateVelocity(newMode);
		}
	}
}

//adds vertices of the particle, these are billboards so just quads
function addSquare(llx, lly, llz, len, vbuffer, ibuffer, tbuffer, cbuffer, weatherType){
	var c = vbuffer.length/3;
	vbuffer.push(llx, lly, llz, llx+len, lly, llz, llx+len, lly+len, llz, llx, lly+len, llz);
	ibuffer.push(c, c+1, c+2, c+2, c+3, c);
	tbuffer.push(0,0,1,0,1,1,0,1);
	cbuffer.push(llx+len/2, lly+len/2, llz, llx+len/2, lly+len/2, llz, llx+len/2, lly+len/2, llz, llx+len/2, lly+len/2, llz);
	//try to do this without duplicated centers
}
