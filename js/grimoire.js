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
        
        let gain = data.gain();
        btn.innerHTML = `
            <div>${data.title}</div>
            <div></div>
            <div>+${format(gain, 0)}<br/>Next at ${format(data.inv(gain.add(1)))}</div>
        `;
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
                game.spells[spell] = data.duration;
                elemitebox.innerHTML = format(game.elemite, 0);
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
        
        btn.innerHTML = `
            <div>${data.title}</div>
            <div></div>
            <div>${data.desc.replace("{DUR}", format(data.duration, 0))}<br/>Cooldown: ${format(data.cooldown, 0)} levels</div>
            <div>${
                game.spells[spell] > 0 ? ("<div>Active</div>" + format(game.spells[spell], 0) + " turns") :
                game.spells[spell] < 0 ? ("<div>On cooldown</div>" + format(-game.spells[spell], 0) + " turns") :
                ("<div>Inactive - Cost:</div>" + format(data.cost(), 0))
            }</div>
        `;
    }
}