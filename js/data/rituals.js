let rituals = {
    mana: {
        title: "Mana Ritual",
        gain() { return game.points.gte("eee50") ? game.points.max(10).slog(10).pow(1.2).div(3 ** 0.2).mul(upgEffect("k1_3")).mul(upgEffect("e1_1")).floor() : EN(0); },
        inv(x) { return EN.tetr(10, x.mul(upgEffect("e1_1")).div(upgEffect("k1_3")).mul(3 ** 0.2).root(1.2)).max("eee50"); },
        onRitual() {
            let gain = this.gain();
            game.mana = game.mana.add(gain);
            game.manaTotal = game.manaTotal.add(gain);
            manabox.innerHTML = format(game.mana, 0);
            manabox.classList.remove("hidden");

            game.points = game.loot = game.bricks = EN(0);
            famebox.innerHTML = lootbox.innerHTML = brickbox.innerHTML = format(0, 0);
            for (let upg in upgrades) {
                let data = upgrades[upg];
                if (["points", "loot", "bricks"].includes(data.costType)) {
                    game.upgrades[upg] = data.isBool ? false : EN(0);
                }
            }
            // game.upgrades.f2_3 = EN(1);
            // game.upgrades.l3_4 = true;
            game.upgrades.b4_3 = true;
            if (game.upgrades.k3_4) game.upgrades.l3_5 = true;
            if (game.upgrades.k3_6) game.upgrades.b4_1 = true;
            game.levelBase = makeLevel(1);
            game.level = fixLevel(JSON.parse(JSON.stringify(game.levelBase)));

            lootbox.classList.add("hidden");
            brickbox.classList.add("hidden");

            canvasDirty = true;
            setTab("");
        },
    },
}