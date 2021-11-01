let currentTab = "";
let tabButtons = {};

function initTabs () {
    for (let tab in tabs) {
        let btn = document.createElement("button");
        btn.innerHTML = tabs[tab].title;
        btn.tabIndex = -1;
        btn.id = tab + "-button";
        btn.classList.add("tabbtn");
        btn.onclick = () => setTab(tab);
        btn.onfocus = () => window.focus();
        tablist.appendChild(btn);
        tabButtons[tab] = btn;
    }
}



function setTab (tab) {
    if (tab == currentTab) tab = "";

    if (currentTab) {
        let elem = tabButtons[currentTab];
        elem.classList.remove("active");
        menu.classList.remove("expanded");
    }
    if (tab) {
        let elem = tabButtons[tab];
        elem.classList.add("active");
        menu.classList.add("expanded");
        tabbox.innerHTML = tabs[tab].content;
        if (tabs[tab].onshow) tabs[tab].onshow();
    }

    if (!currentTab && tab) {
        console.log("Scroll up");
        addAnimator(function (t) {
            t = Math.min(600, t);
            canvasUp = -(t / 600) * (t / 600 - 2);
            canvasDirty = true;
            return t < 600;
        })
    } else if (!tab && currentTab) {
        console.log("Scroll down");
        addAnimator(function (t) {
            t = Math.min(400, t);
            canvasUp = 1 + (t / 400) * (t / 400 - 2);
            canvasDirty = true;
            return t < 400;
        })
    }

    currentTab = tab;
}