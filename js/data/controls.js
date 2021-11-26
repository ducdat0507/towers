function getKeyName(id) {
    return keyAltNames[id] || id.toUpperCase();
}

let keyAltNames = {
    arrowup: "▲",
    arrowdown: "▼",
    arrowleft: "◄",
    arrowright: "►",
    " ": "SPACE",
}

let keyBindNames = {
    up: "Up",
    down: "Down",
    left: "Left",
    right: "Right",
}