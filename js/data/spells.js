let spells = {
    fire: {
        title: "Spell of Fire",
        desc: "Embrace the rage of Fire, making the \"Karma to Power\" and \"Karma to Loot to Fame\" effect to Fame 2× better for the next {DUR} levels.",
        duration() { return 10; },
        cooldown() { return upgEffect("e2_4"); },
        cost() { return EN(50).mul(EN.pow(1.1, game.upgrades.e2)).mul(EN.pow(1.2, game.upgrades.e2_4)) },
    },
    ice: {
        title: "Spell of Ice",
        desc: "Freeze all enemies with Ice, making them unable to attack and can be absorbed regardless of their Power for the next {DUR} levels.",
        duration() { return upgEffect("e2_1"); },
        cooldown() { return upgEffect("e2_5"); },
        cost() { return EN(40).mul(EN.pow(1.1, game.upgrades.e2_1)).mul(EN.pow(1.2, game.upgrades.e2_5)) },
    },
    earth: {
        title: "Spell of Earth",
        desc: "Absorb the absorb powers of the Earth, making your Karma gain 2× better for the next {DUR} levels.",
        duration() { return 10; },
        cooldown() { return upgEffect("e2_6"); },
        cost() { return EN(60).mul(EN.pow(1.1, game.upgrades.e2_2)).mul(EN.pow(1.2, game.upgrades.e2_6)) },
    },
    wind: {
        title: "Spell of Wind",
        desc: "Lean yourself to the Wind, and let the game play itself (badly) for the next {DUR} levels. Can be toggled in the Automation tab, but it'll still be counted when off.",
        duration() { return upgEffect("e2_3"); },
        cooldown() { return upgEffect("e2_7"); },
        cost() { return EN(80).mul(EN.pow(1.1, game.upgrades.e2_3)).mul(EN.pow(1.2, game.upgrades.e2_7)).mul(EN.pow(1.1, game.upgrades.e2_8)) },
    },
}