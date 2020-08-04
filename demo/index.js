let canvas = document.querySelector("canvas");

canvas.width = 1200;
canvas.height = 700;

let g = canvas.getContext("2d");


function getRandomNum(min, max) {
    return Math.random() * (max-min) + min
}

function getDefaultParticleParam() {
    return {
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
}
/*
angle
colors
continuous
destroyTime
effectVel
effectWidth
fadeOut
particleAmount
shapes
shrink
size
speed
*/



// function getDefaultParticleParam() {
//     return {
//         speed: [1, 20], 
//         size: [1, 70],
//         shapes: ["circle"],
//         effectWidth: 360,
//         destroyTime: [0, 0],
//         fadeOut: 0,
//         shrink: 6,
//         angle: 90,
//         colors: ["yellow", "darkorange", "orange", "gray", "darkgray"],
//         particleAmount: 100,
//         continuous: false,
//         effectVel: {x: 0, y: 0}
//     }
// }



function convertToRadians(num) {
    return num*(Math.PI/180)
}

function fillTriangle(x, y, size, ctx) {
    size*=2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x+size, y)
    ctx.lineTo(x+size/2, y-Math.sqrt(Math.pow(size, 2)-Math.pow(size/2, 2)))
    ctx.fill()
}

function drawLine(x, y, size, angle, ctx) {
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(x, y)
    let xDist = Math.cos(angle)*size*1.5
    let yDist = Math.sin(angle)*size*1.5
    ctx.lineTo(x+xDist, y+yDist)
    ctx.stroke()
}

class Particle {

    constructor(x, y, params, ctx) {

        this.g = ctx

        this.speed = getRandomNum(params.speed[0], params.speed[1])
        
        this.size = getRandomNum(params.size[0], params.size[1])

        this.shape = params.shapes[Math.round(Math.random()*params.shapes.length)]

        this.destroyTime = getRandomNum(params.destroyTime[0], params.destroyTime[1])
        this.fadeOut = params.fadeOut
        this.shrink = params.shrink

        this.color = params.colors[Math.round(Math.random()*params.colors.length)]

        this.opacity = 1.0
        
        let minAngle = params.angle-(params.effectWidth/2)
        let maxAngle = params.angle+(params.effectWidth/2)
        minAngle = convertToRadians(minAngle)
        maxAngle = convertToRadians(maxAngle)
        this.angle = getRandomNum(minAngle, maxAngle)
        let velX = Math.cos(this.angle)*this.speed
        let velY = Math.sin(this.angle)*this.speed
        this.origin = {
            x: x,
            y: y
        }
        this.vel = {
            x: velX,
            y: velY
        }
        this.pos = {
            x: x,
            y: y,
        }

        this.frame = 0;
    }

    update() {
        
        this.pos.x -= this.vel.x; this.pos.y -= this.vel.y

        if(this.frame > this.destroyTime) {
            this.opacity -= this.fadeOut
            if(this.opacity < 0) {
                this.opacity = 0
            }
            this.g.globalAlpha = this.opacity

            this.size -= this.shrink
            if(this.size < 0) {
                this.size = 0
            }
            
        }

        this.g.fillStyle = this.color;
        this.g.strokeStyle = this.color;

        if(this.shape == "circle") {
            this.g.beginPath();
            this.g.arc(this.pos.x,this.pos.y,this.size,0,2*Math.PI,false);
            this.g.fill();
        } else if(this.shape == "square") {
            this.g.fillRect(this.pos.x, this.pos.y, this.size*1.5, this.size*1.5)
        } else if(this.shape == "triangle") {
            fillTriangle(this.pos.x, this.pos.y, this.size, this.g)
        } else if(this.shape == "line") {
            drawLine(this.pos.x, this.pos.y, this.size, this.angle, this.g)
        }

        this.g.globalAlpha = 1.0

        this.frame++;
    }

}


class ParticleEffect {

    constructor(x, y, particleParams, ctx) {

        this.g = ctx

        this.pos = {
            x: x,
            y: y
        }

        this.particleParams = getDefaultParticleParam()
        for(let element in particleParams) {
            this.particleParams[element] = particleParams[element]
        }

        this.vel = {
            x: this.particleParams.effectVel.x,
            y: this.particleParams.effectVel.y
        }

        this.continuous = this.particleParams.continuous
        this.particleAmount = this.particleParams.particleAmount

        this.particles = []

        this.frame = 0;

        if(this.continuous == false) {
            for(let i = 0; i < this.particleAmount; i++) {
                this.particles.push(new Particle(this.pos.x, this.pos.y, this.particleParams, this.g))
            }
        }
    }

    update() {
        if(this.continuous) {
            for(let i = 0; i < this.particleAmount; i++) {
                this.particles.push(new Particle(this.pos.x, this.pos.y, this.particleParams, this.g))
            }
        }

        this.pos.x+=this.vel.x; this.pos.y+=this.vel.y
           

        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i].update()
            if(this.particles[i].size <= 0) {
                this.particles.splice(i, 1)
            }
            if(this.particles[i].opacity <= 0) {
                this.particles.splice(i, 1)
            }
            if(this.particles[i].shrink == 0 && this.particles[i].fadeOut == 0 && this.particles[i].frame > this.particles[i].destroyTime) {
                this.particles.splice(i, 1)
            }
        }

        // this.g.fillStyle = "red";
        // this.g.beginPath();
        // this.g.arc(this.pos.x,this.pos.y,2,0,2*Math.PI,false);
        // this.g.fill();

        this.frame++;
    }

}

let particleEffect = new ParticleEffect(canvas.width/2, canvas.height/2, {
    colors: ["yellow", "cyan", "magenta"],
    shapes: ["line"],
    continuous: false,
    effectWidth: 360,
    particleAmount: 500,
    speed: [5, 20],
    destroyTime: [0, 0]
}, g)

function generateNewEffect() {
    particleEffect = new ParticleEffect(canvas.width/2, canvas.height/2, {
        effectWidth: document.getElementById("effectWidthSlider").value,
        particleAmount: document.getElementById("particleAmountSlider").value,
        continuous: document.getElementById("continuousCheckbox").checked
    }, g)
}


function animate() {
    requestAnimationFrame(animate);
    g.clearRect(0,0,canvas.width,canvas.height);
    g.fillStyle = "black"
    g.fillRect(0, 0, canvas.width, canvas.height)

    particleEffect.update();
}

animate();


