let canvas = document.querySelector("canvas");

canvas.width = 1200;
canvas.height = 720;

let g = canvas.getContext("2d");


function getRandomNum(min, max) {
    return Math.random() * (max-min) + min
}

function getDefaultParticleParam() {
    return {
        speed: [5, 10], 
        size: [10, 20],
        shapes: ["circle"],
        effectWidth: 60,
        destroyTime: [10, 25],
        fadeOut: 0,
        shrink: 1,
        angle: 90,
        colors: ["red", "orange", "gray"],
        particlesNum: 4,
        continuous: true
    }
}



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
//         particlesNum: 100,
//         continuous: false
//     }
// }



function convertToRadians(num) {
    return num*(Math.PI/180)
}

function fillTriangle(x, y, size) {
    size*=2
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x+size, y)
    g.lineTo(x+size/2, y-Math.sqrt(Math.pow(size, 2)-Math.pow(size/2, 2)))
    g.fill()
}

class Particle {

    constructor(x, y, params) {

        //switch from this stupid way of calculating trajectory to the chad angles with sin and cos

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
        let angle = getRandomNum(minAngle, maxAngle)
        let velX = Math.cos(angle)*this.speed
        let velY = Math.sin(angle)*this.speed
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
            g.globalAlpha = this.opacity

            this.size -= this.shrink
            if(this.size < 0) {
                this.size = 0
            }
            
        }

        g.fillStyle = this.color;

        if(this.shape == "circle") {
            g.beginPath();
            g.arc(this.pos.x,this.pos.y,this.size,0,2*Math.PI,false);
            g.fill();
        } else if(this.shape == "square") {
            g.fillRect(this.pos.x, this.pos.y, this.size*1.5, this.size*1.5)
        } else if(this.shape == "triangle") {
            fillTriangle(this.pos.x, this.pos.y, this.size)
        }

        g.globalAlpha = 1.0

        this.frame++;
    }

}


class ParticleEffect {

    constructor(x, y, particleParams) {

        this.pos = {
            x: x,
            y: y
        }

        this.particleParams = getDefaultParticleParam()
        for(let element in particleParams) {
            this.particleParams[element] = particleParams[element]
        }

        this.continuous = this.particleParams.continuous
        this.particlesNum = this.particleParams.particlesNum

        this.particles = []

        this.frame = 0;

        if(this.continuous == false) {
            for(let i = 0; i < this.particlesNum; i++) {
                this.particles.push(new Particle(this.pos.x, this.pos.y, this.particleParams))
            }
        }
    }

    update() {
        if(this.continuous) {
            for(let i = 0; i < this.particlesNum; i++) {
                this.particles.push(new Particle(this.pos.x, this.pos.y, this.particleParams))
            }
        }

        this.pos.x+=0
           

        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i].update()
            if(this.particles[i].size <= 0) {
                this.particles.splice(i, 1)
            }
            if(this.particles[i].opacity <= 0) {
                this.particles.splice(i, 1)
            }
            if(this.particles[i].shrink == 0 && this.particles[i].fadeOut == 0 && this.particles[i].frame > this.particles[i].destroyTime) {

            }
        }

        g.fillStyle = "red";
        g.beginPath();
        g.arc(this.pos.x,this.pos.y,2,0,2*Math.PI,false);
        g.fill();

        this.frame++;
    }

}

let particleEffect = new ParticleEffect(canvas.width/2, 650, {}, {})


function animate() {
    requestAnimationFrame(animate);
    g.clearRect(0,0,canvas.width,canvas.height);
    g.fillStyle = "black"
    g.fillRect(0, 0, canvas.width, canvas.height)

    particleEffect.update();
}

animate();


