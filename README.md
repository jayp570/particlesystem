# particlesystem 
A simple Javascript customizable particle system useful for minimalist explosions, smoke effects, fireworks, and more.

## How to Use
- Install `particle.js`
- Link `particle.js` to an HTML file with a `<canvas>` element
- Create a `ParticleEffect` object in a separate JS file or in a `<script>` tag
- Call the `update()` function of your `ParticleEffect` object in every animation frame

## Sample Code
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <canvas></canvas> <br><br>
    <script src="particle.js"></script> 
    <script src="index.js"></script> 
</body>
</html>
```

```js
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
```
