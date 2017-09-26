var players = [];

var playerCount = 500;

var playerRadius = 20;

var playersLeft = 10;

var playerGrowthTime = 60 * 10;

var velocity = 1;

var ctx = document.getElementById('playField');
ctx.width = document.body.clientWidth;
var w = ctx.width / 2;
ctx.height = document.body.clientHeight;
var h = ctx.height / 2;
ctx = ctx.getContext('2d');

init();

function init() {
  addPlayers(playerCount);
  ctx.translate(w, h);
  window.requestAnimationFrame(draw);
}

function addPlayers(count) {
  for (var i = 0; i < count; i++) {
    var np = new player((Math.random() - .5) * 2 * w, (Math.random() - .5) * 2 * h);
    np.growth = playerRadius / playerGrowthTime;
    np.growthTime = playerGrowthTime;
    np.radius = 0;
    players.push(np);
  }
}

function draw() {
  ctx.clearRect(-w, -h, 2 * w, 2 * h);

  players.forEach((e) => {
    drawplayer(e, ctx, w, h);
  });

  eat(players);

  if (players.length <= playersLeft) {
    players.forEach((e) => {
      e.growth = Math.abs(e.growth) * -1;
      e.canEat = false;
    });
    addPlayers(playerCount - playersLeft);
  }

  document.getElementById("count").innerText = players.length;

  window.requestAnimationFrame(draw);
}

function player(x, y) {
  this.x = x;
  this.y = y;
  this.radius = playerRadius;
  this.xv = Math.random() - .5;
  this.yv = Math.random() - .5;
  this.color = getRandomColor();
  this.growth = 0;
  this.growthTime = 0;
  this.canEat = true;
}

function drawplayer(player, ctx, w, h) {
  player.x = player.x + player.xv * velocity;
  player.y = player.y + player.yv * velocity;

  if (!player.canEat && player.radius <= playerRadius + 5) {
    player.growth = 0
    player.canEat = true;
  }

  if (player.growthTime >= 1) {
    player.radius += player.growth;
    if (player.radius <= 0) {
      player.radius = 0;
    }
    player.growthTime--;
  }
  else {
    player.growth = 0;
  }

  if (player.x > w - player.radius) {
    //player.x = w - player.radius;
    player.xv = Math.abs(player.xv) * -1;
  }
  if (player.x < -w + player.radius) {
    // player.x = -w + player.radius;
    player.xv = Math.abs(player.xv);
  }
  if (player.y > h - player.radius) {
    // player.y = h - player.radius;
    player.yv = Math.abs(player.yv) * -1;
  }
  if (player.y < -h + player.radius) {
    // player.y = -h + player.radius;
    player.yv = Math.abs(player.yv);
  }

  if (Math.abs(player.xv) < 1) {
    player.xv += (Math.random() - .5) * 2;
  }
  if (Math.abs(player.yv) < 1) {
    player.yv += (Math.random() - .5) * 2;
  }

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = player.color;
  ctx.fill();
}

function eat(players) {
  for (var i = 0; i < players.length; i++) {
    for (var j = i + 1; j < players.length; j++) {
      var p1 = players[i];
      var p2 = players[j];
      var d = distance(p1, p2);
      if (d - p1.radius - p2.radius <= 0) {
        var rf = Math.sqrt(Math.pow(p1.radius, 2) + Math.pow(p2.radius, 2)) / playerGrowthTime;
        if (p1.radius >= p2.radius) {
          if (p1.canEat) {
            p1.growth += rf;
            p1.growthTime += playerGrowthTime;
            players.splice(j, 1);
          }
        }
        else {
          if (p2.canEat) {
            p2.growth += rf;
            p2.growthTime += playerGrowthTime;
            players.splice(i, 1);
          }
        }
      }
    }
  }
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}