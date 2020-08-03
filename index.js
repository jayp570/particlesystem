let canvas = document.querySelector("canvas");

canvas.width = 1200;
canvas.height = 720;

let g = canvas.getContext("2d");

function getRandomNum(min, max) {
    return Math.random() * (max-min) + min
}

function getDefaultParticleParam() {
    return {
        speed: 5, 
        size: 50,
        effectRadius: 180,
        destroyTime: 50,
        fadeOut: 0.01,
        shrink: 50,
        angle: 90,
        colors: ["red", "orange", "yellow", "green", "blue", "purple"]
    }
}

function getDefaultParticleEffectParam() {
    return {
        particlesNum: 100,
    }
}

function convertToRadians(num) {
    return num*(Math.PI/180)
}

class Particle {

    constructor(x, y, params) {

        //switch from this stupid way of calculating trajectory to the chad angles with sin and cos

        this.speed = params.speed
        
        this.size = params.size

        this.destroyTime = params.destroyTime
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

        this.particles = []
    }

    update() {
        let chance = Math.ceil(Math.random()*(100/this.particleEffectParams.particlesNum))
        if(chance == 1) {
            this.particles.push(new Particle(this.pos.x, this.pos.y, this.particleParams))
        }

        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i].update()
            if(this.particles[i].opacity <= 0 || this.particles[0].size <= 0 || 
            (this.particles[i].fadeOut == 0 && this.particles[i].shrink == 0 && this.particles[i].frame > this.particles[i].destroyTime)) {
                this.particles.splice(i, 1)
            }
        }

        g.fillStyle = "red";
        g.beginPath();
        g.arc(this.pos.x,this.pos.y,2,0,2*Math.PI,false);
        g.fill();
    }

}

let particleEffect = new ParticleEffect(canvas.width/2, 700, {}, {shrink: 0.05})

function animate() {
    requestAnimationFrame(animate);
    g.clearRect(0,0,canvas.width,canvas.height);
    g.fillStyle = "black"
    g.fillRect(0, 0, canvas.width, canvas.height)

    particleEffect.update();
}

animate();


