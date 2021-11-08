

// ------------------------------------------------------------------------------------------ Initialization

let canvas, ctx, tipbox, famebox, lootbox, menu, touchdiv, tablist, tabbox, subtablist, tabcontent;

let touchPos = null;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d", { alpha: false });
    tipbox = document.getElementById("tipbox");
    famebox = document.getElementById("famebox");
    lootbox = document.getElementById("lootbox");
    menu = document.getElementById("menu");
    touchdiv = document.getElementById("touchdiv");
    tablist = document.getElementById("tablist");
    tabbox = document.getElementById("tabbox");
    subtablist = document.getElementById("subtablist");
    tabcontent = document.getElementById("tabcontent");

    initTabs();

    document.body.onresize = (e) => { canvasDirty = true; }
    document.body.onkeydown = (e) => {
        if (game.tipStage >= 2) {
                 if (["w", "W", "ArrowUp"].includes(e.key)) movePlayer([0, 1]);
            else if (["s", "S", "ArrowDown"].includes(e.key)) movePlayer([0, -1]);
            else if (["d", "D", "ArrowRight"].includes(e.key)) movePlayer([1, 0]);
            else if (["a", "A", "ArrowLeft"].includes(e.key)) movePlayer([-1, 0]);
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

    if (!game.level || isLevelCompleted()) {
        game.levelBase = makeLevel(1);
        game.level = fixLevel(JSON.parse(JSON.stringify(game.levelBase)));
    } else if (!getPlayerPos()) {
        game.level = fixLevel(JSON.parse(JSON.stringify(game.levelBase)));
    }
    
    if (game.pointsTotal.gt(0)) {
        famebox.innerHTML = format(game.points);
        famebox.classList.remove("hidden");
    }
    if (game.upgrades.f2_3.gt(0)) {
        lootbox.innerHTML = format(game.loot, 0);
        lootbox.classList.remove("hidden");
    }
    if (game.upgrades.l3_4) {
        brickbox.innerHTML = format(game.bricks, 0);
        brickbox.classList.remove("hidden");
    }
    if (game.pointsTotal.gte(1500)) menu.classList.remove("hidden");

    now = Date.now();
    gameLoop();

    if (game.tipShown) showTip();

    console.log("Loaded");
}

function makeAddEffect(elem, diff) {
    elem.classList.remove("addEffect");
    elem.offsetWidth;
    elem.setAttribute("diff", diff);
    elem.classList.add("addEffect");
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
            player[1] = player[1].add(tile[0][1].pow(upgEffect("l3_1").add(1)).pow(upgEffect("b4").add(1)));
            tile.shift();
            tile.unshift(player);
        } else {
            tile[0][1] = tile[0][1].add(player[1]);
            playerFail = true;
        }
    } else if (tile[0][0] == "loot") {
        let gain = tile[0][1].mul(upgEffect("f3")).mul(upgEffect("b2"));
        if (game.upgrades.f3_1) gain = gain.mul(upgEffect("f1_1"));
        if (game.upgrades.f3_2) gain = gain.mul(upgEffect("f1_2"));
        game.loot = game.loot.add(gain);
        game.lootTotal = game.lootTotal.add(gain);
        lootbox.innerHTML = format(game.loot, 0);
        makeAddEffect(lootbox, "+" + format(gain, 0));

        let oldPoints = EN(game.points);
        game.points = game.points.mul(gain.pow(upgEffect("l3_3")));
        game.pointsTotal = game.pointsTotal.add(game.points.sub(oldPoints));
        famebox.innerHTML = format(game.points, 0);
        if (game.points.neq(oldPoints)) makeAddEffect(famebox, "×" + format(game.points.div(oldPoints), 0));

        tile.shift();
        tile.unshift(player);
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
        let gain = player[1].pow(upgEffect("f1_2")).mul(upgEffect("f1")).mul(upgEffect("l1")).pow(upgEffect("f1_1")).pow(upgEffect("l1_1")).pow(upgEffect("b1"));
        if (game.upgrades.l3_6) {
            let oldPoints = game.points;
            game.points = game.points.mul(gain).max(gain);
            game.pointsTotal = game.pointsTotal.add(game.points.sub(oldPoints));
            makeAddEffect(famebox, "×" + format(gain, 0));
        } else {
            game.points = game.points.add(gain);
            game.pointsTotal = game.pointsTotal.add(gain);
            makeAddEffect(famebox, "+" + format(gain, 0));
        }
        
        famebox.innerHTML = format(game.points, 0);
        famebox.classList.remove("hidden");
        if (game.pointsTotal.gte(1500)) menu.classList.remove("hidden");

        if (game.upgrades.l3_4) {
            let bricks = 0;
            for (tower of game.level) bricks += tower.length;
            if (game.upgrades.b3.gt(0)) bricks = player[1].max(1e10).log10().log10().pow(upgEffect("b3")).mul(bricks);
            if (game.upgrades.b3_1.gt(0)) bricks = game.upgrades.f2.add(1).pow(upgEffect("b3_1")).mul(bricks);
            game.bricks = game.bricks.add(bricks);
            game.bricksTotal = game.bricksTotal.add(bricks);
            brickbox.innerHTML = format(game.bricks, 0);
            makeAddEffect(brickbox, "+" + format(bricks, 0));
        }

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
    } else if (game.upgrades.l3 && game.level[pPos[0] + offset[0]].length == 1) {
        game.levelBase = fixLevel(JSON.parse(JSON.stringify(game.level)));
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
            
            let chance = 1;

            if (upgEffect("f2_3").gt(Math.random() * chance)) {
                let loot = EN(Math.random()).mul(upgEffect("l2_2")).add(upgEffect("l2_1")).mul(upgEffect("l2"));
                tower[p].push(["loot", loot]);
            } else {
                tower[p].push(["enemy", startAmount.floor()]);
                startAmount = startAmount.mul(upgEffect("f2_2").mul(Math.random()).add(1)).pow(upgEffect("l3_1").add(1).pow(upgEffect("l3_2")));
            }

            
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