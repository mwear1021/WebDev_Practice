const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

// Game state variables
let isRunning = true;
let player, bullets;
let enemies = [];

// Create objects for the player, enemies, and bullets.
class GameObject {
    constructor(x, y, width, height, sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }

    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

class Player extends GameObject {
    constructor(x, y) {
        super(x, y - 40, 50, 75, playerSprite);
        this.speed = 8;
    }

    moveLeft() {
        if (this.x > 0) this.x -= this.speed;
    }

    moveRight() {
        if (this.x + this.width < GAME_WIDTH) this.x += this.speed;
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y, 25, 25, enemySprite);
        this.speed = 0.75;
    }

    move() {
        this.y += this.speed;
    }
}
class Bullet extends GameObject {
    constructor(x, y) {
        super(x, y, 20, 40, laserSprite);
        this.speed = -7;
    }

    move() {
        this.y += this.speed;
    }
}
// initialize game entities
function initializeGame() {
    player = new Player(GAME_WIDTH / 2 - 20, GAME_HEIGHT - 40);
    bullets = [];
    enemies = [];
    startEnemyStream();
}

// initialize enmemies
function spawnEnemies() {
    let xPos = Math.random() * (GAME_WIDTH / 2.5) + 30; // keep enemies on left side
    let yOffset = -20; // start above the game window
    enemies.push(new Enemy(xPos, yOffset));
}

// start enemy stream
function startEnemyStream() {
    setInterval(spawnEnemies, 200); // spawn enemies at regular intervals
}

// update enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.move();
        if (enemy.y > GAME_HEIGHT) {
            enemies.splice(index, 1); // remove off-screen enemies
        }
    });
}

// handle input
let keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update game state
function update() {
    // player movement
    if (keys['ArrowLeft']) player.moveLeft();
    if (keys['ArrowRight']) player.moveRight();

    // update bullets
    bullets.forEach((bullet, bulletIndex) => {
        bullet.move();

        // check collision with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (isColliding(bullet, enemy)) {
                //remove bullet and enemy
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);

                return;
            }
        });

        //remove bullets off screen
        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
            
        }
    });

    // move enemies
    updateEnemies();
}

 
// render the game
function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    player.draw();

    bullets.forEach((bullet) => bullet.draw());
    enemies.forEach((enemy) => enemy.draw());
}

// load sprites
const playerSprite = new Image();
playerSprite.src = 'sprites\\small-ship.png';

const enemySprite = new Image();
enemySprite.src = 'sprites\\small-alien.png';

const laserSprite = new Image();
laserSprite.src = 'sprites\\laser.png';

// game loop
function gameLoop() {
    if (!isRunning) return;

    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function autoFire() {
    setInterval(() => {
        bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
    }, 140); // fire a bullet every x ms (adjust as needed)
}

// detect collisions
function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// initialize and start
initializeGame();
autoFire();
gameLoop();