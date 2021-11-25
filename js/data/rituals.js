let rituals = {
    mana: {
        title: "Mana Ritual",
        gain() { return game.points.gte("eee50") ? game.points.max(10).slog(10).pow(1.2).div(3 ** 0.2).mul(upgEffect("k1_3")).mul(upgEffect("e1_1")).floor() : EN(0); },
        inv(x) { return EN.tetr(10, x.div(upgEffect("e1_1")).div(upgEffect("k1_3")).mul(3 ** 0.2).root(1.2)).max("eee50"); },
        onRitual() {
            let gain = this.gain();
            game.mana = game.mana.add(gain);
            game.manaTotal = game.manaTotal.add(gain);
            manabox.innerHTML = format(game.mana, 0);
            manabox.classList.remove("hidden");
            makeAddEffect(manabox, "+" + format(gain, 0));

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
    elemite: {
        title: "Elemite Ritual",
        req: ["e3"],
        gain() { return game.points.gte("10^^e1000") ? game.points.max(10).slog(10).log10().div(999).log10().mul(10).pow(upgEffect("e1_3")).mul(upgEffect("e1_4")) : EN(0); },
        gainText(x) { return "×" + format(game.misc.elemiteMul) + " -> ×" + format(game.misc.elemiteMul.add(x)); },
        inv(x) { return "" },
        onRitual() {
            let gain = this.gain();
            game.misc.elemiteMul = game.misc.elemiteMul.add(gain);

            game.points = game.loot = game.bricks = game.mana = game.karma = EN(0);
            famebox.innerHTML = lootbox.innerHTML = brickbox.innerHTML = manabox.innerHTML = karmabox.innerHTML = format(0, 0);
            for (let upg in upgrades) {
                let data = upgrades[upg];
                if (["points", "loot", "bricks", "mana", "karma"].includes(data.costType)) {
                    game.upgrades[upg] = data.isBool ? false : EN(0);
                }
            }

            game.upgrades.b4_3 = game.upgrades.m2 = game.upgrades.m2_1 = game.upgrades.l3_5 = game.upgrades.b4_1 = true;
            game.upgrades.f2_3 = game.upgrades.k1 = game.upgrades.k1_1 = game.upgrades.k1_2 = EN(10);
            if (game.upgrades.e3_1) game.upgrades.k3_13 = game.upgrades.k2_3 = true;
            if (game.upgrades.e3_2) game.upgrades.k3_15 = game.upgrades.k2_4 = true;
            game.levelBase = makeLevel(1);
            game.level = fixLevel(JSON.parse(JSON.stringify(game.levelBase)));

            canvasDirty = true;
            setTab("");
        },
    },
}