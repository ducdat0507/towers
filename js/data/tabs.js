

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
            mana: {
                title: "Mana",
            },
            karma: {
                title: "Karma",
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
                content: `
                    <div id="ritualselect" class="upgcategory">
                        <div>Select a Ritual</div>
                    </div>
                `,
            },
        },
        onshow(subtab) {
            if (subtab == "ritual") {
                let ritualselect = document.getElementById("ritualselect");

                for (let ritual in rituals) {
                    let data = rituals[ritual];

                    let btn = document.createElement("button");
                    btn.classList.add("upgbtn");

                    let gain = data.gain();
                    
                    btn.innerHTML = `
                        <div>${data.title}</div>
                        <div></div>
                        <div>+${format(gain, 0)}<br/>Next at ${format(data.inv(gain.add(1)))}</div>
                    `;

                    btn.onclick = () => {
                        let gain = data.gain();
                        if (gain.gt(0)) data.onRitual();
                    }
                    
                    ritualselect.appendChild(btn); 
                }
            }
        }
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
                content: `
                    <div class="subtitle">(Keyboard only, more control options coming soon)</div>
                    <br/>
                    <div class="upgcategory" id="keybindings">
                        <div>Keybindings</div>
                    </div>
                    <div class="subtitle">(Click the "+" button to bind a key, click a key to unbind it.)</div>
                `,
            },
            about: {
                title: "About",
                content: `
                    <div class="title">Towers of Googology</div>
                    <div class="subtitle">Defeat enemies and grow your towers - incremental style!</div>
                    <br/>
                    <div>created by ducdat0507</div>
                    <div class="subtitle">
                        <a href="https://ducdat0507.github.io">Back to home page</a>
                    </div>
                `,
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
            } else if (subtab == "control") {
                let keybindings = document.getElementById("keybindings");
                let btns = {};
                for (let key in keyBindNames) {
                    let name = keyBindNames[key];
                    let div = document.createElement("div");
                    
                    function update() {
                        div.innerHTML = name + " "
                        for (let x in game.options.keys[key]) {
                            let k = game.options.keys[key][x];
                            let btn = document.createElement("button");
                            btn.classList.add("key");
                            btn.innerHTML = getKeyName(k);

                            btn.onclick = () => {
                                game.options.keys[key].splice(x, 1);
                                update();
                            }

                            div.appendChild(btn);
                        }
                        let btn = document.createElement("button");
                        btn.classList.add("key");
                        btn.innerHTML = "+";

                        btn.onclick = () => {
                            if (currentRebind) btns[currentRebind].disabled = false;
                            currentRebind = key;
                            currentRebindEvent = update;
                            btn.disabled = true;
                        }

                        div.appendChild(btn);
                        btns[key] = btn;
                    }

                    update();

                    keybindings.appendChild(div);
                }
            }
        }
    },
}