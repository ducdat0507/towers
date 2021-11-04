

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
        subtabs: {
            general: {
                title: "General",
                content: `
                    <div class="upgcategory">
                        <div>Save Management</div>
                        <button onclick="save()">Manual Save</button>
                        <button onclick="exportSave()">Export Save</button>
                        <button onclick="showImportPopup()">Import Save</button>
                        <button onclick="showResetPopup()">RESET GAME</button>
                    </div>
                `,
            },
            display: {
                title: "Display",
            },
            control: {
                title: "Controls",
            },
        },
    },
}