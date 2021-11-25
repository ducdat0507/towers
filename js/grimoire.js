let ritualButtons = {};

function makeRitualGUI () {
    let ritualselect = document.getElementById("ritualselect");

    ritualButtons = {};

    for (let ritual in rituals) {
        let data = rituals[ritual];

        let btn = document.createElement("button");
        btn.classList.add("upgbtn");

        btn.onclick = () => {
            let gain = data.gain();
            if (gain.gt(0)) data.onRitual();
        }
        
        ritualselect.appendChild(btn); 
        ritualButtons[ritual] = btn;
    }

    updateRitualGUI();
}

function updateRitualGUI () {
    for (let ritual in ritualButtons) {
        let data = rituals[ritual];
        let btn = ritualButtons[ritual];
        
        if (!data.req || hasUpg(data.req[0], data.req[1])) {
            btn.style.display = "";
            let gain = data.gain();
            let next = data.inv(gain.add(1));
            btn.innerHTML = `
                <div>${data.title}</div>
                <div></div>
                <div>${data.gainText ? data.gainText(gain) : "+" + format(gain, 0)}${gain.gte(1000) || !next ? "" : "<br/>Next at " + format(next)}</div>
            `;
        } else {
            btn.style.display = "none";
        }
    }
}


function makeSpellGUI () {
    let elemspells = document.getElementById("elemspells");

    ritualButtons = {};

    for (let spell in spells) {
        let data = spells[spell];

        let btn = document.createElement("button");
        btn.classList.add("upgbtn");

        btn.onclick = () => {
            let cost = data.cost();
            if (game.spells[spell] == 0 && game.elemite.gte(cost)) {
                game.elemite = game.elemite.sub(cost);
                game.spells[spell] = data.duration();
                elemitebox.innerHTML = format(game.elemite, 0);
                if (game.upgrades.e3) game.rift = Math.min(game.rift + cost.sqrt().div(1e10).toNumber(), 1);
                updateSpellGUI();
            }
        }
        
        elemspells.appendChild(btn); 
        ritualButtons[spell] = btn;
    }

    updateSpellGUI();
}

function updateSpellGUI () {
    for (let spell in spells) {
        let data = spells[spell];
        let btn = ritualButtons[spell];

        if (!data.req || hasUpg(data.req[0], data.req[1])) {
            btn.style.display = "";
            btn.innerHTML = `
                <div>${data.title}</div>
                <div></div>
                <div>${data.desc.replace("{DUR}", format(data.duration(), 0))}<br/>Cooldown: ${format(data.cooldown(), 0)} levels</div>
                <div>${
                    game.spells[spell] > 0 ? ("<div>Active</div>" + format(game.spells[spell], 0) + " turns") :
                    game.spells[spell] < 0 ? ("<div>On cooldown</div>" + format(-game.spells[spell], 0) + " turns") :
                    ("<div>Inactive - Cost:</div>" + format(data.cost(), 0))
                }</div>
            `;
        } else {
            btn.style.display = "none";
        }
    }
}

function updateRiftGUI() {
    let riftbar = document.getElementById("riftbar");
    riftbar.innerHTML = "";
    let dots = [];
    let prog = Math.cbrt(game.rift) * 48;
    for (let y = 0; y < 16; y++) {
        dots[y] = [];
        for (let x = 0; x < 100; x++) {
            let dist = Math.sqrt((y - 7.5) * (y - 7.5) + (x - 49.5) * (x - 49.5));
            dots[y][x] = prog >= dist || dist > 48;
        }
    }

    if (game.rift > 0.01) {
        let digits = [
            " ####      # ####  #### #    # ####  ####  ####  ####  ####       ",
            "######    ##  ####  ######  ######  ####  ##################      ",
            "##  ##    ##    ##    ####  ####    ##    ##  ####  ####  ##      ",
            "##  ##    ##    ##    ####  ####    ##    ##  ####  ####  ##     #",
            "##  ##    ## ##### ################ ##### #   ############## ## # ",
            "##  ##    #######  ##### ##### ###########    ######## ##### ## # ",
            "##  ##    ####        ##    ##    ####  ##    ####  ##    ##   #  ",
            "##  ##    ####        ##    ##    ####  ##    ####  ##    ##  # ##",
            "######    ######    ####    ##  ##########    ########  ####  # ##",
            " ####      # ####  ####      # ####  ####      # ####  ####  #    ",
        ]
        let rp = Math.floor(game.rift * 100).toString() + "%";
        for (let a = 0; a < rp.length; a++) {
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 6; x++) {
                    dots[y + 3][x + 51 - (rp.length / 2 - a) * 8] = digits[y][x + (rp[a] == "%" ? 60 : rp[a] * 6)] == " ";
                }
            }
        }
    }
    
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 50; x++) {
            let char = 10240;
            if (dots[y * 4][x * 2]) char += 1;
            if (dots[y * 4 + 1][x * 2]) char += 2;
            /* if (dots[y * 4 + 2][x * 2]) */ char += 4;
            if (dots[y * 4][x * 2 + 1]) char += 8;
            if (dots[y * 4 + 1][x * 2 + 1]) char += 16;
            if (dots[y * 4 + 2][x * 2 + 1]) char += 32;
            if (dots[y * 4 + 3][x * 2]) char += 64;
            if (dots[y * 4 + 3][x * 2 + 1]) char += 128;
            riftbar.innerHTML += String.fromCharCode(char);
        }
        riftbar.innerHTML += "<br/>";
    }

    let rifttitle = document.getElementById("rifttitle");
    if (prog < .75) rifttitle.innerHTML = "The rift is silent.";
    else if (prog < 3) rifttitle.innerHTML = "The rift begins to rumble.";
    else if (prog < 6) rifttitle.innerHTML = "The rift begins to rumble harder.";
    else if (prog < 12) rifttitle.innerHTML = "The sky begins to darken.";
    else if (prog < 24) rifttitle.innerHTML = "The portal is getting larger and larger.";
    else if (prog < 36) rifttitle.innerHTML = "Almost there...";
    else if (prog < 48) rifttitle.innerHTML = "Just a little bit more...";
    else rifttitle.innerHTML = "The portal fully opens, waiting for you to enter.";

    let riftbutton = document.getElementById("riftbutton");

    riftbutton.style.display = prog >= 48 ? "" : "none";
    riftbutton.onclick = () => {
        console.log("e");
        setTab("");

        inRiftMode = true;

        famebox.classList.add("hidden");
        lootbox.classList.add("hidden");
        brickbox.classList.add("hidden");
        manabox.classList.add("hidden");
        karmabox.classList.add("hidden");
        elemitebox.classList.add("hidden");
        menu.classList.add("hidden");

        addAnimator(function (t) {
            canvasOffset[1] = t ** 3 / 10000000;
            canvasDirty = true;

            if (!this.popupShown && t >= 5000) {
                popup.classList.remove("hidden");
                popup.innerHTML = `
                    <div class="big">Congratulations!</div>
                    You have successfully entered the rift and thus beaten the game!
                    <div class="subtitle">(maybe more worlds coming soon??)</div>
                    <br/>
                    You have completed the game in:
                    <div class="big">${formatTime(game.playTime)}</div>
                    <br/>
                    You can refresh this page to keep playing the game, or press the button below to start the game again from scratch.
                    <br/>
                    <button onclick="showResetPopup()">RESET GAME</button>
                `
                this.popupShown = true;
            }

            return true;
        })
    }
}