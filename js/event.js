document.addEventListener("keyup", function (e) {
    if (e.code === "KeyW" || e.code === "ArrowUp") upDown = false;
    if (e.code === "KeyA" || e.code === "ArrowLeft") leftDown = false;
    if (e.code === "KeyS" || e.code === "ArrowDown") downDown = false;
    if (e.code === "KeyD" || e.code === "ArrowRight") rightDown = false;
    if (e.code === "Space" || e.code === "ControlRight") activeDown = false;
});

document.addEventListener("keydown", function (e) {
    if (e.code === "KeyW" || e.code === "ArrowUp") upDown = true;
    if (e.code === "KeyA" || e.code === "ArrowLeft") leftDown = true;
    if (e.code === "KeyS" || e.code === "ArrowDown") downDown = true;
    if (e.code === "KeyD" || e.code === "ArrowRight") rightDown = true;
    if (e.code === "Space" || e.code === "ControlRight") activeDown = true;
});

document.addEventListener("keydown", e => {
    e.preventDefault();
    if ((e.key === "w" || e.key === "s" || e.key === "a" || e.key === "d" ||
        e.code === "ArrowUp" || e.code === "ArrowLeft" || e.code === "ArrowDown" || e.code ===
        "ArrowRight")
        && !isRunning && isReady) {
        start();
    }
    if (e.key === "Escape") {
        e.preventDefault();
        escDown = true;
        stop();
    }
    if (e.code === "Tab") {
        e.preventDefault();
        paused = !paused;
    }
});