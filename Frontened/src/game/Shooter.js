class Shooter {
  constructor(x, y, height, bubbleRadius) {
    this.x = x
    this.y = y
    this.height = height
    this.bubbleRadius = bubbleRadius
    this.angle = -Math.PI / 2 // Pointing up by default
    this.maxAngle = -Math.PI / 12 // Limit right movement
    this.minAngle = -11 * Math.PI / 12 // Limit left movement
    
    // Visual properties
    this.baseWidth = 20
    this.color = '#333'
    this.accentColor = '#555'
  }
  
  aim(mouseX, mouseY) {
    // Calculate angle based on mouse position
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    let angle = Math.atan2(dy, dx)
    
    // Constrain angle to upper half
    angle = Math.max(this.minAngle, Math.min(this.maxAngle, angle))
    
    this.angle = angle
  }
  
  draw(ctx) {
    ctx.save()
    
    // Draw base (circle)
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.height / 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw shooter body (rotated rectangle)
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    
    // Shooter body
    ctx.fillStyle = this.accentColor
    ctx.fillRect(-this.baseWidth / 2, -this.height / 2, this.baseWidth, this.height / 1.5)
    
    // Shooter tip
    ctx.beginPath()
    ctx.moveTo(-this.baseWidth / 2, -this.height / 2)
    ctx.lineTo(this.baseWidth / 2, -this.height / 2)
    ctx.lineTo(0, -this.height / 2 - this.bubbleRadius)
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
  }
}

export default Shooter