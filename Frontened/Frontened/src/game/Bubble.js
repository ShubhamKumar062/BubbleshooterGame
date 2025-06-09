class Bubble {
  constructor(x, y, radius, color, gridPosition = null) {
    this.x = x 
    this.y = y
    this.radius = radius
    this.color = color
    this.gridPosition = gridPosition
    
    // Movement properties
    this.vx = 0
    this.vy = 0
    this.isMoving = false
    this.isFalling = false
    this.rotation = 0
    
    // Animation properties
    this.scale = 1
    this.alpha = 1
    
    // Visual effects
    this.highlight = 0.4
    this.shadowOffset = 2
  }
  
  draw(ctx) {
    ctx.save()
    
    // Apply transformations for falling bubbles
    if (this.isFalling) {
      ctx.translate(this.x, this.y)
      ctx.rotate(this.rotation)
      ctx.translate(-this.x, -this.y)
    }
    
    // Main bubble body
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius * this.scale, 0, Math.PI * 2)
    ctx.fill()
    
    // Inner shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.beginPath()
    ctx.arc(this.x, this.y + this.shadowOffset, this.radius * 0.9 * this.scale, 0, Math.PI * 2)
    ctx.fill()
    
    // Highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${this.highlight})`
    ctx.beginPath()
    ctx.arc(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      this.radius * 0.4 * this.scale,
      0,
      Math.PI * 2
    )
    ctx.fill()
    
    ctx.restore()
  }
  
  update() {
    if (this.isMoving) {
      this.x += this.vx
      this.y += this.vy
      
      if (this.isFalling) {
        this.vy += 0.1 // Gravity
        this.rotation += 0.05
      }
    }
  }
  
  // For animations
  popAnimation() {
    this.scale = 1.2
    setTimeout(() => {
      this.scale = 0.8
      setTimeout(() => {
        this.scale = 0
      }, 100)
    }, 100)
  }

  // Add a method to align with shooter
  alignWithShooter(shooter) {
    // Match exactly how the shooter tip is drawn
    const tipDistance = shooter.height / 2 + shooter.bubbleRadius;
    
    // Position at the tip of the shooter arrow
    this.x = shooter.x + Math.cos(shooter.angle) * tipDistance;
    this.y = shooter.y + Math.sin(shooter.angle) * tipDistance;
  }
}

export default Bubble
