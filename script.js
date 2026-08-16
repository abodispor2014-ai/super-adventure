"use strict";

/* =========================================================
   SUPER ADVENTURE 3.0
   SCRIPT.JS - نسخة مصححة وكاملة
========================================================= */

/* =========================================================
   CANVAS
========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let VIEW_W = window.innerWidth;
let VIEW_H = window.innerHeight;
let DPR = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
    VIEW_W = window.innerWidth;
    VIEW_H = window.innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = VIEW_W * DPR;
    canvas.height = VIEW_H * DPR;

    canvas.style.width = VIEW_W + "px";
    canvas.style.height = VIEW_H + "px";

    ctx.setTransform(
        DPR,
        0,
        0,
        DPR,
        0,
        0
    );
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


/* =========================================================
   UI
========================================================= */

const ui = {
    mainMenu: document.getElementById("mainMenu"),
    mapScreen: document.getElementById("mapScreen"),
    shopScreen: document.getElementById("shopScreen"),
    helpScreen: document.getElementById("helpScreen"),

    gameOverScreen:
        document.getElementById("gameOverScreen"),

    winScreen:
        document.getElementById("winScreen"),

    lives:
        document.getElementById("lives"),

    coins:
        document.getElementById("coins"),

    score:
        document.getElementById("score"),

    level:
        document.getElementById("level"),

    power:
        document.getElementById("power"),

    message:
        document.getElementById("message"),

    levelList:
        document.getElementById("levelList"),

    shopCoins:
        document.getElementById("shopCoins"),

    finalScore:
        document.getElementById("finalScore"),

    finalCoins:
        document.getElementById("finalCoins"),

    winScore:
        document.getElementById("winScore")
};


/* =========================================================
   SAVE
========================================================= */

const SAVE_KEY = "super_adventure_3_save";

let saveData = {
    unlockedLevel: 1,
    bestScore: 0,
    totalCoins: 0,
    extraLives: 0,
    shields: 0,
    doublePoints: 0,
    speedBoost: 0,
    completed: []
};

try {
    const saved = localStorage.getItem(SAVE_KEY);

    if (saved) {
        saveData = {
            ...saveData,
            ...JSON.parse(saved)
        };
    }
} catch (error) {
    console.warn("تعذر تحميل الحفظ", error);
}

function saveGame() {
    try {
        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(saveData)
        );
    } catch (error) {
        console.warn("تعذر حفظ اللعبة", error);
    }
}


/* =========================================================
   LEVELS
========================================================= */

const LEVELS = [
    {
        name: "الغابة الخضراء",
        length: 4200,
        difficulty: 1,
        skyTop: "#65c8ff",
        skyBottom: "#e5f9ff",
        ground: "#46a83f",
        platform: "#89582f"
    },

    {
        name: "الصحراء",
        length: 4800,
        difficulty: 1.15,
        skyTop: "#f8bd69",
        skyBottom: "#ffe8ad",
        ground: "#c8953e",
        platform: "#8e5b2e"
    },

    {
        name: "قلعة الظلام",
        length: 5200,
        difficulty: 1.3,
        skyTop: "#312b59",
        skyBottom: "#6b426c",
        ground: "#49383b",
        platform: "#68423a"
    },

    {
        name: "الجبال",
        length: 5600,
        difficulty: 1.4,
        skyTop: "#7bd0ff",
        skyBottom: "#dff5ff",
        ground: "#628d55",
        platform: "#65533d"
    },

    {
        name: "الكهف",
        length: 6000,
        difficulty: 1.5,
        skyTop: "#17182d",
        skyBottom: "#34344f",
        ground: "#30343b",
        platform: "#55505a"
    },

    {
        name: "البركان",
        length: 6200,
        difficulty: 1.65,
        skyTop: "#3b1111",
        skyBottom: "#8b2b18",
        ground: "#402b27",
        platform: "#6d4031"
    },

    {
        name: "السماء",
        length: 6400,
        difficulty: 1.7,
        skyTop: "#75cfff",
        skyBottom: "#f1fbff",
        ground: "#73a1b8",
        platform: "#8e7d65"
    },

    {
        name: "الغابة الليلية",
        length: 6600,
        difficulty: 1.8,
        skyTop: "#07172b",
        skyBottom: "#15385a",
        ground: "#1c4d35",
        platform: "#57452d"
    },

    {
        name: "قلعة النار",
        length: 7000,
        difficulty: 1.9,
        skyTop: "#190707",
        skyBottom: "#651b10",
        ground: "#34201e",
        platform: "#58332b"
    },

    {
        name: "المملكة",
        length: 7300,
        difficulty: 2,
        skyTop: "#4169e1",
        skyBottom: "#d6e8ff",
        ground: "#388246",
        platform: "#76532f"
    },

    {
        name: "الطريق الأخير",
        length: 7600,
        difficulty: 2.1,
        skyTop: "#202040",
        skyBottom: "#50375f",
        ground: "#38333e",
        platform: "#62505c"
    },

    {
        name: "المعركة النهائية",
        length: 8000,
        difficulty: 2.25,
        skyTop: "#120000",
        skyBottom: "#5c1008",
        ground: "#251515",
        platform: "#4a2823"
    }
];


/* =========================================================
   GAME VARIABLES
========================================================= */

let currentLevel = 1;

let gameRunning = false;
let gamePaused = false;

let score = 0;
let levelCoins = 0;
let lives = 3;

/* هذا هو الإصلاح المهم */
let powerType = "عادي";

let cameraX = 0;

let platforms = [];
let enemies = [];
let coins = [];
let powerUps = [];
let particles = [];

let goal = null;

let messageTimeout = null;


/* =========================================================
   PLAYER
========================================================= */

const player = {
    x: 120,
    y: 300,

    width: 42,
    height: 62,

    velocityX: 0,
    velocityY: 0,

    acceleration: 0.75,
    friction: 0.82,

    jumpPower: 13,

    grounded: false,

    facing: 1,

    big: false,

    star: 0,

    firePower: 0,

    invincible: 0
};


/* =========================================================
   INPUT
========================================================= */

const input = {
    left: false,
    right: false,
    run: false,
    jumpPressed: false,
    firePressed: false
};


/* =========================================================
   KEYBOARD
========================================================= */

window.addEventListener("keydown", function(event) {

    if (
        event.code === "ArrowLeft" ||
        event.code === "KeyA"
    ) {
        input.left = true;
    }

    if (
        event.code === "ArrowRight" ||
        event.code === "KeyD"
    ) {
        input.right = true;
    }

    if (
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight"
    ) {
        input.run = true;
    }

    if (
        event.code === "ArrowUp" ||
        event.code === "Space" ||
        event.code === "KeyW"
    ) {
        if (!event.repeat) {
            input.jumpPressed = true;
        }

        event.preventDefault();
    }

    if (
        event.code === "KeyF" ||
        event.code === "KeyJ"
    ) {
        input.firePressed = true;
    }

    if (event.code === "Escape") {
        togglePause();
    }

});


window.addEventListener("keyup", function(event) {

    if (
        event.code === "ArrowLeft" ||
        event.code === "KeyA"
    ) {
        input.left = false;
    }

    if (
        event.code === "ArrowRight" ||
        event.code === "KeyD"
    ) {
        input.right = false;
    }

    if (
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight"
    ) {
        input.run = false;
    }

    if (
        event.code === "KeyF" ||
        event.code === "KeyJ"
    ) {
        input.firePressed = false;
    }

});


/* =========================================================
   MOBILE BUTTONS
========================================================= */

function setupHoldButton(id, property) {

    const button = document.getElementById(id);

    if (!button) return;

    const start = function(event) {

        event.preventDefault();

        input[property] = true;
    };

    const stop = function(event) {

        event.preventDefault();

        input[property] = false;
    };

    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
}


setupHoldButton("btnLeft", "left");
setupHoldButton("btnRight", "right");
setupHoldButton("btnRun", "run");


const jumpButton =
    document.getElementById("btnJump");

if (jumpButton) {

    jumpButton.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            input.jumpPressed = true;
        }
    );
}


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;
let musicTimer = null;

const musicNotes = [
    261.63,
    329.63,
    392.00,
    329.63,
    293.66,
    349.23,
    440.00,
    392.00
];

let musicIndex = 0;


function initAudio() {

    try {

        if (!audioContext) {

            const Audio =
                window.AudioContext ||
                window.webkitAudioContext;

            if (Audio) {
                audioContext = new Audio();
            }
        }

        if (
            audioContext &&
            audioContext.state === "suspended"
        ) {
            audioContext.resume();
        }

    } catch (error) {

        console.warn("الصوت غير متاح");

    }
}


function playTone(
    frequency,
    duration = 0.1,
    type = "square",
    volume = 0.035
) {

    try {

        initAudio();

        if (!audioContext) return;

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            volume,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + duration
        );

    } catch (error) {

        console.warn("تعذر تشغيل الصوت");

    }
}


function startMusic() {

    if (musicTimer) return;

    musicTimer = setInterval(function() {

        if (
            gameRunning &&
            !gamePaused
        ) {

            playTone(
                musicNotes[musicIndex],
                0.11,
                "triangle",
                0.012
            );

            musicIndex++;

            if (
                musicIndex >=
                musicNotes.length
            ) {
                musicIndex = 0;
            }
        }

    }, 360);
}


function stopMusic() {

    if (musicTimer) {

        clearInterval(musicTimer);

        musicTimer = null;
    }
}


/* =========================================================
   COLLISION
========================================================= */

function rectsOverlap(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


function getPlayerRect() {

    return {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
    };
}


/* =========================================================
   CREATE LEVEL
========================================================= */

function createLevel(levelNumber) {

    const level =
        LEVELS[levelNumber - 1];

    if (!level) return;

    platforms = [];
    enemies = [];
    coins = [];
    powerUps = [];
    particles = [];

    cameraX = 0;

    const groundY =
        Math.max(
            VIEW_H - 120,
            450
        );

    /* الأرض */

    platforms.push({
        x: 0,
        y: groundY,
        width: level.length + 500,
        height: 300,
        type: "ground"
    });


    /* المنصات */

    for (
        let i = 0;
        i < Math.floor(level.length / 500);
        i++
    ) {

        const x =
            500 + i * 500;

        const y =
            groundY -
            80 -
            ((i % 3) * 45);

        platforms.push({
            x: x,
            y: y,
            width: 180,
            height: 30,
            type: "platform"
        });
    }


    /* العملات */

    for (
        let i = 0;
        i < Math.floor(level.length / 180);
        i++
    ) {

        const x =
            300 + i * 180;

        const y =
            groundY -
            80 -
            ((i % 4) * 55);

        coins.push({
            x: x,
            y: y,
            radius: 12,
            collected: false,
            rotation: Math.random() * Math.PI
        });
    }


    /* Power Ups */

    for (
        let i = 0;
        i < Math.floor(level.length / 1100);
        i++
    ) {

        powerUps.push({
            x: 850 + i * 1100,
            y: groundY - 145,
            width: 35,
            height: 35,

            type:
                Math.random() < 0.5
                    ? "mushroom"
                    : "star",

            collected: false
        });
    }


    /* الأعداء */

    const enemyCount =
        Math.floor(level.length / 400);

    for (
        let i = 0;
        i < enemyCount;
        i++
    ) {

        const enemyX =
            650 +
            i * 400 +
            Math.random() * 100;

        enemies.push({

            x: enemyX,

            y: groundY - 44,

            width: 44,
            height: 44,

            velocityX:
                Math.random() < 0.5
                    ? -1.2
                    : 1.2,

            minX: enemyX - 100,
            maxX: enemyX + 150,

            type:
                Math.random() < 0.2
                    ? "fast"
                    : "normal",

            alive: true,

            health: 1
        });
    }


    /* الطيور */

    for (
        let i = 0;
        i < Math.floor(level.difficulty);
        i++
    ) {

        enemies.push({

            x: 1200 + i * 1200,

            y: 250,

            width: 45,
            height: 35,

            velocityX: 1.5,

            minX: 1000 + i * 1200,

            maxX: 1450 + i * 1200,

            type: "fly",

            alive: true,

            health: 1,

            baseY: 250
        });
    }


    /* Boss */

    if (levelNumber % 3 === 0) {

        enemies.push({

            x: level.length - 600,

            y: groundY - 105,

            width: 90,
            height: 105,

            velocityX: -1.7,

            minX: level.length - 900,

            maxX: level.length - 300,

            type: "boss",

            alive: true,

            health: 6 + levelNumber
        });
    }


    /* النهاية */

    goal = {

        x: level.length - 130,

        y: groundY - 130,

        width: 100,

        height: 130
    };


    /* اللاعب */

    player.x = 120;
    player.y = groundY - player.height;

    player.velocityX = 0;
    player.velocityY = 0;

    player.grounded = true;

    player.big = false;

    player.star = 0;

    player.firePower = 0;

    player.invincible = 0;
}


/* =========================================================
   START LEVEL
========================================================= */

function startLevel(number) {

    if (
        number < 1 ||
        number > LEVELS.length
    ) {
        number = 1;
    }

    if (
        number > saveData.unlockedLevel
    ) {

        showMessage(
            "🔒 هذه المرحلة مغلقة"
        );

        return;
    }


    initAudio();

    currentLevel = number;

    score = 0;

    levelCoins = 0;

    lives =
        3 + saveData.extraLives;

    powerType = "عادي";

    player.star = 0;
    player.firePower = 0;

    createLevel(currentLevel);

    gameRunning = true;

    gamePaused = false;

    hideScreens();

    updateHUD();

    startMusic();

    showMessage(
        "🏁 " +
        LEVELS[currentLevel - 1].name
    );
}


/* =========================================================
   PLAYER UPDATE
========================================================= */

function updatePlayer() {

    if (player.invincible > 0) {
        player.invincible--;
    }

    if (player.star > 0) {
        player.star--;
    }

    if (player.firePower > 0) {
        player.firePower--;
    }


    const level =
        LEVELS[currentLevel - 1];


    const speedLimit =
        input.run
            ? 8
            : 5.5 +
              saveData.speedBoost * 0.5;


    /* الحركة */

    if (input.left) {

        player.velocityX -=
            player.acceleration;

        player.facing = -1;
    }


    if (input.right) {

        player.velocityX +=
            player.acceleration;

        player.facing = 1;
    }


    if (
        !input.left &&
        !input.right
    ) {

        player.velocityX *=
            player.friction;
    }


    player.velocityX =
        Math.max(
            -speedLimit,
            Math.min(
                speedLimit,
                player.velocityX
            )
        );


    /* القفز */

    if (
        input.jumpPressed &&
        player.grounded
    ) {

        player.velocityY =
            -player.jumpPower;

        player.grounded = false;

        playTone(
            520,
            0.12,
            "square",
            0.04
        );
    }

    input.jumpPressed = false;


    /* الجاذبية */

    player.velocityY +=
        0.62 * level.difficulty;

    player.velocityY =
        Math.min(
            player.velocityY,
            16
        );


    const oldY = player.y;

    player.x += player.velocityX;

    player.y += player.velocityY;

    player.grounded = false;


    /* حدود العالم */

    if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    }


    /* التصادم مع المنصات */

    const playerRect =
        getPlayerRect();


    for (
        const platform of platforms
    ) {

        const rect = {
            x: platform.x,
            y: platform.y,
            width: platform.width,
            height: platform.height
        };


        if (
            playerRect.x +
                playerRect.width >
                rect.x &&

            playerRect.x <
                rect.x + rect.width &&

            oldY +
                playerRect.height <=
                rect.y + 10 &&

            player.y +
                playerRect.height >=
                rect.y &&

            player.velocityY >= 0
        ) {

            player.y =
                rect.y -
                playerRect.height;

            player.velocityY = 0;

            player.grounded = true;
        }
    }


    /* السقوط */

    if (
        player.y >
        VIEW_H + 300
    ) {

        loseLife();

        return;
    }


    /* العملات */

    collectCoins();


    /* Power Ups */

    collectPowerUps();


    /* الأعداء */

    checkEnemies();


    /* إطلاق النار */

    if (
        input.firePressed &&
        player.firePower > 0
    ) {

        input.firePressed = false;

        shootFireball();
    }


    /* الوصول للنهاية */

    if (
        goal &&
        rectsOverlap(
            getPlayerRect(),
            goal
        )
    ) {

        finishLevel();
    }
}


/* =========================================================
   COINS
========================================================= */

function collectCoins() {

    const playerRect =
        getPlayerRect();

    for (const coin of coins) {

        if (coin.collected) continue;

        const rect = {

            x: coin.x - coin.radius,

            y: coin.y - coin.radius,

            width: coin.radius * 2,

            height: coin.radius * 2
        };


        if (
            rectsOverlap(
                playerRect,
                rect
            )
        ) {

            coin.collected = true;

            levelCoins++;

            const points =
                saveData.doublePoints > 0
                    ? 200
                    : 100;

            score += points;

            playTone(
                880,
                0.12,
                "square",
                0.045
            );

            createParticles(
                coin.x,
                coin.y,
                8,
                "#ffe044"
            );
        }
    }
}


/* =========================================================
   POWER UPS
========================================================= */

function collectPowerUps() {

    const playerRect =
        getPlayerRect();

    for (const item of powerUps) {

        if (item.collected) continue;

        if (
            rectsOverlap(
                playerRect,
                item
            )
        ) {

            item.collected = true;

            if (
                item.type === "mushroom"
            ) {

                player.big = true;

                player.width = 48;
                player.height = 68;

                powerType = "🍄 كبير";

                score += 500;

                showMessage(
                    "🍄 أصبحت كبيرًا!"
                );

            } else {

                player.star = 600;

                powerType = "🌟 نجم";

                score += 1000;

                showMessage(
                    "🌟 قوة النجمة!"
                );
            }

            playTone(
                700,
                0.2,
                "triangle",
                0.05
            );

            createParticles(
                item.x,
                item.y,
                15,
                "#ffe044"
            );
        }
    }
}


/* =========================================================
   ENEMIES
========================================================= */

function checkEnemies() {

    const playerRect =
        getPlayerRect();

    for (const enemy of enemies) {

        if (!enemy.alive) continue;


        const enemyRect = {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height
        };


        if (
            rectsOverlap(
                playerRect,
                enemyRect
            )
        ) {

            /* النجمة تقتل العدو */

            if (player.star > 0) {

                killEnemy(enemy);

                continue;
            }


            /* القفز فوق العدو */

            const playerBottom =
                player.y +
                player.height;

            const enemyTop =
                enemy.y;


            if (
                player.velocityY > 0 &&
                playerBottom -
                    enemyTop <
                    28
            ) {

                player.velocityY =
                    -9;

                killEnemy(enemy);

            } else {

                damagePlayer();
            }
        }
    }
}


function killEnemy(enemy) {

    enemy.health--;

    if (enemy.health <= 0) {

        enemy.alive = false;

        score +=
            enemy.type === "boss"
                ? 1000
                : 200;

        createParticles(
            enemy.x +
                enemy.width / 2,
            enemy.y +
                enemy.height / 2,
            18,
            "#ff6a3d"
        );

        playTone(
            180,
            0.18,
            "sawtooth",
            0.035
        );

    } else {

        enemy.velocityX *= -1;
    }
}


/* =========================================================
   DAMAGE
========================================================= */

function damagePlayer() {

    if (player.invincible > 0) {
        return;
    }


    if (saveData.shields > 0) {

        saveData.shields--;

        saveGame();

        player.invincible = 120;

        showMessage(
            "🛡️ الدرع حماك!"
        );

        return;
    }


    if (player.star > 0) {
        return;
    }


    if (player.big) {

        player.big = false;

        player.width = 42;
        player.height = 62;

        powerType = "عادي";

        player.invincible = 120;

        showMessage(
            "💥 فقدت القوة!"
        );

        return;
    }


    loseLife();
}


/* =========================================================
   LOSE LIFE
========================================================= */

function loseLife() {

    lives--;

    playTone(
        120,
        0.35,
        "sawtooth",
        0.05
    );


    if (lives <= 0) {

        gameOver();

        return;
    }


    const level =
        LEVELS[currentLevel - 1];

    const groundY =
        Math.max(
            VIEW_H - 120,
            450
        );

    player.x = 120;

    player.y =
        groundY -
        player.height;

    player.velocityX = 0;
    player.velocityY = 0;

    player.invincible = 150;

    updateHUD();

    showMessage(
        "❤️ بقيت " +
        lives +
        " محاولات"
    );
}


/* =========================================================
   FIREBALL
========================================================= */

let fireballs = [];


function shootFireball() {

    fireballs.push({

        x:
            player.x +
            player.width / 2,

        y:
            player.y +
            player.height / 2,

        width: 16,

        height: 16,

        velocityX:
            player.facing * 9,

        life: 100
    });


    playTone(
        700,
        0.08,
        "square",
        0.03
    );
}


function updateFireballs() {

    for (
        let i = fireballs.length - 1;
        i >= 0;
        i--
    ) {

        const ball =
            fireballs[i];

        ball.x += ball.velocityX;

        ball.life--;


        if (ball.life <= 0) {

            fireballs.splice(i, 1);

            continue;
        }


        const rect = {
            x: ball.x,
            y: ball.y,
            width: ball.width,
            height: ball.height
        };


        for (const enemy of enemies) {

            if (!enemy.alive) continue;

            if (
                rectsOverlap(
                    rect,
                    enemy
                )
            ) {

                enemy.health -= 2;

                if (enemy.health <= 0) {
                    killEnemy(enemy);
                }

                fireballs.splice(i, 1);

                break;
            }
        }
    }
}


/* =========================================================
   ENEMY UPDATE
========================================================= */

function updateEnemies() {

    for (const enemy of enemies) {

        if (!enemy.alive) continue;


        enemy.x += enemy.velocityX;


        if (
            enemy.x <= enemy.minX ||
            enemy.x >= enemy.maxX
        ) {

            enemy.velocityX *= -1;
        }


        if (enemy.type === "fly") {

            enemy.y =
                enemy.baseY +
                Math.sin(
                    performance.now() * 0.003 +
                    enemy.x
                ) * 35;
        }
    }
}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles(
    x,
    y,
    count,
    color
) {

    for (
        let i = 0;
        i < count;
        i++
    ) {

        particles.push({

            x: x,

            y: y,

            velocityX:
                (Math.random() - 0.5) * 5,

            velocityY:
                (Math.random() - 0.5) * 5,

            life: 30 +
                Math.random() * 30,

            color: color
        });
    }
}


function updateParticles() {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];

        p.x += p.velocityX;

        p.y += p.velocityY;

        p.velocityY += 0.15;

        p.life--;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera() {

    const target =
        player.x -
        VIEW_W * 0.35;

    cameraX +=
        (target - cameraX) *
        0.08;


    const level =
        LEVELS[currentLevel - 1];


    cameraX =
        Math.max(
            0,
            Math.min(
                cameraX,
                level.length -
                    VIEW_W +
                    200
            )
        );
}


/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground() {

    const level =
        LEVELS[currentLevel - 1];


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            VIEW_H
        );

    gradient.addColorStop(
        0,
        level.skyTop
    );

    gradient.addColorStop(
        1,
        level.skyBottom
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        VIEW_W,
        VIEW_H
    );


    /* الشمس */

    ctx.fillStyle =
        "rgba(255,235,130,0.9)";

    ctx.beginPath();

    ctx.arc(
        VIEW_W - 100,
        100,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* الجبال */

    ctx.fillStyle =
        "rgba(80,120,140,0.35)";

    for (
        let i = -1;
        i < 8;
        i++
    ) {

        const x =
            i * 350 -
            (cameraX * 0.25 % 350);

        ctx.beginPath();

        ctx.moveTo(
            x,
            VIEW_H - 110
        );

        ctx.lineTo(
            x + 170,
            VIEW_H - 330
        );

        ctx.lineTo(
            x + 340,
            VIEW_H - 110
        );

        ctx.closePath();

        ctx.fill();
    }


    /* السحب */

    ctx.fillStyle =
        "rgba(255,255,255,0.75)";

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const x =
            i * 300 -
            (cameraX * 0.12 % 300);

        const y =
            80 +
            (i % 3) * 55;

        drawCloud(x, y);
    }
}


function drawCloud(x, y) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        25,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 30,
        y - 12,
        32,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 65,
        y,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* =========================================================
   WORLD
========================================================= */

function drawWorld() {

    ctx.save();

    ctx.translate(
        -cameraX,
        0
    );


    /* المنصات */

    for (const platform of platforms) {

        const level =
            LEVELS[currentLevel - 1];

        ctx.fillStyle =
            level.ground;

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );


        if (
            platform.type ===
            "platform"
        ) {

            ctx.fillStyle =
                level.platform;

            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );


            ctx.fillStyle =
                "rgba(255,255,255,0.15)";

            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                5
            );
        }
    }


    /* العملات */

    drawCoins();


    /* Power Ups */

    drawPowerUps();


    /* الأعداء */

    drawEnemies();


    /* النهاية */

    drawGoal();


    /* Fireballs */

    drawFireballs();


    /* اللاعب */

    drawPlayer();


    /* particles */

    drawParticles();


    ctx.restore();
}


/* =========================================================
   DRAW COINS
========================================================= */

function drawCoins() {

    for (const coin of coins) {

        if (coin.collected) continue;

        const scale =
            0.75 +
            Math.abs(
                Math.sin(
                    performance.now() *
                    0.006 +
                    coin.rotation
                )
            ) *
            0.25;

        ctx.save();

        ctx.translate(
            coin.x,
            coin.y
        );

        ctx.scale(
            scale,
            1
        );

        ctx.fillStyle =
            "#ffd52e";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            coin.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle =
            "#c88d00";

        ctx.lineWidth = 3;

        ctx.stroke();

        ctx.fillStyle =
            "#fff3a0";

        ctx.font =
            "bold 16px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            "$",
            0,
            1
        );

        ctx.restore();
    }
}


/* =========================================================
   DRAW POWER UPS
========================================================= */

function drawPowerUps() {

    for (const item of powerUps) {

        if (item.collected) continue;

        ctx.save();

        ctx.translate(
            item.x,
            item.y
        );


        if (
            item.type === "mushroom"
        ) {

            ctx.fillStyle =
                "#e53935";

            ctx.beginPath();

            ctx.arc(
                17,
                14,
                17,
                Math.PI,
                0
            );

            ctx.fill();

            ctx.fillStyle =
                "white";

            ctx.beginPath();

            ctx.arc(
                10,
                11,
                4,
                0,
                Math.PI * 2
            );

            ctx.arc(
                24,
                11,
                4,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle =
                "#f5d9a5";

            ctx.fillRect(
                8,
                14,
                18,
                17
            );

        } else {

            drawStar(
                17,
                17,
                18,
                "#ffe044"
            );
        }

        ctx.restore();
    }
}


function drawStar(
    x,
    y,
    radius,
    color
) {

    ctx.fillStyle = color;

    ctx.beginPath();

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const angle =
            -Math.PI / 2 +
            i * Math.PI / 5;

        const r =
            i % 2 === 0
                ? radius
                : radius * 0.45;

        const px =
            x +
            Math.cos(angle) * r;

        const py =
            y +
            Math.sin(angle) * r;

        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.closePath();

    ctx.fill();
}


/* =========================================================
   DRAW ENEMIES
========================================================= */

function drawEnemies() {

    for (const enemy of enemies) {

        if (!enemy.alive) continue;

        ctx.save();

        ctx.translate(
            enemy.x +
                enemy.width / 2,
            enemy.y +
                enemy.height / 2
        );


        if (
            enemy.type === "boss"
        ) {

            ctx.fillStyle =
                "#7a1824";

            ctx.fillRect(
                -45,
                -52,
                90,
                105
            );

            ctx.fillStyle =
                "#e6b24b";

            ctx.fillRect(
                -30,
                -35,
                60,
                20
            );

            ctx.fillStyle =
                "#ff4444";

            ctx.beginPath();

            ctx.arc(
                -18,
                -5,
                7,
                0,
                Math.PI * 2
            );

            ctx.arc(
                18,
                -5,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();

        } else if (
            enemy.type === "fly"
        ) {

            ctx.fillStyle =
                "#6d2bbf";

            ctx.beginPath();

            ctx.ellipse(
                0,
                5,
                21,
                15,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle =
                "white";

            ctx.beginPath();

            ctx.ellipse(
                -22,
                0,
                20,
                8,
                -0.2,
                0,
                Math.PI * 2
            );

            ctx.ellipse(
                22,
                0,
                20,
                8,
                0.2,
                0,
                Math.PI * 2
            );

            ctx.fill();

        } else {

            ctx.fillStyle =
                enemy.type === "fast"
                    ? "#d33"
                    : "#8b4b25";

            ctx.beginPath();

            ctx.roundRect(
                -22,
                -18,
                44,
                38,
                12
            );

            ctx.fill();


            ctx.fillStyle =
                "white";

            ctx.beginPath();

            ctx.arc(
                -8,
                -5,
                6,
                0,
                Math.PI * 2
            );

            ctx.arc(
                8,
                -5,
                6,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#111";

            ctx.beginPath();

            ctx.arc(
                -8,
                -5,
                2,
                0,
                Math.PI * 2
            );

            ctx.arc(
                8,
                -5,
                2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();
    }
}


/* =========================================================
   DRAW GOAL
========================================================= */

function drawGoal() {

    if (!goal) return;

    ctx.fillStyle =
        "#eeeeee";

    ctx.fillRect(
        goal.x + 45,
        goal.y,
        8,
        goal.height
    );

    ctx.fillStyle =
        "#ff3344";

    ctx.beginPath();

    ctx.moveTo(
        goal.x + 53,
        goal.y + 10
    );

    ctx.lineTo(
        goal.x + 100,
        goal.y + 30
    );

    ctx.lineTo(
        goal.x + 53,
        goal.y + 50
    );

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle =
        "#f5c542";

    ctx.beginPath();

    ctx.arc(
        goal.x + 49,
        goal.y,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* =========================================================
   DRAW PLAYER
========================================================= */

function drawPlayer() {

    if (
        player.invincible > 0 &&
        Math.floor(
            player.invincible / 6
        ) % 2 === 0
    ) {
        return;
    }


    ctx.save();

    ctx.translate(
        player.x +
            player.width / 2,
        player.y +
            player.height / 2
    );

    ctx.scale(
        player.facing,
        1
    );


    /* جسم */

    ctx.fillStyle =
        "#e53935";

    ctx.fillRect(
        -18,
        -30,
        36,
        20
    );


    /* الوجه */

    ctx.fillStyle =
        "#f4c49b";

    ctx.beginPath();

    ctx.arc(
        0,
        -8,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* الشعر */

    ctx.fillStyle =
        "#4a2b1b";

    ctx.fillRect(
        -17,
        -20,
        34,
        8
    );


    /* القبعة */

    ctx.fillStyle =
        "#d82222";

    ctx.fillRect(
        -21,
        -28,
        42,
        8
    );

    ctx.fillRect(
        -8,
        -37,
        25,
        10
    );


    /* العين */

    ctx.fillStyle =
        "#111";

    ctx.beginPath();

    ctx.arc(
        8,
        -9,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* الملابس */

    ctx.fillStyle =
        "#2465d6";

    ctx.fillRect(
        -18,
        -2,
        36,
        25
    );


    /* اليدان */

    ctx.fillStyle =
        "#f4c49b";

    ctx.beginPath();

    ctx.arc(
        -22,
        5,
        7,
        0,
        Math.PI * 2
    );

    ctx.arc(
        22,
        5,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* الأرجل */

    ctx.fillStyle =
        "#573322";

    ctx.fillRect(
        -17,
        22,
        13,
        15
    );

    ctx.fillRect(
        4,
        22,
        13,
        15
    );


    /* النجمة */

    if (player.star > 0) {

        ctx.strokeStyle =
            "#ffe044";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            35,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }


    ctx.restore();
}


/* =========================================================
   DRAW FIREBALLS
========================================================= */

function drawFireballs() {

    for (const ball of fireballs) {

        ctx.fillStyle =
            "#ff6a20";

        ctx.beginPath();

        ctx.arc(
            ball.x + 8,
            ball.y + 8,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#fff4a0";

        ctx.beginPath();

        ctx.arc(
            ball.x + 8,
            ball.y + 8,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


/* =========================================================
   DRAW PARTICLES
========================================================= */

function drawParticles() {

    for (const p of particles) {

        ctx.globalAlpha =
            Math.max(
                0,
                p.life / 60
            );

        ctx.fillStyle =
            p.color;

        ctx.fillRect(
            p.x,
            p.y,
            5,
            5
        );
    }

    ctx.globalAlpha = 1;
}


/* =========================================================
   UPDATE GAME
========================================================= */

function updateGame() {

    updatePlayer();

    updateEnemies();

    updateFireballs();

    updateParticles();

    updateCamera();

    updateHUD();
}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    gameRunning = false;

    stopMusic();

    ui.finalScore.textContent =
        Math.floor(score);

    ui.finalCoins.textContent =
        levelCoins;

    hideScreens();

    ui.gameOverScreen.classList.remove(
        "hidden"
    );
}


/* =========================================================
   FINISH LEVEL
========================================================= */

function finishLevel() {

    if (!gameRunning) return;

    gameRunning = false;

    stopMusic();

    playTone(
        900,
        0.3,
        "triangle",
        0.06
    );


    if (
        !saveData.completed.includes(
            currentLevel
        )
    ) {

        saveData.completed.push(
            currentLevel
        );
    }


    if (
        currentLevel <
        LEVELS.length
    ) {

        saveData.unlockedLevel =
            Math.max(
                saveData.unlockedLevel,
                currentLevel + 1
            );
    }


    saveData.totalCoins +=
        levelCoins;

    saveData.bestScore =
        Math.max(
            saveData.bestScore,
            Math.floor(score)
        );


    saveGame();


    ui.winScore.textContent =
        Math.floor(score);


    hideScreens();

    ui.winScreen.classList.remove(
        "hidden"
    );
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    if (!ui.lives) return;

    ui.lives.textContent =
        lives;

    ui.coins.textContent =
        levelCoins +
        saveData.totalCoins;

    ui.score.textContent =
        Math.floor(score);

    ui.level.textContent =
        currentLevel;


    if (player.star > 0) {

        ui.power.textContent =
            "🌟 نجم";

    } else if (
        player.firePower > 0
    ) {

        ui.power.textContent =
            "🔥 نار";

    } else if (
        player.big
    ) {

        ui.power.textContent =
            "🍄 كبير";

    } else {

        ui.power.textContent =
            powerType;
    }


    ui.shopCoins.textContent =
        saveData.totalCoins;
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(text) {

    if (!ui.message) return;

    ui.message.textContent =
        text;

    ui.message.style.display =
        "block";


    clearTimeout(
        messageTimeout
    );


    messageTimeout =
        setTimeout(function() {

            ui.message.style.display =
                "none";

        }, 1700);
}


/* =========================================================
   HIDE SCREENS
========================================================= */

function hideScreens() {

    document
        .querySelectorAll(".screen")
        .forEach(function(screen) {

            screen.classList.add(
                "hidden"
            );
        });
}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (!gameRunning) return;

    gamePaused =
        !gamePaused;

    if (gamePaused) {

        showMessage(
            "⏸️ اللعبة متوقفة"
        );

    } else {

        showMessage(
            "▶️ عادت اللعبة"
        );
    }
}


/* =========================================================
   LEVEL MAP
========================================================= */

function renderLevelMap() {

    ui.levelList.innerHTML = "";


    LEVELS.forEach(
        function(level, index) {

            const number =
                index + 1;

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "level-button";


            const unlocked =
                number <=
                saveData.unlockedLevel;


            const completed =
                saveData.completed.includes(
                    number
                );


            if (!unlocked) {

                button.classList.add(
                    "locked"
                );

                button.disabled = true;

                button.textContent =
                    "🔒 " +
                    number;

            } else {

                if (completed) {

                    button.classList.add(
                        "done"
                    );
                }


                button.textContent =
                    "🏁 " +
                    number +
                    "\n" +
                    level.name;


                button.onclick =
                    function() {

                        startLevel(
                            number
                        );
                    };
            }


            ui.levelList.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   MENU BUTTONS
========================================================= */

const startButton =
    document.getElementById(
        "startGame"
    );

if (startButton) {

    startButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            startLevel(
                Math.min(
                    saveData.unlockedLevel,
                    LEVELS.length
                )
            );
        }
    );
}


const mapButton =
    document.getElementById(
        "openMap"
    );

if (mapButton) {

    mapButton.addEventListener(
        "click",
        function() {

            ui.mainMenu.classList.add(
                "hidden"
            );

            ui.mapScreen.classList.remove(
                "hidden"
            );

            renderLevelMap();
        }
    );
}


const shopButton =
    document.getElementById(
        "openShop"
    );

if (shopButton) {

    shopButton.addEventListener(
        "click",
        function() {

            ui.mainMenu.classList.add(
                "hidden"
            );

            ui.shopScreen.classList.remove(
                "hidden"
            );

            updateHUD();
        }
    );
}


const helpButton =
    document.getElementById(
        "openHelp"
    );

if (helpButton) {

    helpButton.addEventListener(
        "click",
        function() {

            ui.mainMenu.classList.add(
                "hidden"
            );

            ui.helpScreen.classList.remove(
                "hidden"
            );
        }
    );
}


/* =========================================================
   BACK BUTTONS
========================================================= */

document
    .querySelectorAll(".backButton")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                hideScreens();

                ui.mainMenu.classList.remove(
                    "hidden"
                );
            }
        );
    });


/* =========================================================
   GAME OVER BUTTONS
========================================================= */

const retryButton =
    document.getElementById(
        "retryGame"
    );

if (retryButton) {

    retryButton.addEventListener(
        "click",
        function() {

            startLevel(
                currentLevel
            );
        }
    );
}


const homeButton =
    document.getElementById(
        "goHome"
    );

if (homeButton) {

    homeButton.addEventListener(
        "click",
        function() {

            gameRunning = false;

            stopMusic();

            hideScreens();

            ui.mainMenu.classList.remove(
                "hidden"
            );
        }
    );
}


/* =========================================================
   WIN BUTTONS
========================================================= */

const nextButton =
    document.getElementById(
        "nextLevel"
    );

if (nextButton) {

    nextButton.addEventListener(
        "click",
        function() {

            if (
                currentLevel <
                LEVELS.length
            ) {

                startLevel(
                    currentLevel + 1
                );

            } else {

                hideScreens();

                ui.mainMenu.classList.remove(
                    "hidden"
                );
            }
        }
    );
}


const winHomeButton =
    document.getElementById(
        "winHome"
    );

if (winHomeButton) {

    winHomeButton.addEventListener(
        "click",
        function() {

            gameRunning = false;

            stopMusic();

            hideScreens();

            ui.mainMenu.classList.remove(
                "hidden"
            );
        }
    );
}


/* =========================================================
   SHOP
========================================================= */

document
    .querySelectorAll(".shop-item")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const item =
                    button.dataset.item;


                const prices = {

                    life: 20,

                    shield: 30,

                    double: 40,

                    speed: 50
                };


                const price =
                    prices[item];


                if (
                    saveData.totalCoins <
                    price
                ) {

                    showMessage(
                        "❌ لا توجد عملات كافية"
                    );

                    return;
                }


                saveData.totalCoins -=
                    price;


                switch (item) {

                    case "life":

                        saveData.extraLives++;

                        break;


                    case "shield":

                        saveData.shields++;

                        break;


                    case "double":

                        saveData.doublePoints++;

                        break;


                    case "speed":

                        saveData.speedBoost++;

                        break;
                }


                saveGame();

                updateHUD();

                playTone(
                    800,
                    0.12,
                    "triangle",
                    0.04
                );


                showMessage(
                    "✅ تم الشراء!"
                );
            }
        );
    });


/* =========================================================
   GAME LOOP
========================================================= */

let lastTime =
    performance.now();


function gameLoop(currentTime) {

    lastTime =
        currentTime;


    if (
        gameRunning &&
        !gamePaused
    ) {

        updateGame();
    }


    drawGame();


    requestAnimationFrame(
        gameLoop
    );
}


/* =========================================================
   DRAW GAME
========================================================= */

function drawGame() {

    drawBackground();

    drawWorld();
}


/* =========================================================
   INITIALIZATION
========================================================= */

renderLevelMap();

updateHUD();

createLevel(1);

gameLoop(
    performance.now()
);
