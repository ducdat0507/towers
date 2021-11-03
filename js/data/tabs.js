

let tabs = {
    upgrades: {
        title: "Upgrades",
        content: `
            <div id="upglist"></div>
        `,
        subtabs: {
            points: {
                title: "Fame",
            },
            loot: {
                title: "Loot",
            },
        },
        onshow(subtab) {
            makeUpgGUI(subtab);
        }
    },
    options: {
        title: "Options",
        content: `
            Nothing's here yet...
        `,
    },
}