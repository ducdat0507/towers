

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
            elemite: {
                title: "Elemite",
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
            elem: {
                title: "The Elemental",
                content: `
                    <div id="elemspells" class="upgcategory">
                        <div>Elemental Spells</div>
                    </div>
                `,
            },
            rift: {
                title: "The Rift",
                content: `
                    <div><div id="riftbar">
                        ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br/>
                        ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br/>
                        ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br/>
                        ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
                    </div></div>
                    <div id="rifttitle" class="title">
                        The rift is silent.
                    </div>
                    <div id="riftdesc" class="subtitle">
                        Charge the rift by casting spells. The more expensive the spell, the more charge it gives.
                    </div>
                    <br/>
                    <button id="riftbutton">Enter the rift</button>
                `,
            },
        },
        onshow(subtab) {
            subtabButtons.elem.style.display = game.upgrades.m2 ? "" : "none";
            subtabButtons.rift.style.display = game.upgrades.e3 ? "" : "none";
            if (subtab == "ritual") {
                makeRitualGUI();
            } else if (subtab == "elem") {
                makeSpellGUI();
            } else if (subtab == "rift") {
                updateRiftGUI();
            }
        }
    },
    auto: {
        title: "Automation",
        content: `
            <div class="upgcategory" id="autocontrol">
                <div>Automation Control</div>
            </div>
        `,
        onshow() {
            let autocontrol = document.getElementById("autocontrol");
            let btns = {};
            for (let auto in autos) {
                let data = autos[auto];
                if (data.req && !hasUpg(data.req[0], data.req[1])) continue;
                let btn = document.createElement("button");
                btn.classList.add("upgbtn");
                btn.innerHTML = "<div>" + data.title + "</div><div>" + (game.auto[auto] ? "ON" : "OFF") + "</div>";

                btn.onclick = () => {
                    game.auto[auto] = !game.auto[auto]
                    btn.innerHTML = "<div>" + data.title + "</div><div>" + (game.auto[auto] ? "ON" : "OFF") + "</div>";
                }

                autocontrol.appendChild(btn);
                btns[auto] = btn;
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
                    <div class="upgcategory" id="touchcontrols">
                        <div>Touch Controls</div>
                        <button id="touchscheme">Scheme: Full Swipe</button>
                    </div>
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
            makeOptionsGUI(subtab);
        }
    },
}