"use strict";

/* =========================================================
   SUPER ADVENTURE 4.0
   شخصيات أصلية + تحكم كمبيوتر وهاتف
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
window.addEventListener("orientationchange", () => {
    setTimeout(resizeCanvas, 100);
});

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
   ORIGINAL CHARACTER IMAGES
   لا تحتاج ملفات صور خارجية
========================================================= */

function makeImage(svg) {
    const image = new Image();

    image.src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svg);

    return image;
}


/* =========================
   HERO
========================= */

const HERO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="120" height="150" viewBox="0 0 120 150">

    <!-- shadow -->
    <ellipse cx="60" cy="143"
             rx="35" ry="6"
             fill="rgba(0,0,0,.25)"/>

    <!-- legs -->
    <rect x="38" y="105"
          width="18" height="30"
          rx="8"
          fill="#263b8f"/>

    <rect x="65" y="105"
          width="18" height="30"
          rx="8"
          fill="#263b8f"/>

    <!-- shoes -->
    <ellipse cx="43" cy="137"
             rx="18" ry="8"
             fill="#39251d"/>

    <ellipse cx="78" cy="137"
             rx="18" ry="8"
             fill="#39251d"/>

    <!-- body -->
    <rect x="30" y="58"
          width="60" height="57"
          rx="18"
          fill="#2877d8"/>

    <!-- shirt -->
    <path d="M32 68 Q60 82 88 68 L88 106 Q60 118 32 106Z"
          fill="#2456b8"/>

    <!-- arms -->
    <circle cx="27" cy="78"
            r="12"
            fill="#f1bd91"/>

    <circle cx="93" cy="78"
            r="12"
            fill="#f1bd91"/>

    <!-- neck -->
    <rect x="48" y="50"
          width="24" height="18"
          rx="8"
          fill="#e7ad80"/>

    <!-- face -->
    <circle cx="60" cy="39"
            r="31"
            fill="#f1bd91"/>

    <!-- hair -->
    <path d="M31 39 Q32 7 61 8
             Q92 8 91 40
             Q80 24 67 25
             Q48 17 31 39Z"
          fill="#35231c"/>

    <!-- hair sides -->
    <path d="M32 34 Q24 45 34 57"
          stroke="#35231c"
          stroke-width="9"
          fill="none"/>

    <!-- eyes -->
    <ellipse cx="48" cy="40"
             rx="5" ry="7"
             fill="#171717"/>

    <ellipse cx="73" cy="40"
             rx="5" ry="7"
             fill="#171717"/>

    <!-- eyes shine -->
    <circle cx="50" cy="38"
            r="2"
            fill="white"/>

    <circle cx="75" cy="38"
            r="2"
            fill="white"/>

    <!-- smile -->
    <path d="M48 52 Q60 62 73 52"
          stroke="#7d3828"
          stroke-width="4"
          fill="none"
          stroke-linecap="round"/>

    <!-- headband -->
    <path d="M31 26 Q60 8 89 26"
          stroke="#17a6e8"
          stroke-width="10"
          fill="none"/>

    <!-- badge -->
    <circle cx="60" cy="75"
            r="9"
            fill="#ffd83d"/>

    <path d="M60 68 L63 74 L70 75
             L65 80 L66 87
             L60 83 L54 87
             L55 80 L50 75
             L57 74Z"
          fill="#fff"/>
</svg>
`;

const heroImage = makeImage(HERO_SVG);


/* =========================
   ENEMY
========================= */

const ENEMY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="110" height="100" viewBox="0 0 110 100">

    <ellipse cx="55" cy="92"
             rx="37" ry="6"
             fill="rgba(0,0,0,.25)"/>

    <!-- body -->
    <path d="M17 72
             Q15 28 55 22
             Q95 28 93 72
             Q85 88 55 88
             Q25 88 17 72Z"
          fill="#7b36c9"/>

    <!-- horns -->
    <path d="M25 30 L15 7 L38 22Z"
          fill="#f04d55"/>

    <path d="M85 30 L95 7 L72 22Z"
          fill="#f04d55"/>

    <!-- eyes -->
    <ellipse cx="40" cy="49"
             rx="11" ry="14"
             fill="white"/>

    <ellipse cx="70" cy="49"
             rx="11" ry="14"
             fill="white"/>

    <circle cx="40" cy="51"
            r="5"
            fill="#111"/>

    <circle cx="70" cy="51"
            r="5"
            fill="#111"/>

    <!-- mouth -->
    <path d="M34 68 Q55 82 76 68"
          stroke="#171717"
          stroke-width="6"
          fill="none"
          stroke-linecap="round"/>

    <!-- teeth -->
    <path d="M43 71 L47 78 L52 72
             L57 80 L62 72 L67 77"
          fill="white"/>
</svg>
`;

const enemyImage = makeImage(ENEMY_SVG);


/* =========================
   FLYING ENEMY
========================= */

const FLY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="130" height="90" viewBox="0 0 130 90">

    <!-- wings -->
    <ellipse cx="25" cy="45"
             rx="27" ry="15"
             fill="#f4f4ff"/>

    <ellipse cx="105" cy="45"
             rx="27" ry="15"
             fill="#f4f4ff"/>

    <!-- body -->
    <ellipse cx="65" cy="48"
             rx="34" ry="28"
             fill="#e84567"/>

    <!-- eyes -->
    <circle cx="53" cy="45"
            r="7"
            fill="white"/>

    <circle cx="77" cy="45"
            r="7"
            fill="white"/>

    <circle cx="53" cy="46"
            r="3"
            fill="#111"/>

    <circle cx="77" cy="46"
            r="3"
            fill="#111"/>

    <!-- mouth -->
    <path d="M55 62 Q65 69 75 62"
          stroke="#111"
          stroke-width="4"
          fill="none"/>
</svg>
`;

const flyImage = makeImage(FLY_SVG);


/* =========================
   BOSS
========================= */

const BOSS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="150" height="170" viewBox="0 0 150 170">

    <ellipse cx="75" cy="160"
             rx="50" ry="8"
             fill="rgba(0,0,0,.3)"/>

    <!-- horns -->
    <path d="M40 42 L15 5 L58 28Z"
          fill="#ffb52e"/>

    <path d="M110 42 L135 5 L92 28Z"
          fill="#ffb52e"/>

    <!-- body -->
    <rect x="27" y="35"
          width="96"
          height="115"
          rx="30"
          fill="#8d1e35"/>

    <!-- armor -->
    <path d="M33 77 L75 57 L117 77
             L110 130 L75 145
             L40 130Z"
          fill="#4b2533"/>

    <!-- eyes -->
    <circle cx="53" cy="66"
            r="12"
            fill="#ffdf44"/>

    <circle cx="97" cy="66"
            r="12"
            fill="#ffdf44"/>

    <circle cx="53" cy="66"
            r="5"
            fill="#111"/>

    <circle cx="97" cy="66"
            r="5"
            fill="#111"/>

    <!-- mouth -->
    <path d="M45 100 Q75 125 105 100"
          stroke="#111"
          stroke-width="10"
          fill="none"/>

    <!-- teeth -->
    <path d="M55 105 L61 116
             L68 107 L75 118
             L82 107 L89 116
             L96 105"
          fill="white"/>

    <!-- badge -->
    <circle cx="75" cy="93"
            r="12"
            fill="#ffcf32"/>
</svg>
`;

const bossImage = makeImage(BOSS_SVG);


/* =========================================================
   SAVE SYSTEM
========================================================= */

const SAVE_KEY =
    "super_adventure_4_save";

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
    const saved =
        localStorage.getItem(SAVE_KEY);

    if (saved) {
        saveData = {
            ...saveData,
            ...JSON.parse(saved)
        };
    }
} catch (error) {
    console.warn("تعذر تحميل الحفظ");
}

function saveGame() {
    try {
        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(saveData)
        );
    } catch (error) {
        console.warn("تعذر حفظ اللعبة");
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

let powerType = "عادي";

let cameraX = 0;

let platforms = [];
let enemies = [];
let coins = [];
let powerUps = [];
let particles = [];
let fireballs = [];

let goal = null;

let messageTimeout = null;


/* =========================================================
   PLAYER
========================================================= */

const player = {

    x: 120,
    y: 300,

    width: 54,
    height: 68,

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

    invincible: 0,

    animation: 0
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

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "ArrowLeft" ||
            event.code === "KeyA"
        ) {
            input.left = true;
            event.preventDefault();
        }

        if (
            event.code === "ArrowRight" ||
            event.code === "KeyD"
        ) {
            input.right = true;
            event.preventDefault();
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
    }
);


window.addEventListener(
    "keyup",
    function(event) {

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
    }
);


/* =========================================================
   MOBILE CONTROLS
========================================================= */

function setupHoldButton(
    id,
    property
) {

    const button =
        document.getElementById(id);

    if (!button) return;

    function start(event) {

        event.preventDefault();

        input[property] = true;

        try {
            button.setPointerCapture(
                event.pointerId
            );
        } catch (e) {}
    }

    function stop(event) {

        event.preventDefault();

        input[property] = false;
    }

    button.addEventListener(
        "pointerdown",
        start
    );

    button.addEventListener(
        "pointerup",
        stop
    );

    button.addEventListener(
        "pointercancel",
        stop
    );

    button.addEventListener(
        "pointerleave",
        stop
    );

    button.addEventListener(
        "pointerout",
        stop
    );
}


setupHoldButton(
    "btnLeft",
    "left"
);

setupHoldButton(
    "btnRight",
    "right"
);

setupHoldButton(
    "btnRun",
    "run"
);


const jumpButton =
    document.getElementById("btnJump");

if (jumpButton) {

    jumpButton.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            input.jumpPressed = true;

            try {
                jumpButton.setPointerCapture(
                    event.pointerId
                );
            } catch (e) {}
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
    392,
    329.63,
    293.66,
    349.23,
    440,
    392
];

let musicIndex = 0;


function initAudio() {

    try {

        if (!audioContext) {

            const Audio =
                window.AudioContext ||
                window.webkitAudioContext;

            if (Audio) {
                audioContext =
                    new Audio();
            }
        }

        if (
            audioContext &&
            audioContext.state === "suspended"
        ) {
            audioContext.resume();
        }

    } catch (error) {}
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
            audioContext.currentTime +
            duration
        );

        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime +
            duration
        );

    } catch (error) {}
}


function startMusic() {

    if (musicTimer) return;

    musicTimer =
        setInterval(function() {

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

        x: player.x + 5,

        y: player.y + 3,

        width:
            player.width - 10,

        height:
            player.height - 4
    };
}


/* =========================================================
   CREATE LEVEL
========================================================= */

function createLevel(
    levelNumber
) {

    const level =
        LEVELS[levelNumber - 1];

    if (!level) return;

    platforms = [];
    enemies = [];
    coins = [];
    powerUps = [];
    particles = [];
    fireballs = [];

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

        width:
            level.length + 500,

        height: 300,

        type: "ground"
    });


    /* المنصات */

    for (
        let i = 0;
        i <
        Math.floor(
            level.length / 500
        );
        i++
    ) {

        const x =
            500 + i * 500;

        const y =
            groundY -
            80 -
            (i % 3) * 45;

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
        i <
        Math.floor(
            level.length / 180
        );
        i++
    ) {

        coins.push({

            x:
                300 + i * 180,

            y:
                groundY -
                80 -
                (i % 4) * 55,

            radius: 12,

            collected: false,

            rotation:
                Math.random() *
                Math.PI
        });
    }


    /* Power Ups */

    for (
        let i = 0;
        i <
        Math.floor(
            level.length / 1100
        );
        i++
    ) {

        powerUps.push({

            x:
                850 + i * 1100,

            y:
                groundY - 145,

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
        Math.floor(
            level.length / 400
        );

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

            y:
                groundY - 50,

            width: 54,

            height: 50,

            velocityX:
                Math.random() < 0.5
                    ? -1.2
                    : 1.2,

            minX:
                enemyX - 100,

            maxX:
                enemyX + 150,

            type:
                Math.random() < 0.2
                    ? "fast"
                    : "normal",

            alive: true,

            health: 1,

            animation: 0
        });
    }


    /* الطيور */

    for (
        let i = 0;
        i <
        Math.floor(level.difficulty);
        i++
    ) {

        enemies.push({

            x:
                1200 +
                i * 1200,

            y: 250,

            width: 58,

            height: 42,

            velocityX: 1.5,

            minX:
                1000 +
                i * 1200,

            maxX:
                1450 +
                i * 1200,

            type: "fly",

            alive: true,

            health: 1,

            baseY: 250,

            animation: 0
        });
    }


    /* Boss */

    if (
        levelNumber % 3 === 0
    ) {

        enemies.push({

            x:
                level.length - 600,

            y:
                groundY - 125,

            width: 105,

            height: 125,

            velocityX: -1.7,

            minX:
                level.length - 900,

            maxX:
                level.length - 300,

            type: "boss",

            alive: true,

            health:
                6 + levelNumber,

            animation: 0
        });
    }


    /* النهاية */

    goal = {

        x:
            level.length - 130,

        y:
            groundY - 130,

        width: 100,

        height: 130
    };


    /* اللاعب */

    player.x = 120;

    player.y =
        groundY -
        player.height;

    player.velocityX = 0;

    player.velocityY = 0;

    player.grounded = true;

    player.big = false;

    player.width = 54;

    player.height = 68;

    player.star = 0;

    player.firePower = 0;

    player.invincible = 0;

    player.animation = 0;
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
        number >
        saveData.unlockedLevel
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
        3 +
        saveData.extraLives;

    powerType = "عادي";

    createLevel(
        currentLevel
    );

    gameRunning = true;

    gamePaused = false;

    hideScreens();

    updateHUD();

    startMusic();

    showMessage(
        "🏁 " +
        LEVELS[
            currentLevel - 1
        ].name
    );
}


/* =========================================================
   PLAYER UPDATE
========================================================= */

function updatePlayer() {

    if (
        player.invincible > 0
    ) {
        player.invincible--;
    }

    if (
        player.star > 0
    ) {
        player.star--;
    }

    if (
        player.firePower > 0
    ) {
        player.firePower--;
    }


    const level =
        LEVELS[
            currentLevel - 1
        ];


    const speedLimit =
        input.run
            ? 8
            : 5.5 +
              saveData.speedBoost *
              0.5;


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


    /* Animation */

    if (
        Math.abs(
            player.velocityX
        ) > 0.2
    ) {

        player.animation +=
            0.25;
    }


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
        0.62 *
        level.difficulty;

    player.velocityY =
        Math.min(
            player.velocityY,
            16
        );


    const oldY =
        player.y;

    player.x +=
        player.velocityX;

    player.y +=
        player.velocityY;

    player.grounded = false;


    /* حدود العالم */

    if (player.x < 0) {

        player.x = 0;

        player.velocityX = 0;
    }


    /* التصادم */

    const playerRect =
        getPlayerRect();


    for (
        const platform of platforms
    ) {

        const rect = {

            x: platform.x,

            y: platform.y,

            width:
                platform.width,

            height:
                platform.height
        };


        if (
            playerRect.x +
                playerRect.width >
                rect.x &&

            playerRect.x <
                rect.x +
                rect.width &&

            oldY +
                playerRect.height <=
                rect.y + 12 &&

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


    collectCoins();

    collectPowerUps();

    checkEnemies();


    /* إطلاق النار */

    if (
        input.firePressed &&
        player.firePower > 0
    ) {

        input.firePressed = false;

        shootFireball();
    }


    /* النهاية */

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

    for (
        const coin of coins
    ) {

        if (coin.collected)
            continue;

        const rect = {

            x:
                coin.x -
                coin.radius,

            y:
                coin.y -
                coin.radius,

            width:
                coin.radius * 2,

            height:
                coin.radius * 2
        };


        if (
            rectsOverlap(
                playerRect,
                rect
            )
        ) {

            coin.collected = true;

            levelCoins++;

            score +=
                saveData.doublePoints > 0
                    ? 200
                    : 100;

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

    for (
        const item of powerUps
    ) {

        if (item.collected)
            continue;

        if (
            rectsOverlap(
                playerRect,
                item
            )
        ) {

            item.collected = true;

            if (
                item.type ===
                "mushroom"
            ) {

                player.big = true;

                player.width = 58;

                player.height = 76;

                powerType =
                    "🍄 كبير";

                score += 500;

                showMessage(
                    "🍄 قوة البطل!"
                );

            } else {

                player.star = 600;

                powerType =
                    "🌟 نجم";

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

    for (
        const enemy of enemies
    ) {

        if (!enemy.alive)
            continue;

        const enemyRect = {

            x: enemy.x,

            y: enemy.y,

            width:
                enemy.width,

            height:
                enemy.height
        };


        if (
            rectsOverlap(
                playerRect,
                enemyRect
            )
        ) {

            /* النجمة */

            if (
                player.star > 0
            ) {

                killEnemy(enemy);

                continue;
            }


            const playerBottom =
                player.y +
                player.height;

            const enemyTop =
                enemy.y;


            /* القفز فوق العدو */

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

    if (
        enemy.health <= 0
    ) {

        enemy.alive = false;

        score +=
            enemy.type ===
            "boss"
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

    if (
        player.invincible > 0
    ) {
        return;
    }


    if (
        saveData.shields > 0
    ) {

        saveData.shields--;

        saveGame();

        player.invincible = 120;

        showMessage(
            "🛡️ الدرع حماك!"
        );

        return;
    }


    if (
        player.star > 0
    ) {
        return;
    }


    if (player.big) {

        player.big = false;

        player.width = 54;

        player.height = 68;

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


    if (
        lives <= 0
    ) {

        gameOver();

        return;
    }


    const level =
        LEVELS[
            currentLevel - 1
        ];

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
        let i =
            fireballs.length - 1;

        i >= 0;

        i--
    ) {

        const ball =
            fireballs[i];

        ball.x +=
            ball.velocityX;

        ball.life--;


        if (
            ball.life <= 0
        ) {

            fireballs.splice(
                i,
                1
            );

            continue;
        }


        const rect = {

            x: ball.x,

            y: ball.y,

            width:
                ball.width,

            height:
                ball.height
        };


        for (
            const enemy of enemies
        ) {

            if (
                !enemy.alive
            )
                continue;

            if (
                rectsOverlap(
                    rect,
                    enemy
                )
            ) {

                enemy.health -= 2;

                if (
                    enemy.health <= 0
                ) {
                    killEnemy(enemy);
                }

                fireballs.splice(
                    i,
                    1
                );

                break;
            }
        }
    }
}


/* =========================================================
   ENEMY UPDATE
========================================================= */

function updateEnemies() {

    for (
        const enemy of enemies
    ) {

        if (!enemy.alive)
            continue;

        enemy.x +=
            enemy.velocityX;

        enemy.animation +=
            0.12;


        if (
            enemy.x <=
                enemy.minX ||

            enemy.x >=
                enemy.maxX
        ) {

            enemy.velocityX *=
                -1;
        }


        if (
            enemy.type ===
            "fly"
        ) {

            enemy.y =
                enemy.baseY +
                Math.sin(
                    performance.now() *
                    0.003 +
                    enemy.x
                ) *
                35;
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

            life:
                30 +
                Math.random() * 30,

            color: color
        });
    }
}


function updateParticles() {

    for (
        let i =
            particles.length - 1;

        i >= 0;

        i--
    ) {

        const p =
            particles[i];

        p.x +=
            p.velocityX;

        p.y +=
            p.velocityY;

        p.velocityY +=
            0.15;

        p.life--;


        if (
            p.life <= 0
        ) {

            particles.splice(
                i,
                1
            );
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
        LEVELS[
            currentLevel - 1
        ];


    cameraX =
        Math.max(
            0,

            Math.min(
                cameraX,

                Math.max(
                    0,
                    level.length -
                    VIEW_W +
                    200
                )
            )
        );
}


/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground() {

    const level =
        LEVELS[
            currentLevel - 1
        ];


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


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        VIEW_W,
        VIEW_H
    );


    /* الشمس */

    ctx.fillStyle =
        "rgba(255,235,130,.9)";

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
        "rgba(80,120,140,.35)";


    for (
        let i = -1;
        i < 8;
        i++
    ) {

        const x =
            i * 350 -
            (
                cameraX *
                0.25 %
                350
            );


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
        "rgba(255,255,255,.75)";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const x =
            i * 300 -
            (
                cameraX *
                0.12 %
                300
            );

        const y =
            80 +
            (i % 3) * 55;

        drawCloud(
            x,
            y
        );
    }
}


function drawCloud(
    x,
    y
) {

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


    const level =
        LEVELS[
            currentLevel - 1
        ];


    /* الأرض والمنصات */

    for (
        const platform of platforms
    ) {

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
                "rgba(255,255,255,.15)";

            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                5
            );
        }
    }


    drawCoins();

    drawPowerUps();

    drawEnemies();

    drawGoal();

    drawFireballs();

    drawPlayer();

    drawParticles();


    ctx.restore();
}


/* =========================================================
   COINS DRAW
========================================================= */

function drawCoins() {

    for (
        const coin of coins
    ) {

        if (
            coin.collected
        )
            continue;


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
            "bold 15px Arial";

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
   POWER UPS DRAW
========================================================= */

function drawPowerUps() {

    for (
        const item of powerUps
    ) {

        if (
            item.collected
        )
            continue;


        ctx.save();

        ctx.translate(
            item.x,
            item.y
        );


        if (
            item.type ===
            "mushroom"
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

    ctx.fillStyle =
        color;

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
            Math.cos(angle) *
            r;

        const py =
            y +
            Math.sin(angle) *
            r;


        if (i === 0) {

            ctx.moveTo(
                px,
                py
            );

        } else {

            ctx.lineTo(
                px,
                py
            );
        }
    }


    ctx.closePath();

    ctx.fill();
}


/* =========================================================
   ENEMY DRAW
========================================================= */

function drawEnemies() {

    for (
        const enemy of enemies
    ) {

        if (!enemy.alive)
            continue;


        let image =
            enemyImage;

        if (
            enemy.type ===
            "fly"
        ) {
            image =
                flyImage;
        }

        if (
            enemy.type ===
            "boss"
        ) {
            image =
                bossImage;
        }


        ctx.save();


        const bounce =
            Math.sin(
                enemy.animation *
                8
            ) *
            2;


        ctx.translate(
            enemy.x +
            enemy.width / 2,

            enemy.y +
            enemy.height / 2 +
            bounce
        );


        if (
            enemy.velocityX < 0
        ) {
            ctx.scale(
                -1,
                1
            );
        }


        if (
            enemy.type ===
            "boss"
        ) {

            ctx.drawImage(
                image,

                -enemy.width / 2,
                -enemy.height / 2,

                enemy.width,
                enemy.height
            );

        } else {

            ctx.drawImage(
                image,

                -enemy.width / 2,
                -enemy.height / 2,

                enemy.width,
                enemy.height
            );
        }


        ctx.restore();
    }
}


/* =========================================================
   GOAL
========================================================= */

function drawGoal() {

    if (!goal)
        return;


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
   PLAYER DRAW - NEW ORIGINAL IMAGE
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


    const walking =
        Math.abs(
            player.velocityX
        ) > 0.2;


    const bounce =
        walking &&
        player.grounded
            ? Math.sin(
                player.animation
            ) * 3
            : 0;


    ctx.translate(
        player.x +
        player.width / 2,

        player.y +
        player.height / 2 +
        bounce
    );


    ctx.scale(
        player.facing,
        1
    );


    const imageWidth =
        player.width *
        1.35;

    const imageHeight =
        player.height *
        1.35;


    ctx.drawImage(
        heroImage,

        -imageWidth / 2,

        -imageHeight / 2,

        imageWidth,

        imageHeight
    );


    /* نجمة */

    if (
        player.star > 0
    ) {

        ctx.strokeStyle =
            "#ffe044";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            42,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }


    ctx.restore();
}


/* =========================================================
   FIREBALL DRAW
========================================================= */

function drawFireballs() {

    for (
        const ball of fireballs
    ) {

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
   PARTICLES DRAW
========================================================= */

function drawParticles() {

    for (
        const p of particles
    ) {

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

    if (!gameRunning)
        return;


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

    if (!ui.lives)
        return;


    ui.lives.textContent =
        lives;


    ui.coins.textContent =
        levelCoins +
        saveData.totalCoins;


    ui.score.textContent =
        Math.floor(score);


    ui.level.textContent =
        currentLevel;


    if (
        player.star > 0
    ) {

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
            "⭐ قوي";

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

    if (!ui.message)
        return;


    ui.message.textContent =
        text;

    ui.message.style.display =
        "block";


    clearTimeout(
        messageTimeout
    );


    messageTimeout =
        setTimeout(
            function() {

                ui.message.style.display =
                    "none";

            },
            1700
        );
}


/* =========================================================
   HIDE SCREENS
========================================================= */

function hideScreens() {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            function(screen) {

                screen.classList.add(
                    "hidden"
                );
            }
        );
}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (!gameRunning)
        return;


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

    ui.levelList.innerHTML =
        "";


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

                button.disabled =
                    true;

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
   MAIN MENU BUTTONS
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

            initAudio();

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
    .querySelectorAll(
        ".backButton"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    hideScreens();

                    ui.mainMenu.classList.remove(
                        "hidden"
                    );
                }
            );
        }
    );


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
    .querySelectorAll(
        ".shop-item"
    )
    .forEach(
        function(button) {

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
        }
    );


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop() {

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

gameLoop();
