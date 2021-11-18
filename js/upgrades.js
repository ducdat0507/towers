let upgTimeout = 0;
let upgButtons = {};
let upgCategories = {};

function isUpgPriced(data) {
    return (data.costType != "points" || !game.upgrades.l3_5) && 
        (data.costType != "loot" || !game.upgrades.b4_1) && 
        (data.costType != "bricks" || !game.upgrades.k3_3);
}

function makeUpgGUI (type) {
    let upglist = document.getElementById("upglist");

    upgCategories = {};
    upgButtons = {};

    for (let upg in upgrades)  {
        let data = upgrades[upg];
        if (data.costType != type) continue;

        let btn = document.createElement("button");
        btn.classList.add("upgbtn");

        if (!upgCategories[data.category]) {
            let cat = document.createElement("div");
            cat.classList.add("upgcategory");

            let head = document.createElement("div");
            head.innerHTML = data.category;
            head.onclick = () => cat.classList.toggle("collapsed");

            cat.appendChild(head);

            upgCategories[data.category] = cat;
            upglist.appendChild(cat);
        }

        btn.onmousedown = () => {
            if (game.tipStage >= 6) upgTimeout = setTimeout(() => buyMax(upg), 500)
        }
        btn.onmouseup = () => {
            clearTimeout(upgTimeout);
        }
        btn.onclick = () => {
            buyOne(upg);
        };

        upgButtons[upg] = btn;
        upgCategories[data.category].appendChild(btn);
    }
    updateUpgGUI();
}

function updateUpgGUI() {

    subtabButtons.loot.style.display = game.upgrades.f2_3.gt(0) ? "" : "none";
    if (game.upgrades.f2_3.gt(0)) lootbox.style.display = "";
    subtabButtons.bricks.style.display = game.upgrades.l3_4 ? "" : "none";
    if (game.upgrades.l3_4) lootbox.style.display = "";
    subtabButtons.mana.style.display = subtabButtons.karma.style.display = game.upgrades.b4_3 ? "" : "none";

    for (let cat in upgCategories) {
        let div = upgCategories[cat];
        div.style.display = "none";
    }
    for (let upg in upgButtons) {
        let data = upgrades[upg];
        let btn = upgButtons[upg];
        let level = game.upgrades[upg];

        if (hasUpg(upg) || !data.req || hasUpg(data.req[0], data.req[1])) {
            btn.style.display = "";
            upgCategories[data.category].style.display = "";
            let eff = "";
            if (typeof data.disp == "function") eff = data.disp(level);
            if (data.disp == "effect") eff = format(data.effect(level));
            else if (data.disp == "level") eff = "Level " + format(level);
    
            btn.disabled = data.isBool ? level : level.gte(data.max);

            btn.innerHTML = `
                <div>${data.title}</div>
                <div>${eff}</div>
                <div>${data.desc}</div>
                <div>${data.isBool ? (level ? "Bought" : format(data.cost(level))) : (level.gte(data.max) ? "Maxed out" : format(data.cost(level)))}</div>
            `;
        } else if (data.tease && (!data.teaseReq || hasUpg(data.teaseReq[0], data.teaseReq[1]))) {
            btn.style.display = "";
            upgCategories[data.category].style.display = "";

            btn.disabled = true;

            btn.innerHTML = `
                <div></div><div></div>
                <div>${data.tease}</div>
                <div>Locked</div>
            `;
        } else {
            btn.style.display = "none";
        }
    }
    updateGUI();
}

function hasUpg(id, thres = 1) {
    return upgrades[id].isBool ? game.upgrades[id] : game.upgrades[id].gte(thres)
}

function buyOne(upg, update = true) {
    let data = upgrades[upg];
    let level = game.upgrades[upg];
    let cost = data.cost(level);
    if ((!data.isBool || !level) && (!data.max || level.lt(data.max)) && game[data.costType].gte(cost)) {
        if (isUpgPriced(data)) game[data.costType] = game[data.costType].sub(cost).max(0);
        game.upgrades[upg] = data.isBool ? true : game.upgrades[upg].add(1);
        famebox.innerHTML = format(game.points, 0);
        lootbox.innerHTML = format(game.loot, 0);
        brickbox.innerHTML = format(game.bricks, 0);
        manabox.innerHTML = format(game.mana, 0);
        karmabox.innerHTML = format(game.karma, 0);
        if (data.onBuy) data.onBuy();
        if (update) updateUpgGUI();
    };
}

function buyMax(upg, update = true) {
    let data = upgrades[upg];
    if (data.isBool) buyOne(upg);
    else {
        let level = game.upgrades[upg];
        if (data.invSum) {
            let inv = data.inv(level, game[data.costType]).min(data.max ? data.max.sub(level) : Infinity);
            if (inv.gt(0)) {
                let cost = data.invSum(level, inv);
                if (isUpgPriced(data)) game[data.costType] = game[data.costType].sub(cost).max(0);
                game.upgrades[upg] = inv.add(level);
                famebox.innerHTML = format(game.points, 0);
                lootbox.innerHTML = format(game.loot, 0);
                brickbox.innerHTML = format(game.bricks, 0);
                manabox.innerHTML = format(game.mana, 0);
                karmabox.innerHTML = format(game.karma, 0);
                if (data.onBuy) data.onBuy();
                if (update) updateUpgGUI();
            }
        } else {
            let inv = data.inv(game[data.costType]).min(data.max ? data.max.sub(1) : Infinity);
            if (inv.gte(level)) {
                let cost = data.cost(inv);
                if (isUpgPriced(data)) game[data.costType] = game[data.costType].sub(cost).max(0);
                game.upgrades[upg] = inv.add(1);
                famebox.innerHTML = format(game.points, 0);
                lootbox.innerHTML = format(game.loot, 0);
                brickbox.innerHTML = format(game.bricks, 0);
                manabox.innerHTML = format(game.mana, 0);
                karmabox.innerHTML = format(game.karma, 0);
                if (data.onBuy) data.onBuy();
                if (update) updateUpgGUI();
            }
        }
    }
}

function buyMaxType(type) {
    for (let upg in upgrades) {
        let data = upgrades[upg];
        if (data.costType == type) buyMax(upg, false);
    }
    if (currentTab == "upgrades" && tabSubtabs.upgrades == type) updateUpgGUI();
}

function upgEffect(id) {
    return upgrades[id].effect(game.upgrades[id]);
}