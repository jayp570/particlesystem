# particlesystem 
A simple Javascript customizable particle system useful for minimalist explosions, smoke effects, fireworks, and more.

## How to Use
- Install `particle.js`
- Link `particle.js` to an HTML file with a `<canvas>` element
- Create a `ParticleEffect` object in a separate JS file or in a `<script>` tag
- Call the `update()` function of your `ParticleEffect` object in every animation frame

## Sample Code
#### index.html
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
#### index.js
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
### Output
![alt text](https://cdn.discordapp.com/attachments/658158979096248321/740213558364602468/unknown.png)


## Instantiating a Particle Effect
### Parameters
|Parameter|Description|
|---------|-----------|
|`x`      |x position of the particle effect|
|`y`      |y position of the particle effect|
|`particleParams`|customization of the particle effect (can be left as `{}` for default particles)|
|`ctx`|canvas context object|

### Code 
`let particleEffect = new ParticleEffect(x, y, particleParams, ctx)`

## Particle Effect Customization
Effect specifications are passed to the `ParticleEffect` instantiation through a JSON object
|Parameter|Type|Description|Example|
|---------|----|-----------|-------|
|`angle`|`number`, degree measurement|the overall angle at which the entire particle effect is pointing|`angle: 90`|
|`colors`|`list`, contains `strings` - can be hex codes, rgb values, or color names|colors of particles, will be chosen randomly if there is more than one value in the list|`colors: ["yellow"]`\, `colors: ["springgreen", "rgb(78, 0, 5)", "#bafff7", "darkorange"]`|
|`continuous`|`boolean`|determines whether particles will only be generated for one frame or will continue generating as long as `update()` is called|`continuous: false //produces an "explosion"`|
|`destroyTime`|`list`, contains 2 numbers - minimum and maximum destroy time for randomization|the number of frames each particle will exist for after spawning| `destroyTime: [10, 25]`, `destroyTime: [5, 5]`|
|`effectVel`|`JSON`, contains an `x` and `y` value|moves the entire particle node the amount specified every frame, particles generated before movement are not affected|`effectVel: {x: 5, y: 10}`, `effectVel: {x: 0, y: 10} //particle node does not move`|
|`effectWidth`|`number`, degree measurement|every particle will spawn at a random angle within this value|`effectWidth: 360 //spawns particles in every direction`, `effectVel: 60 //spawns particles within a range of 60 degrees`|
|`fadeOut`|`number`, alpha value|particles will fade at this rate every frame until disappearing after they have reached `destroyTime`, will be destroyed instantly after reaching `destroyTime` if set to 0|`fadeOut: 0.02`|
|`particleAmount`|`number`|amount of particles generated every frame|`particleAmount: 3`|
|`shapes`|`list`, contains `strings` - `"circle"`, `"square"`, `"triangle"`, `"line"`| changes the shape of particles, particle will be a random shape from the list if there are multiple shapes|`shapes: ["circle"]`, `shapes: ["square", "line"]`|
|`shrink`|`number`|particles will shrink by this amount every frame until disappearing after they have reached `destroyTime`, will be destroyed instantly after reaching `destroyTime` if set to 0|`shrink: 1`|
|`size`|`list`, contains 2 numbers - minimum and maximum size for randomization|controls the size of each particle|`size: [5, 10]`, `size: [20, 20] //each particle will be the same size`|
|`speed`|`list`, contains 2 numbers - minimum and maximum speed for randomization|controls the number of pixels each particle travels every frame|`speed: [5, 20]`, `speed: [8, 8] //each particle will travel at the same speed`|

### Using Customization
#### Sample Code
```js
let particleEffect = new ParticleEffect(canvas.width/2, canvas.height/2, {
    colors: ["yellow", "cyan", "magenta"],
    shapes: ["line"],
    continuous: false,
    effectWidth: 360,
    particleAmount: 500,
    speed: [5, 20],
    destroyTime: [0, 0]
}, g)
```

#### Output
![alt text](https://cdn.discordapp.com/attachments/658158979096248321/740245608270397460/unknown.png)
---
#### Sample Code
```js
let particleEffect = new ParticleEffect(10, 600, {
    effectVel: {x: 11, y: 0},
    effectWidth: 60,
    colors: ["yellowgreen"],
    fadeOut: 0.012,
    shrink: 0,
    size: [20, 60],
    speed: [5, 8],
    particleAmount: 5,
    destroyTime: [0, 5]
}, g)
```

#### Output
![alt text](https://cdn.discordapp.com/attachments/658158979096248321/740248333343391934/unknown.png)
---
#### Sample Code
```js
let particleEffect = new ParticleEffect(canvas.width/2, canvas.height/2, {
    continuous: false,
    effectWidth: 360,
    particleAmount: 400,
    colors: ["red", "orange", "yellow", "gray", "darkgray"],
    speed: [5, 20],
    size: [10, 60],
    destroyTime: [0, 0],
    shrink: 4,
    shapes: ["square"]
}, g)
```

#### Output
![alt text](https://cdn.discordapp.com/attachments/658158979096248321/740250085308497980/unknown.png)

### Default Particles
```js
{
    speed: [5, 10], 
    size: [5, 20],
    shapes: ["circle"],
    effectWidth: 60,
    destroyTime: [25, 25],
    fadeOut: 0,
    shrink: 1,
    angle: 90,
    colors: ["white"],
    particleAmount: 5,
    continuous: true,
    effectVel: {x: 0, y: 0}
}
```
