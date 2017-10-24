function collide2d(p1, p2) {
	var p1x = p1.m * p1.v.x;
	var p1y = p1.m * p1.v.y;
	var p2x = p2.m * p2.v.x;
	var p2y = p2.m * p2.v.y;
	var k1 = p1.m * Math.sqrt(Math.pow(p1.v.x, 2) + Math.pow(p1.v.y, 2));
	var k1 = p2.m * Math.sqrt(Math.pow(p2.v.x, 2) + Math.pow(p2.v.y, 2));

	
}

function particle2d() {
	// Position
	this.p = new vector2d();
	// Velocity
	this.v = new vector2d();
	// Acceleration
	this.a = new vector2d();
	// Mass
	this.m = 0;
	// Elasticity
	this.k = 0;
}

function vector2d() {
	this.x = 0;
	this.y = 0;
}