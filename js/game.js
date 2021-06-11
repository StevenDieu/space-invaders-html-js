let keyStates = [];
let ship = null;
let laser = null;
let arrayAlien = [];
let moveRightVirus = true;
let sizeWindow = 0;
let spaceVirus = 0;
let numberVirus = 0;
let speedVirus = 0;
let removeSizeTop = 0;
let isWin = false;
let isLose = false;
let isHome = false;
let isStart = false;
let score = 0;
let timeStartGame = 0;
let numberShoot = 0;

document.addEventListener("touchstart", event => {
    if(event.touches.length > 1) {
        event.preventDefault();
        event.stopPropagation(); // maybe useless
    }
}, {passive: false});

document.addEventListener("touchend", event => {
    if(event.touches.length > 1) {
        event.preventDefault();
        event.stopPropagation(); // maybe useless
    }
}, {passive: false});

document.addEventListener("touchmove", function(e){
    e.preventDefault();
},{passive: false});

// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------- INIT GAME ------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------

function initGame() {
    document.getElementById("game").innerHTML = "";
    document.getElementById('game').classList.remove("hide");
    document.getElementById('home-page').classList.add("hide");
    document.getElementById('win-page').classList.add("hide");
    document.getElementById('lose-page').classList.add("hide");

    document.body.classList.remove("full-page");

    isWin = false;
    isLose = false;
    isHome = false;
    keyStates = [];
    moveRightVirus = true;
    arrayAlien = [];
    timeStartGame = new Date().getTime();
    numberShoot = 0;

    initGameWithSizeWindow();

    ship = new Sprite("assets/site_internet_vaisseau.png", 0, 0, 'size-ship');
    laser = new Sprite("assets/site_internet_laser.png", 0, 0, 'size-laser');

    const startLeft = document.body.clientWidth / 2 - 3 * spaceVirus;
    generateVirus(startLeft);
    initAllInteraction();

    arrayAlien.forEach(value => value.startAnimation(moveVirus, speedVirus));
}

function initGameWithSizeWindow() {
    if (document.body.clientWidth >= 1200) {
        sizeWindow = 1;
        spaceVirus = 70;
        numberVirus = 6;
        speedVirus = 20;
    } else if (document.body.clientWidth >= 576) {
        sizeWindow = 2;
        spaceVirus = 55;
        numberVirus = 5;
        speedVirus = 25;
    } else {
        sizeWindow = 3;
        spaceVirus = 40;
        document.getElementById('commande-mobile').classList.remove("hide");
        numberVirus = 4;
        speedVirus = 30;
    }
}

function generateVirus(startLeft) {
    for (let j = 0; j < spaceVirus * numberVirus; j = j + spaceVirus) {
        for (let i = startLeft; i < startLeft + spaceVirus * numberVirus; i = i + spaceVirus) {
            let alien = new Sprite("assets/site_internet_virus.png", i, j, 'size-virus');
            alien.display = "block";
            arrayAlien.push(alien);
        }
    }
}

function initAllInteraction() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    document.getElementById('arrow-left').addEventListener("touchstart", function (event) {
        onMouseDownShip(event,'ArrowLeft')
    }, {passive: false});
    document.getElementById('arrow-left').addEventListener("touchend", function (event) {
        onMouseUpShip( event, 'ArrowLeft')
    }, {passive: false});

    document.getElementById('arrow-right').addEventListener("touchstart", function (event) {
        onMouseDownShip(event,'ArrowRight')
    }, {passive: false});
    document.getElementById('arrow-right').addEventListener("touchend", function (event) {
        onMouseUpShip( event, 'ArrowRight')
    }, {passive: false});

    document.getElementById('shout').addEventListener("touchstart", function (event) {
        shoutTouch(event)
    }, {passive: false});
}

function moveVirus(virus) {
    if (moveRightVirus) {
        virus.left += 3;
        arrayAlien
            .filter(value => value.display !== "none")
            .forEach(value => {
                if (value.left > document.body.clientWidth - virus._node.width && moveRightVirus) {
                    arrayAlien.forEach(value => value.top += spaceVirus);
                    moveRightVirus = false;
                }
            });
    } else {
        virus.left -= 3;
        arrayAlien
            .filter(value => value.display !== "none")
            .forEach(value => {
                if (value.left <= 0 && !moveRightVirus) {
                    arrayAlien.forEach(value => value.top += spaceVirus);
                    moveRightVirus = true;
                }
            });
    }

    if (virus.checkCollision(ship)) {
        isLose = true;
        arrayAlien
            .filter(value => value.display !== "none")
            .forEach(value => value.stopAnimation());
    }
}

function onMouseDownShip(event, cmd) {
    if(event.touches.length > 1) {
        event.preventDefault();
        event.stopPropagation(); // maybe useless
    }
    keyStates[cmd] = true
}

function onMouseUpShip(event, cmd) {
    if(event.touches.length > 1) {
        event.preventDefault();
        event.stopPropagation(); // maybe useless
    }
    keyStates[cmd] = false
}

function shoutTouch(event) {
    if(event.touches.length > 1) {
        event.preventDefault();
        event.stopPropagation(); // maybe useless
    }
    shout();
}

function onKeyDown(e) {
    e.preventDefault();
    keyStates[e.key] = true;
}

function onKeyUp(e) {
    e.preventDefault();
    keyStates[e.key] = false;
}

function reziseAllElement() {
    ship.display = "block";
    setTopShip();
    ship.left = document.body.clientWidth / 2 - (ship._node.width / 2);
}

function setTopShip() {
    removeSizeTop = 0;
    if (sizeWindow === 3) {
        removeSizeTop = 80;
    }

    ship.top = window.innerHeight - ship._node.height - 10 - removeSizeTop;
}

function shout() {
    if (laser.display === "none") {
        numberShoot++;
        laser.display = "block";
        laser.left = ship.left + (ship._node.width - laser._node.width) / 2;
        laser.top = ship.top;
        laser.startAnimation(moveLaser, 6);
    }
}

function moveLaser(laser) {
    laser.top -= 10;
    if (laser.top < -40) {
        laser.stopAnimation();
        laser.display = "none";
    }

    arrayAlien
        .filter(value => value.display !== "none")
        .forEach(value => {
            if (value.checkCollision(laser)) {
                laser.stopAnimation();
                laser.display = "none";
                value.display = "none";
                value.stopAnimation();
            }
        });

    isWin = arrayAlien.filter(value => value.display !== "none").length === 0;
}

// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// ------------------------------------- START GAME ------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------

function launchGame() {
    initGame();

    ship._node.onload = function () {
        reziseAllElement();

        window.onresize = function () {
            reziseWindows();
        };

        animate();
    }
}

function animate() {
    isStart = true;

    if (keyStates["ArrowLeft"] === true) {
        ship.left -= 10;
    }
    if (keyStates["ArrowRight"] === true) {
        ship.left += 10;
    }

    if (ship.left < 0) ship.left = 0;
    if (ship.left > document.body.clientWidth - ship._node.width) ship.left = document.body.clientWidth - ship._node.width;

    if (keyStates[" "] === true) {
        shout();
    }

    if (isWin) {
        calculScore();
        goToPage('win-page');
    } else if (isLose) {
        goToPage('lose-page');
    } else if (isHome) {
        goToPage('home-page');
    } else {
        requestAnimationFrame(animate);
    }
}

function calculScore() {
    score = 0;
    score = score + (numberVirus * 20);
    score = score + (320 / numberShoot);
    score = score + (320 / ((new Date().getTime() - timeStartGame) / 100));
    document.getElementById("score").innerHTML = parseInt(score);

}

function goToPage(page) {
    document.getElementById('game').classList.add("hide");
    document.getElementById('commande-mobile').classList.add("hide");
    document.getElementById(page).classList.remove("hide");
    document.body.classList.add("full-page");
    isStart = false;
}

function reziseWindows() {
    if (isStart) {
        if (ship.left < 0) ship.left = 0;
        if (ship.left > document.body.clientWidth - ship._node.width) ship.left = document.body.clientWidth - ship._node.width;
        setTopShip();

        if (document.body.clientWidth >= 1200 && sizeWindow !== 1) {
            isHome = true;
        } else if (document.body.clientWidth >= 576 && document.body.clientWidth < 1200 && sizeWindow !== 2) {
            isHome = true;
        } else if (document.body.clientWidth < 576 && sizeWindow !== 3) {
            isHome = true;
        }
    }
}

(function () {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
})();
