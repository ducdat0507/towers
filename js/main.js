

// ------------------------------------------------------------------------------------------ Initialization

let canvas, ctx, tipbox, famebox, menu, touchdiv, tablist, tabbox;

let touchPos = null;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d", { alpha: false });
    tipbox = document.getElementById("tipbox");
    famebox = document.getElementById("famebox");
    menu = document.getElementById("menu");
    touchdiv = document.getElementById("touchdiv");
    tablist = document.getElementById("tablist");
    tabbox = document.getElementById("tabbox");

    initTabs();

    document.body.onresize = (e) => { canvasDirty = true; }
    document.body.onkeydown = (e) => {
        if (game.tipStage >= 2) {
                 if (e.key == "w" || e.key == "ArrowUp") movePlayer([0, 1]);
            else if (e.key == "s" || e.key == "ArrowDown") movePlayer([0, -1]);
            else if (e.key == "d" || e.key == "ArrowRight") movePlayer([1, 0]);
            else if (e.key == "a" || e.key == "ArrowLeft") movePlayer([-1, 0]);
        }
    }
    tipbox.onclick = (e) => {
        if (tips[game.tipStage].advClick) {
            game.tipStage++;
            hideTip();
            setTimeout(showTip, 500);
        } else if (tips[game.tipStage].disClick) {
            game.tipShown = false;
            hideTip();
        }
    }

    touchdiv.ontouchstart = (e) => {
        touchPos = [e.pageX, e.pageY];
    }
    touchdiv.ontouchend = (e) => {
        let tPos = [e.pageX - touchPos[0], e.pageY - touchPos[1]];
        if (tPos[0] ** 2 + tPos[1] ** 2 > 100) {
            if (Math.abs(tPos[0]) > Math.abs(tPos[1])) movePlayer([Math.sign(tPos[0]), 0]);
            else movePlayer([0, -Math.sign(tPos[1])]);
        }
    }
    
    load();

    if (!game.level) {
        game.levelBase = makeLevel(1);
        game.level = fixLevel(JSON.parse(JSON.stringify(game.levelBase)));
    }
    
    if (game.pointsTotal.gt(0)) {
        famebox.innerHTML = format(game.points);
        famebox.classList.remove("hidden");
    }
    if (game.pointsTotal.gte(1500)) menu.classList.remove("hidden");

    now = Date.now();
    gameLoop();

    if (game.tipShown) showTip();

    console.log("Loaded");
}

// ------------------------------------------------------------------------------------------ Tower Logic

function getPlayerPos() {
    let x = 0;
    for (tower of game.level) {
        let y = 0;
        for (cell of tower) {
            for (obj of cell) {
                if (obj[0] == "player") return [x, y];
            }
            y++;
        }
        x++;
    }
    return null;
}

function getTower(x) {
    if (!game.level[x]) return null;
    return game.level[x];
}

function getTile(pos) {
    if (!game.level[pos[0]] || !game.level[pos[0]][pos[1]]) return null;
    return game.level[pos[0]][pos[1]];
}

function isLevelCompleted() {
    return game.level[game.level.length - 1].length == 1 && getTile([game.level.length - 1, 0])[0][0] == "player";
}

function movePlayer(offset) {
    let pPos = getPlayerPos();
    if (!pPos) return;
    let pTile = getTile(pPos);
    let tile = getTile([pPos[0] + offset[0], pPos[1] + offset[1]]);
    if (!tile) return;

    if (offset[0] == -1) return;
    else if (offset[0] == 1 && getTower(pPos[0]).length > 1) return;

    player = pTile.shift();

    let playerFail = false;

    if (!tile[0]) {
        tile.unshift(player);
    } else if (tile[0][0] == "enemy") {
        if (player[1].gte(tile[0][1])) {
            player[1] = player[1].add(tile[0][1]);
            tile.shift();
            tile.unshift(player);
        } else {
            tile[0][1] = tile[0][1].add(player[1]);
            playerFail = true;
        }
    } else {
        tile.unshift(player);
    }

    if (!pTile.length && pPos[0] > 0 && getTower(pPos[0]).length > 1) {
        getTower(pPos[0]).splice(pPos[1], 1);
        getTower(pPos[0] - 1).unshift([]);
    }

    if (playerFail) {
        addAnimator(function (t) {
            if (!this.gen && t >= 500) {
                game.level = fixLevel(JSON.parse(JSON.stringify(game.levelBase)));
                this.gen = true;
            }
            t = Math.min(1000, t);
            canvasOffset[0] = 10000 / (500 - t) - 20 * Math.sign(500 - t);
            canvasDirty = true;
            return t < 1000;
        })
    } else if (isLevelCompleted()) {
        let gain = player[1].pow(upgEffect("f1_2")).mul(upgEffect("f1")).pow(upgEffect("f1_1"));
        game.points = game.points.add(gain);
        game.pointsTotal = game.pointsTotal.add(gain);
        famebox.innerHTML = format(game.points, 0);
        famebox.classList.remove("hidden");
        if (game.pointsTotal.gte(1500)) menu.classList.remove("hidden");
        addAnimator(function (t) {
            if (!this.gen && t >= 500) {
                game.levelBase = makeLevel(game.upgrades.f2.toNumber() + 1);
                game.level = fixLevel(JSON.parse(JSON.stringify(game.levelBase)));
                this.gen = true;
            }
            t = Math.min(1000, t);
            canvasOffset[0] = 10000 / (500 - t) - 20 * Math.sign(500 - t);
            canvasDirty = true;
            return t < 1000;
        })
    }

    canvasDirty = true;
}

function makeLevel(diff) {

    let startAmount = upgEffect("f2_1");

    let level = [[[["player", startAmount]]]];

    startAmount = startAmount.mul(Math.random() * .3 + .6);

    let towersFactor = Math.log10(diff * .2 + 1);
    let towers = Math.random() * Math.log2(towersFactor + 1) + 1 + towersFactor;

    let tHeight = 0;
    let tHeightFactor = 9 + diff * diff * .5;

    for (let x = 0; x < towers; x++) {
        let tower = [];

        while (Math.random() < tHeightFactor) {
            tHeight++;
            tHeightFactor /= 4;
        }
        tHeightFactor *= 1 + Math.sqrt(diff / 100);

        for (let y = 0; y < tHeight; y++) {
            tower.push([]);
        }

        let p = 0;
        let t = 0;

        while (t < 100000) {

            tower[p].push(["enemy", startAmount.floor()]);
            startAmount = startAmount.mul(upgEffect("f2_2").mul(Math.random()).add(1));
            
            if (p + 1 >= tower.length) break;
            
            if (p <= 0 || tower[p-1].length >= 3 || Math.random() < Math.max(.9 - (diff - p) / 100, .5)) p++;
            else p--;

            t++;
        }

        level.push(tower);
    }

    return level;
}

function fixLevel(level) {
    for (tower of level) for (cell of tower) for (item of cell) {
        item[1] = EN(item[1]);
    }
    return level;
}

// ------------------------------------------------------------------------------------------ Tip Logic

function showTip() {
    if (!tipbox.classList.contains("hidden")) {
        hideTip();
        setTimeout(showTip, 500);
    } else {
        let tip = tips[game.tipStage];
        tipbox.innerHTML = `<div>${tip.title}</div><div>${tip.desc}</div><div>${tip.desc2}</div>`
        tipbox.classList.remove("hidden");
    }
}
function hideTip() {
    tipbox.classList.add("hidden");
}

// ------------------------------------------------------------------------------------------ Game Loop

let delta, now;
let saveTimer = 0;

function gameLoop() {
    let n = Date.now();
    delta = n - now;
    now = n;

    if (canvasDirty) updateCanvas();
    updateAnimator();

    for (tip in tips) {
        if (tip > game.tipStage && tips[tip].req && tips[tip].req()) {
            game.tipStage = tip;
            game.tipShown = true;
            showTip();
        }
    }

    saveTimer += delta;
    if (saveTimer >= 10000) {
        save();
        saveTimer = 0;
        console.log("Game saved");
    }

    requestAnimationFrame(gameLoop);
}