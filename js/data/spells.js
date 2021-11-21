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
}