

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
            bricks: {
                title: "Bricks",
            },
        },
        onshow(subtab) {
            makeUpgGUI(subtab);
        }
    },
    grimoire: {
        title: "Grimoire",
        content: `
            Coming soon...
        `,
        subtabs: {
            ritual: {
                title: "The Ritual",
            },
        },
    },
    options: {
        title: "Options",
        content: `
            Coming soon...
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
                content: `
                    <div class="upgcategory" id="worldthemediv">
                        <div>World Themes</div>
                    </div>
                `,
            },
            control: {
                title: "Controls",
            },
        },
        onshow(subtab) {
            if (subtab == "display") {
                let worldthemediv = document.getElementById("worldthemediv");
                let btns = {};
                for (let theme in worldThemes) {
                    let data = worldThemes[theme];
                    let btn = document.createElement("button");
                    btn.innerHTML = data.title;

                    btn.onclick = () => {
                        btns[game.options.worldTheme].disabled = false;
                        game.options.worldTheme = theme;
                        btns[theme].disabled = true;
                        canvasDirty = true;
                    }

                    btn.disabled = game.options.worldTheme == theme;

                    worldthemediv.appendChild(btn);
                    btns[theme] = btn;
                }
            }
        }
    },
}