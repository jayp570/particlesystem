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
        size: [5, 10],
        effectRadius: 60,
        destroyTime: [10, 25],
        fadeOut: 0,
        shrink: 1,
        angle: 90,
        colors: ["yellow", "red", "orange", "gray", "darkgray"]
    }
}

function getDefaultParticleEffectParam() {
    return {
        particlesNum: 1,
        continuous: true
    }
}

/*
function getDefaultParticleParam() {
    return {
        speed: [5, 20], 
        size: [5, 50],
        effectRadius: 360,
        destroyTime: [0, 0],
        fadeOut: 0,
        shrink: 4,
        angle: 90,
        colors: ["yellow", "red", "orange", "gray", "darkgray"]
    }
}

function getDefaultParticleEffectParam() {
    return {
        particlesNum: 1000,
        continuous: false
    }
}
*/

function convertToRadians(num) {
    return num*(Math.PI/180)
}

class Particle {

    constructor(x, y, params) {

        //switch from this stupid way of calculating trajectory to the chad angles with sin and cos

        this.speed = getRandomNum(params.speed[0], params.speed[1])
        
        this.size = getRandomNum(params.size[0], params.size[1])

        this.destroyTime = getRandomNum(params.destroyTime[0], params.destroyTime[1])
        this.fadeOut = params.fadeOut
        this.shrink = params.shrink

        this.color = params.colors[Math.round(Math.random()*params.colors.length)]

        this.opacity = 1.0
        
        let minAngle = params.angle-(params.effectRadius/2)
        let maxAngle = params.angle+(params.effectRadius/2)
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
        g.beginPath();
        g.arc(this.pos.x,this.pos.y,this.size,0,2*Math.PI,false);
        g.fill(); 

        g.globalAlpha = 1.0

        this.frame++;
    }

}


class ParticleEffect {

    constructor(x, y, particleEffectParams, particleParams) {

        this.pos = {
            x: x,
            y: y
        }

        this.particleEffectParams = getDefaultParticleEffectParam()
        this.particleParams = getDefaultParticleParam()
        for(let element in particleEffectParams) {
            this.particleEffectParams[element] = particleEffectParams[element]
        }
        for(let element in particleParams) {
            this.particleParams[element] = particleParams[element]
        }

        this.continuous = this.particleEffectParams.continuous
        this.particlesNum = this.particleEffectParams.particlesNum

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

let particleEffect = new ParticleEffect(canvas.width/2, canvas.height/2, {}, {})


function animate() {
    requestAnimationFrame(animate);
    g.clearRect(0,0,canvas.width,canvas.height);
    g.fillStyle = "black"
    g.fillRect(0, 0, canvas.width, canvas.height)

    particleEffect.update();
}

animate();


