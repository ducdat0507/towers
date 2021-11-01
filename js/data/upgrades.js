let upgrades = {
    "f1": {
        title: "Fame Multiplier",
        desc: "Increases Fame gain by ×2, compounding.",
        disp(x) { return "×" + format(this.effect(x), 0); },
        cost(x) { return EN(1500).mul(EN.pow(x / 10 + 2.9, x)); },
        effect(x) { return EN.pow(2, x); }
    },
    "f1_1": {
        title: "Fame Exponent",
        desc: "Increases Fame gain by ^+0.05, additively.",
        disp(x) { return "^" + format(this.effect(x)); },
        cost(x) { return EN(10000).mul(EN.pow(x + 1, EN.pow(1.12, x).add(x))); },
        effect(x) { return EN.mul(0.05, x).add(1); }
    },
    "f2": {
        title: "Level Difficulty",
        desc: "Make levels bigger and spawn more enemies.",
        disp(x) { return "Level " + format(x + 1, 0); },
        cost(x) { return EN(5000).tetrate(x / 100 + 1); },
    },
}