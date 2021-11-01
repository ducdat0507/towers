let animators = [];

function addAnimator(func) {
    animators.push({
        func: func,
        time: Date.now(),
    })
}

function updateAnimator() {
    let now = Date.now();
    for (a in animators) {
        let anim = animators[a];
        if (!anim.func.call(anim, now - anim.time)) animators.splice(a, 1);
    }
}