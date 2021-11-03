let currentTab = "";
let tabButtons = {};
let subtabButtons = {};
let tabSubtabs = {};

function initTabs () {
    for (let tab in tabs) {
        let btn = document.createElement("button");
        btn.innerHTML = tabs[tab].title;
        btn.tabIndex = -1;
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
        tabcontent.innerHTML = tabs[tab].content;
        if (tabs[tab].subtabs) {
            subtablist.style.display = "";
            subtablist.innerHTML = "";
            subtabButtons = {};
            for (let subtab in tabs[tab].subtabs) {
                let data = tabs[tab].subtabs[subtab];
                let sbtn = document.createElement("button");
                sbtn.classList.add("tabbtn");
                sbtn.innerHTML = data.title;
                sbtn.onclick = () => setSubtab(subtab);
                subtabButtons[subtab] = sbtn;
                subtablist.appendChild(sbtn);
            }
            setSubtab(tabSubtabs[tab], tab);
        } else {
            subtablist.style.display = "none";
            if (tabs[tab].onshow) tabs[tab].onshow(tabSubtabs[tab]);
        }
    }

    if (!currentTab && tab) {
        addAnimator(function (t) {
            t = Math.min(600, t);
            canvasUp = -(t / 600) * (t / 600 - 2);
            canvasDirty = true;
            return t < 600;
        })
    } else if (!tab && currentTab) {
        addAnimator(function (t) {
            t = Math.min(400, t);
            canvasUp = 1 + (t / 400) * (t / 400 - 2);
            canvasDirty = true;
            return t < 400;
        })
    }
    currentTab = tab;
}

function setSubtab(subtab, tab) {
    if (!tab) tab = currentTab;
    if (!subtab) subtab = Object.keys(tabs[tab].subtabs)[0];

    if (subtabButtons[tabSubtabs[tab]]) {
        let elem = subtabButtons[tabSubtabs[tab]];
        elem.classList.remove("active");
    }
    if (subtabButtons[subtab]) {
        let elem = subtabButtons[subtab];
        elem.classList.add("active");
        tabcontent.innerHTML = tabs[tab].subtabs[subtab].content || tabs[tab].content;
    }
    if (tabs[tab].onshow) tabs[tab].onshow(subtab);

    tabSubtabs[tab] = subtab;
}