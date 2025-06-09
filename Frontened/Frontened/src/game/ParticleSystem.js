class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.size = 2 + Math.random() * 4
    this.color = color
    this.speedX = (Math.random() - 0.5) * 5
    this.speedY = (Math.random() - 0.5) * 5
    this.lifetime = 30 + Math.random() * 20
    this.life = this.lifetime
    this.opacity = 1
  }
  
  update() {
    this.x += this.speedX 
    this.y += this.speedY
    this.speedY += 0.1 // Gravity
    this.life--
    this.opacity = this.life / this.lifetime
    this.size *= 0.97
    
    return this.life > 0
  }
  
  draw(ctx) {
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x , this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

class ParticleSystem {
  constructor(ctx) {
    this.ctx = ctx
    this.particles = []
    this.fallingBubbles = []
  }
  
  createBubblePopEffect(x, y, color) {
    // Add particles for pop effect
    const particleCount = 10 + Math.floor(Math.random() * 5)
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(x, y, color))
    }
  }
  
  addFallingBubble(bubble) {
    this.fallingBubbles.push(bubble)
  }
  
  update() {
    // Update particles
    this.particles = this.particles.filter(particle => particle.update())
    
    // Update falling bubbles
    this.fallingBubbles.forEach(bubble => {
      bubble.update()
      
      // Remove bubbles that have fallen off the bottom
      if (bubble.y > this.ctx.canvas.height + bubble.radius) {
        const index = this.fallingBubbles.indexOf(bubble)
        if (index > -1) {
          this.fallingBubbles.splice(index, 1)
        }
      }
    })
  }
  
  draw() {
    // Draw particles
    this.particles.forEach(particle => particle.draw(this.ctx))
    
    // Draw falling bubbles
    this.fallingBubbles.forEach(bubble => bubble.draw(this.ctx))
  }
}

export default ParticleSystem