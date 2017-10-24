var canvas;
var w;
var h;
var circles = [];
var circleCount = 50;
var circleRadius = 20;
var gravity = new vector(0, -.1);
var collisionAbsorbance = .8;
var airFriction = 1;
var t = 0;
var paused = false;

function init() {
	var ctx = document.getElementById('playField');
	ctx.width = document.body.clientWidth;
	ctx.height = document.body.clientHeight;

	document.onkeyup = (e) => {
		if (e.keyCode === 32) {
			paused = !paused;
			if (!paused) {
				update();
			}
		}
	};

	w = ctx.width / 2;
	h = ctx.height / 2;

	canvas = ctx.getContext('2d');
	canvas.translate(w, h);
	canvas.scale(1, -1);

	addCircles(circles, circleCount);

	window.requestAnimationFrame(update);
}

function update() {
	t++;
	canvas.clearRect(-w, -h, 2 * w, 2 * h);

	circles.forEach((c) => {
		drawCircle(c);
		airResistance(c);
		updateCirclePos(c);
		wallBounce(c);

		// var add = Math.sin(t / 20) / 10;
		// if (Math.abs(c.vel.y/c.vel.x) > 1) {
		// 	c.vel.x += add;
		// }
		// c.vel.y += add;
		if (c.pos.y - c.radius < -h + .1 && Math.random() > .99) {
			c.vel.y += Math.random() * -gravity.y * 150;
			c.vel.x += (Math.random() - .5) * 20;
		}
	});
	//ballCollision(circles);
	if (!paused) {
		window.requestAnimationFrame(update);
	}
}

function addCircles(circles, count) {
	var h2 = h * 2;
	var w2 = w * 2;
	for (var i = 0; i < count; i++) {
		var c = new circle((Math.random() - .5) * w2, (Math.random() - .5) * h2, Math.random() * circleRadius + 5, getRandomColor());
		c.acc = gravity;
		c.vel = new vector((Math.random() - .5) * 5, (Math.random()) * 5);
		circles.push(c);
	}
}

function circle(x, y, radius, color) {
	this.pos = new vector(x, y);
	this.vel = new vector(0, 0);
	this.acc = new vector(0, 0);
	this.radius = radius;
	this.color = color;
}

function vector(x, y) {
	this.x = x;
	this.y = y;
}

function drawCircle(c) {
	canvas.beginPath();
	canvas.arc(c.pos.x, c.pos.y, c.radius, 0, 2 * Math.PI, false);
	canvas.fillStyle = c.color;
	canvas.fill();
}

function updateCirclePos(circle) {
	circle.vel.x += circle.acc.x;
	circle.vel.y += circle.acc.y;
	circle.pos.x += circle.vel.x;
	circle.pos.y += circle.vel.y;
}

function wallBounce(circle) {
	if (circle.pos.x > w - circle.radius) {
		circle.pos.x = w - circle.radius;
		circle.vel.x = Math.abs(circle.vel.x) * -collisionAbsorbance;
	}
	if (circle.pos.x < -w + circle.radius) {
		circle.pos.x = -w + circle.radius;
		circle.vel.x = Math.abs(circle.vel.x) * collisionAbsorbance;
	}
	if (circle.pos.y > h - circle.radius) {
		circle.pos.y = h - circle.radius;
		circle.vel.y = Math.abs(circle.vel.y) * -collisionAbsorbance;
	}
	if (circle.pos.y < -h + circle.radius) {
		circle.pos.y = -h + circle.radius;
		circle.vel.y = Math.abs(circle.vel.y) * collisionAbsorbance;
	}
}

function ballCollision(circles) {
	for (var i = 0; i < circles.length; i++) {
		for (var j = i + 1; j < circles.length; j++) {
			var c1 = circles[i];
			var c2 = circles[j];
			var d = distance(c1, c2) - c1.radius - c2.radius;
			if (d <= 0) {
				var m1 = Math.pow(c1.radius, 2);
				var m2 = Math.pow(c2.radius, 2);

				var radiusRatio1 = m1 / m2;
				var radiusRatio2 = m2 / m1;

				var mtm1x = m1 * c1.vel.x;
				var mtm2x = m2 * c2.vel.x;

				var ke1x = m1 * Math.pow(c1.vel.x, 2) / 2;
				var ke2x = m2 * Math.pow(c2.vel.x, 2) / 2;



				if (c1.pos.x < c2.pos.x) {
					c1.vel.x = Math.abs(c1.vel.x) * -collisionAbsorbance / (radiusRatio1 * c1.vel.x);
					c2.vel.x = Math.abs(c2.vel.x) * collisionAbsorbance / (radiusRatio2 * c2.vel.x);
				} else {
					c1.vel.x = Math.abs(c1.vel.x) * collisionAbsorbance / (radiusRatio1 * c1.vel.x);
					c2.vel.x = Math.abs(c2.vel.x) * -collisionAbsorbance / (radiusRatio2 * c2.vel.x);
				}
				if (c1.pos.y < c2.pos.y) {
					c1.vel.y = Math.abs(c1.vel.y) * -collisionAbsorbance / (radiusRatio1 * c1.vel.y);
					c2.vel.y = Math.abs(c2.vel.y) * collisionAbsorbance / (radiusRatio2 * c2.vel.y);
				} else {
					c1.vel.y = Math.abs(c1.vel.y) * collisionAbsorbance / (radiusRatio1 * c1.vel.y);
					c2.vel.y = Math.abs(c2.vel.y) * -collisionAbsorbance / (radiusRatio2 * c2.vel.y);
				}
			}
		}
	}
}

function airResistance(circle) {
	if (circle.vel.x != 0) {
		circle.vel.x *= airFriction;
	}
	if (circle.vel.y != 0) {
		circle.vel.y *= airFriction;
	}
}

function distance(c1, c2) {
	return Math.sqrt(Math.pow(c2.pos.x - c1.pos.x, 2) + Math.pow(c2.pos.y - c1.pos.y, 2));
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

init();