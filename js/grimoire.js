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