

let tabs = {
    upgrades: {
        title: "Upgrades",
        content: `
            <div id="upglist"></div>
        `,
        onshow() {
            makeUpgGUI();
        }
    },
    options: {
        title: "Options",
        content: `
            Nothing's here yet...
        `,
    },
}