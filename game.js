const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

let player = { x: 400, y: 300, size: 20, speed: 4 };
let enemies = [];
let bullets = [];
let keys = {};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function update() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  enemies.forEach((enemy) => {
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    enemy.x += (dx / distance) * enemy.speed;
    enemy.y += (dy / distance) * enemy.speed;
  });

  bullets.forEach((bullet, index) => {
    bullet.x += bullet.dx * bullet.speed;
    bullet.y += bullet.dy * bullet.speed;

    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(index, 1);
    }
  });

  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      let dx = bullet.x - enemy.x;
      let dy = bullet.y - enemy.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < enemy.size) {
        enemies.splice(enemyIndex, 1);
        bullets.splice(bulletIndex, 1);
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "red";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });

  ctx.fillStyle = "yellow";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
  });
}

function spawnEnemy() {
  let x = Math.random() > 0.5 ? 0 : canvas.width;
  let y = Math.random() * canvas.height;
  enemies.push({ x, y, size: 20, speed: 2 });
}

function shootBullet() {
  if (enemies.length > 0) {
    let target = enemies[0];
    let dx = target.x - player.x;
    let dy = target.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let bulletSpeed = 5;
    bullets.push({
      x: player.x,
      y: player.y,
      size: 5,
      speed: bulletSpeed,
      dx: dx / distance,
      dy: dy / distance,
    });
  }
}

setInterval(spawnEnemy, 2000);
setInterval(shootBullet, 1000);

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
