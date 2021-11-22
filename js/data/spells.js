let spells = {
    fire: {
        title: "Spell of Fire",
        desc: "Embrace the rage of Fire, making the \"Karma to Power\" and \"Karma to Loot to Fame\" effect to Fame 2× better for the next {DUR} levels.",
        duration: 10,
        cooldown: 10,
        cost() { return EN(50) },
    },
    ice: {
        title: "Spell of Ice",
        desc: "Freeze all enemies with Ice, making them unable to attack and can be absorbed regardless of their Power for the next {DUR} levels.",
        duration: 10,
        cooldown: 10,
        cost() { return EN(40) },
    },
    earth: {
        title: "Spell of Earth",
        desc: "Absorb the absorb powers of the Earth, making your Karma gain 2× better for the next {DUR} levels.",
        duration: 10,
        cooldown: 10,
        cost() { return EN(60) },
    },
    wind: {
        title: "Spell of Wind",
        desc: "Lean yourself to the Wind, and let the game play itself (badly) for the next {DUR} levels. Can be toggled in the Automation tab, but it'll still be counted when off.",
        duration: 10,
        cooldown: 10,
        cost() { return EN(80) },
    },
}