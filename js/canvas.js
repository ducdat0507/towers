let canvasDirty = true;
let canvasOffset = [0, 0];
let canvasUp = 0;

function updateCanvas() {
    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    let wCenter = Math.floor(width / 2);
    let hCenter = Math.floor(height / 2);

    let theme = worldThemes[game.options.worldTheme];

    ctx.fillStyle = theme.skyFill;
    ctx.fillRect(0, 0, width, height);

    let pPos = getPlayerPos();
    if (!pPos) pPos = [0, 0];
    let ground = Math.floor(Math.max(height * (.75 - canvasUp * .3), 80 * pPos[1] + height * (.5 - canvasUp * .25) + 45) + canvasOffset[1]);
    ctx.fillStyle = theme.groundFill;
    ctx.fillRect(0, ground, width, height);
    let offset = Math.floor(wCenter - game.level.length * 90 + 90 - canvasOffset[0]);

    let x = 0;
    for (tower of game.level) {
        ctx.fillStyle = theme.towerFill;
        ctx.strokeStyle = theme.towerStroke;
        ctx.lineWidth = 3;
        let h = 10 + 80 * tower.length;
        ctx.fillRect(offset - 80 + x * 180, ground - h - 1, 160, h);
        ctx.strokeRect(offset - 80.5 + x * 180, ground - h - 1.5, 160, h);
        ctx.lineWidth = 1;

        for (cell in tower) {
            ctx.fillStyle = theme.cellFill;
            ctx.strokeStyle = theme.cellStroke;
            let y = 80 + 80 * cell;
            ctx.fillRect(offset - 71 + x * 180, ground - y, 141, 70);
            ctx.strokeRect(offset - 70.5 + x * 180, ground - y + 68.5, 140, 1);

            for (obj in tower[cell]) {
                if (obj >= 3) break;
                let data = tower[cell][obj]
                let y = 75 + 80 * cell - 20 * obj;
                ctx.font = "11px Verdana, Geneva, Tahoma, sans-serif";

                ctx.fillStyle = theme[data[0] + "Fill"];
                ctx.strokeStyle = theme[data[0] + "Stroke"];

                ctx.fillRect(offset - 66 + x * 180, ground - y, 131, 18);
                ctx.strokeRect(offset - 65.5 + x * 180, ground - y + 16.5, 130, 1);
                
                ctx.fillStyle = theme[data[0] + "Text"];
                
                ctx.fillText(format(data[1], 0), offset - 63.5 + x * 180, ground - y + 12);
            }
        }
        x++;
    }

    canvasDirty = false;
}