function makeOptionsGUI(subtab) {
    
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

        // Touch
        let touchbtns = {};
        {
            let touchscheme = document.getElementById("touchscheme");

            let update = function() {
                touchscheme.innerHTML = "Scheme: " + ["Full Swipe", "Continuous", "D-Pad"][game.options.touchScheme];
            }

            touchscheme.onclick = () => {
                game.options.touchScheme = (game.options.touchScheme + 1) % 3;
                update();
            }

            update();
        }

        // Keyboard
        let keybindings = document.getElementById("keybindings");
        for (let key in keyBindNames) {
            let name = keyBindNames[key];
            let div = document.createElement("div");
            let btns = {};
            
            let update = function() {
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