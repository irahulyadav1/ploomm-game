document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ── Resize canvas to match its actual CSS size ──
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
    player.y = canvas.height - 80;
    player.x = canvas.width / 2 - 24;
}

const landing = document.getElementById("landing");
const instructions = document.getElementById("instructions");
const avatarBox = document.getElementById("avatarBox");
const gameScreen = document.getElementById("game");
const loseScreen = document.getElementById("lose");
const winScreen = document.getElementById("win");

const scoreEl = document.getElementById("score");
const couponEl = document.getElementById("coupon");

let score = 0, balls = [], running = false, animationId, spawnTimer, countdownTimer;

const sprite = new Image();
sprite.src = "avatar.png";

let frameIndex = 0;
let frameTick = 0;

const player = { x: 160, y: 340, w: 66, h: 66, speed: 12 };

window.addEventListener("resize", () => {
    if (running) resizeCanvas();
});

const chaosWords = [
    "Follow-ups","Budget","Dropouts","Changes","Overruns",
    "Compliance","Delays","Budget Cuts","Revisions",
    "Logistics","Approvals","Escalations",
];

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.add("hidden");
        s.classList.remove("active");
    });
    screen.classList.remove("hidden");
    screen.classList.add("active");
}

document.getElementById("startBtn").onclick = () => showScreen(instructions);
document.getElementById("instructionsBtn").onclick = () => showScreen(avatarBox);
document.getElementById("enterGameBtn").onclick = () => { showScreen(gameScreen); startGame(); };
document.getElementById("continueBtn").onclick = () => showScreen(winScreen);
document.getElementById("tryAgainBtn").onclick = () => { showScreen(gameScreen); startGame(); };
document.getElementById("leftBtn").onclick = () => move(-1);
document.getElementById("rightBtn").onclick = () => move(1);

document.addEventListener("keydown", e => {
    if (!running) return;
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
});

function move(dir) {
    player.x += dir * player.speed;
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
}

function startGame() {
    resizeCanvas();
    score = 0;
    scoreEl.textContent = "000";
    balls = [];
    running = true;
    player.x = canvas.width / 2 - 24;
    spawnTimer = setInterval(spawnBall, 1500);
    countdownTimer = setTimeout(() => { endGame(true); }, 30000);
    loop();
}

function spawnBall() {
    const isOrange = Math.random() > 0.4;
    balls.push({
        x: Math.random() * 340 + 30,
        y: -20,
        radius: 26,
        type: isOrange ? "orange" : "chaos",
        text: isOrange ? "PLOOMM" : chaosWords[Math.floor(Math.random() * chaosWords.length)],
        speed: 3
    });
}

function drawBackground() {
    const W = canvas.width, H = canvas.height, cx = W / 2;
    const horizon = H * 0.42;
    ctx.fillStyle = "#f8faff";
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.strokeStyle = "rgba(37,99,235,0.18)";
    ctx.lineWidth = 1;
    const nV = 14;
    for (let i = 0; i <= nV; i++) {
        const bx = (i / nV) * W;
        ctx.beginPath();
        ctx.moveTo(cx, horizon);
        ctx.lineTo(bx, H);
        ctx.stroke();
    }
    const nH = 13;
    for (let i = 1; i <= nH; i++) {
        const t = Math.pow(i / nH, 1.8);
        const y = horizon + t * (H - horizon);
        const lx = cx * (1 - (y - horizon) / (H - horizon));
        const rx = W - lx;
        ctx.globalAlpha = 0.12 + 0.2 * t;
        ctx.beginPath();
        ctx.moveTo(lx, y);
        ctx.lineTo(rx, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    const sf = ctx.createLinearGradient(0, 0, 0, horizon);
    sf.addColorStop(0, "rgba(248,250,255,1)");
    sf.addColorStop(1, "rgba(248,250,255,0)");
    ctx.fillStyle = sf;
    ctx.fillRect(0, 0, W, horizon);
    const fg = ctx.createRadialGradient(cx, H+40, 10, cx, H+40, 220);
    fg.addColorStop(0, "rgba(249,115,22,0.08)");
    fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, H);
}

function loop() {
    if (!running) return;
    drawBackground();

    frameTick++;
    if (frameTick >= 12) { frameIndex = (frameIndex + 1) % 2; frameTick = 0; }

    if (sprite.complete && sprite.naturalWidth > 0) {
        ctx.drawImage(sprite, 0, 0, sprite.naturalWidth, sprite.naturalHeight, player.x, player.y, player.w, player.h);
    } else {
    const px = player.x, py = player.y;
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(px + 24, py + 50, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Legs
    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(px + 10, py + 32, 10, 18);
    ctx.fillRect(px + 26, py + 32, 10, 18);
    // Shoes
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(px + 8,  py + 46, 13, 5);
    ctx.fillRect(px + 25, py + 46, 13, 5);
    // Body
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(px + 8, py + 14, 30, 20);
    // Tie
    ctx.fillStyle = "#f97316";
    ctx.fillRect(px + 21, py + 14, 5, 16);
    // Head
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(px + 12, py, 22, 18);
    // Eyes
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(px + 16, py + 5, 4, 4);
    ctx.fillRect(px + 26, py + 5, 4, 4);
    // Hair
    ctx.fillStyle = "#92400e";
    ctx.fillRect(px + 12, py, 22, 5);
}

    for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];
        ball.y += ball.speed;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

        if (ball.type === "orange") {
            let g = ctx.createRadialGradient(ball.x-6, ball.y-6, 2, ball.x, ball.y, ball.radius);
            g.addColorStop(0, "#fdba74");
            g.addColorStop(0.5, "#f97316");
            g.addColorStop(1, "#c2410c");
            ctx.fillStyle = g;
            ctx.shadowColor = "rgba(249,115,22,0.7)";
            ctx.shadowBlur = 18;
        } else {
            let g = ctx.createRadialGradient(ball.x-6, ball.y-6, 2, ball.x, ball.y, ball.radius);
            g.addColorStop(0, "#475569");
            g.addColorStop(0.5, "#1e293b");
            g.addColorStop(1, "#0f172a");
            ctx.fillStyle = g;
            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 10;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ball.type === "orange" ? "rgba(253,186,116,0.4)" : "rgba(71,85,105,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let fontSize = ball.text.length > 8 ? 9 : 11;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillText(ball.text, ball.x, ball.y, ball.radius * 1.7);

        if (
            ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.h &&
            ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.w
        ) {
            if (ball.type === "orange") {
                score += 10;
                scoreEl.textContent = String(score).padStart(3, "0");
                if (score >= 100) { endGame(true); return; }
            } else {
                endGame(false); return;
            }
            balls.splice(i, 1);
            continue;
        }
        if (ball.y > canvas.height + 10) balls.splice(i, 1);
    }

    animationId = requestAnimationFrame(loop);
}

function endGame(win) {
    running = false;
    cancelAnimationFrame(animationId);
    clearInterval(spawnTimer);
    clearTimeout(countdownTimer);
    couponEl.textContent = "CORP-1703";
    showScreen(win ? winScreen : loseScreen);
}

});