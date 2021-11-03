let upgTimeout = 0;
let upgCategories = {};

function makeUpgGUI () {
    let upglist = document.getElementById("upglist");

    upgCategories = {};

    for (let upg in upgrades) {
        let data = upgrades[upg];
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

        function update() {
            let eff = "";
            let level = game.upgrades[upg];
            if (typeof data.disp == "function") eff = data.disp(level);
            if (data.disp == "effect") eff = format(data.effect(level));
            else if (data.disp == "level") eff = "Level " + format(level);

            btn.innerHTML = `
                <div>${data.title}</div>
                <div>${eff}</div>
                <div>${data.desc}</div>
                <div>${format(data.cost(level))}</div>
            `;
        }
        btn.onmousedown = () => {
            if (game.tipStage >= 6) upgTimeout = setTimeout(() => {
                let level = game.upgrades[upg];
                let inv = data.inv(game.points);
                console.log(level.toNumber() + " " + inv.toNumber());
                if (inv.gte(level)) {
                    let cost = data.cost(inv);
                    game.points = game.points.sub(cost);
                    game.upgrades[upg] = inv.add(1);
                    famebox.innerHTML = format(game.points, 0);
                    update();
                }
            }, 500)
        }
        btn.onmouseup = () => {
            clearTimeout(upgTimeout);
        }
        btn.onclick = () => {
            let level = game.upgrades[upg];
            let cost = data.cost(level);
            if (game.points.gte(cost)) {
                game.points = game.points.sub(cost);
                game.upgrades[upg] = game.upgrades[upg].add(1);
                famebox.innerHTML = format(game.points, 0);
                update();
            };
        };

        update();

        upgCategories[data.category].appendChild(btn);
    }
}

function upgEffect(id) {
    return upgrades[id].effect(game.upgrades[id]);
}