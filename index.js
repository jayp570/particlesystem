let canvas = document.querySelector("canvas");

canvas.width = 1200;
canvas.height = 700;

let g = canvas.getContext("2d");

let particleEffect = new ParticleEffect(600, 600, {}, g)

function animate() {
    requestAnimationFrame(animate);
    g.clearRect(0,0,canvas.width,canvas.height);
    g.fillStyle = "black"
    g.fillRect(0, 0, canvas.width, canvas.height)

    particleEffect.update();
}

animate();