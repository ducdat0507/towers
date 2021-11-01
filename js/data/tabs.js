let tabs = {
    upgrades: {
        title: "Upgrades",
        content: `
            <div id="upglist"></div>
        `,
        onshow() {
            let upglist = document.getElementById("upglist");
            for (let upg in upgrades) {
                let data = upgrades[upg];
                let btn = document.createElement("button");
                btn.classList.add("upgbtn");

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

                btn.onclick = () => {
                    let level = game.upgrades[upg];
                    let cost = data.cost(level);
                    if (game.points.gte(cost)) {
                        game.points = game.points.sub(cost);
                        game.upgrades[upg]++;
                        famebox.innerHTML = format(game.points, 0);
                        update();
                    };
                };

                update();

                upglist.appendChild(btn);
            }
        }
    },
    options: {
        title: "Options",
        content: `
            Nothing's here yet...
        `,
    },
}