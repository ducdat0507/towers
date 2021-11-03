let game = {}

function getStartGame() {
    let start = {
        points: EN(0),
        pointsTotal: EN(0),
        loot: EN(0),
        lootTotal: EN(0),

        tipStage: 0,
        tipShown: true,
        level: null,
        levelBase: null,

        upgrades: {}
    }

    for (upg in upgrades) {
        start.upgrades[upg] = EN(0);
    }

    return start;
}

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) target[item] = source[item];
        else if (source[item] instanceof EN) target[item] = EN(target[item]);
        else if (typeof source[item] == "object") target[item] = deepCopy(target[item], source[item]);
    }
    return target;
}

function load() {
    try {
        game = deepCopy(JSON.parse(atob(localStorage.getItem("tower"))), getStartGame());
        console.log(game);
        game.level = fixLevel(game.level);
        game.levelBase = fixLevel(game.levelBase);
    } catch (e) {
        console.log(e);
        game = getStartGame();
    }
}

function save() {
    localStorage.setItem("tower", btoa(JSON.stringify(game)));
}