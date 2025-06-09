import Bubble from './Bubble'
import Shooter from './Shooter'
import { checkColorMatches, checkFloatingBubbles } from './GameLogic'
import ParticleSystem from './ParticleSystem'

// Game constants
const GRID_ROWS = 10
const GRID_COLS = 10
const BUBBLE_RADIUS = 20
const SHOOTER_HEIGHT = 60
const MOVEMENT_SPEED = 5
const COLORS = ['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B', '#9C27B0', '#FF9800']

class BubbleShooter {
  constructor({ canvas, ctx, width, height, onBubblesPopped, onLevelComplete, onLifeLost, onGameOver }) {
    // Canvas setup
    this.canvas = canvas
    this.ctx = ctx
    this.width = width
    this.height = height
    
    // Callback functions
    this.onBubblesPopped = onBubblesPopped
    this.onLevelComplete = onLevelComplete
    this.onLifeLost = onLifeLost
    this.onGameOver = onGameOver
    
    // Game state
    this.grid = []
    this.shooter = null
    this.activeBubble = null
    this.nextBubble = null
    this.isAnimating = false
    this.isPaused = false
    this.particleSystem = new ParticleSystem(this.ctx)
    
    // Calculate bubble size based on canvas width
    this.bubbleRadius = Math.min(BUBBLE_RADIUS, (width / GRID_COLS) / 2 - 1)
    
    // Input handling
    this.setupEventListeners()
    
    // Start game loop
    this.lastTime = 0
    this.animate = this.animate.bind(this)
    requestAnimationFrame(this.animate)
    
    // Initial setup
    this.setupLevel(1)
  }
  
  setupEventListeners() {
    // Mouse move for aiming
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isPaused) return
      
      const rect = this.canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      if (this.shooter) {
        this.shooter.aim(mouseX, mouseY)
      }
    })
    
    // Click to shoot
    this.canvas.addEventListener('click', () => {
      if (this.isPaused || this.isAnimating || !this.activeBubble) return
      
      this.shootBubble()
    })
    
    // Touch events for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isPaused) return
      
      e.preventDefault()
      const rect = this.canvas.getBoundingClientRect()
      const touchX = e.touches[0].clientX - rect.left
      const touchY = e.touches[0].clientY - rect.top
      
      if (this.shooter) {
        this.shooter.aim(touchX, touchY)
      }
    })
    
    this.canvas.addEventListener('touchend', (e) => {
      if (this.isPaused || this.isAnimating || !this.activeBubble) return
      
      e.preventDefault()
      this.shootBubble()
    })
  }
  
  setupLevel(level) {
    // Clear existing grid
    this.grid = []
    
    // Calculate grid properties
    const bubbleDiameter = this.bubbleRadius * 2
    const gridOffsetY = this.bubbleRadius * 2
    
    // Number of initial rows based on level (more rows for higher levels)
    const initialRows = Math.min(5 + Math.floor(level / 2), GRID_ROWS - 2)
    
    // Create grid with initial bubbles
    for (let row = 0; row < GRID_ROWS; row++) {
      this.grid[row] = []
      
      for (let col = 0; col < GRID_COLS; col++) {
        if (row < initialRows) {
          // Determine position (offset every other row)
          const offsetX = (row % 2 === 0) ? 0 : this.bubbleRadius
          const x = offsetX + col * bubbleDiameter + this.bubbleRadius
          const y = row * bubbleDiameter * 0.85 + this.bubbleRadius + gridOffsetY
          
          // Random color based on level difficulty
          const colorIndex = Math.floor(Math.random() * Math.min(3 + Math.floor(level / 2), COLORS.length))
          const color = COLORS[colorIndex]
          
          this.grid[row][col] = new Bubble(x, y, this.bubbleRadius, color, { row, col })
        } else {
          this.grid[row][col] = null
        }
      }
    }
    
    // Create shooter
    this.shooter = new Shooter(
      this.width / 2,
      this.height - SHOOTER_HEIGHT / 2,
      SHOOTER_HEIGHT,
      this.bubbleRadius
    )
    
    // Create initial bubbles
    this.createNextBubble()
    this.activeBubble = this.nextBubble
    this.createNextBubble()
    
    // Reset flags
    this.isAnimating = false
  }
  
  createNextBubble() {
    // Random color from available colors
    const colorIndex = Math.floor(Math.random() * COLORS.length)
    const color = COLORS[colorIndex]
    
    // Create new bubble at shooter position
    this.nextBubble = new Bubble(
      this.shooter.x,
      this.shooter.y,
      this.bubbleRadius,
      color
    )
  }
  
  shootBubble() {
    if (!this.activeBubble || this.isAnimating) return
    
    // Set bubble velocity based on shooter angle
    const angle = this.shooter.angle
    this.activeBubble.vx = Math.cos(angle) * MOVEMENT_SPEED
    this.activeBubble.vy = Math.sin(angle) * MOVEMENT_SPEED
    this.activeBubble.isMoving = true
    
    this.isAnimating = true
  }
  
  updateActiveBubble() {
    if (!this.activeBubble || !this.activeBubble.isMoving) return
    
    // Update position
    this.activeBubble.x += this.activeBubble.vx
    this.activeBubble.y += this.activeBubble.vy
    
    // Wall collision
    if (this.activeBubble.x - this.bubbleRadius <= 0 || 
        this.activeBubble.x + this.bubbleRadius >= this.width) {
      this.activeBubble.vx *= -1
    }
    
    // Ceiling collision
    if (this.activeBubble.y - this.bubbleRadius <= 0) {
      this.snapBubbleToGrid()
      return
    }
    
    // Check for collision with other bubbles
    this.checkBubbleCollision()
    
    // Check if bubble went past bottom
    if (this.activeBubble.y > this.height + this.bubbleRadius) {
      this.activeBubble = this.nextBubble
      this.createNextBubble()
      this.isAnimating = false
    }
  }
  
  checkBubbleCollision() {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const bubble = this.grid[row][col]
        
        if (bubble) {
          const dx = this.activeBubble.x - bubble.x
          const dy = this.activeBubble.y - bubble.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < this.bubbleRadius * 2) {
            this.snapBubbleToGrid()
            return
          }
        }
      }
    }
  }
  
  snapBubbleToGrid() {
    // Find closest empty grid position
    let closestRow = 0
    let closestCol = 0
    let closestDistance = Infinity
    
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!this.grid[row][col]) {
          // Calculate grid position
          const bubbleDiameter = this.bubbleRadius * 2
          const offsetX = (row % 2 === 0) ? 0 : this.bubbleRadius
          const x = offsetX + col * bubbleDiameter + this.bubbleRadius
          const y = row * bubbleDiameter * 0.85 + this.bubbleRadius + this.bubbleRadius * 2
          
          const dx = this.activeBubble.x - x
          const dy = this.activeBubble.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < closestDistance) {
            closestDistance = distance
            closestRow = row
            closestCol = col
          }
        }
      }
    }
    
    // Snap to closest position
    const bubbleDiameter = this.bubbleRadius * 2
    const offsetX = (closestRow % 2 === 0) ? 0 : this.bubbleRadius
    const x = offsetX + closestCol * bubbleDiameter + this.bubbleRadius
    const y = closestRow * bubbleDiameter * 0.85 + this.bubbleRadius + this.bubbleRadius * 2
    
    // Update bubble position and add to grid
    this.activeBubble.x = x
    this.activeBubble.y = y
    this.activeBubble.isMoving = false
    this.activeBubble.gridPosition = { row: closestRow, col: closestCol }
    this.grid[closestRow][closestCol] = this.activeBubble
    
    // Check for matches
    const matches = checkColorMatches(this.grid, closestRow, closestCol)
    
    if (matches.length >= 3) {
      // Remove matched bubbles
      for (const match of matches) {
        const { row, col } = match
        this.grid[row][col] = null
        
        // Add particles for pop effect
        this.particleSystem.createBubblePopEffect(match.x, match.y, match.color)
      }
      
      // Check for floating bubbles
      const floatingBubbles = checkFloatingBubbles(this.grid)
      
      for (const bubble of floatingBubbles) {
        const { row, col } = bubble.gridPosition
        this.grid[row][col] = null
        
        // Add falling animation
        bubble.vx = (Math.random() - 0.5) * 2
        bubble.vy = 2 + Math.random() * 2
        bubble.isMoving = true
        bubble.isFalling = true
        bubble.rotation = (Math.random() - 0.5) * 0.2
        
        // Add to animation list
        this.particleSystem.addFallingBubble(bubble)
      }
      
      // Notify about popped bubbles
      this.onBubblesPopped(matches.length + floatingBubbles.length)
      
      // Check for level completion
      this.checkLevelCompletion()
    } else {
      // Check if game over (bubbles reached bottom)
      this.checkGameOver()
    }
    
    // Reset for next shot
    this.activeBubble = this.nextBubble
    this.createNextBubble()
    this.isAnimating = false
  }
  
  checkLevelCompletion() {
    // Check if any bubbles remain
    let bubblesRemaining = false
    
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (this.grid[row][col]) {
          bubblesRemaining = true
          break
        }
      }
      if (bubblesRemaining) break
    }
    
    if (!bubblesRemaining) {
      // Level complete!
      this.onLevelComplete()
    }
  }
  
  checkGameOver() {
    // Check if any bubbles reached the bottom rows
    const bottomRowCheck = GRID_ROWS - 1
    
    for (let col = 0; col < GRID_COLS; col++) {
      if (this.grid[bottomRowCheck][col]) {
        this.onLifeLost()
        
        // Check if game over
        if (this.grid[GRID_ROWS - 1][col]) {
          this.onGameOver()
        }
        
        break
      }
    }
  }
  
  updateShooter() {
    if (!this.shooter || !this.activeBubble || this.activeBubble.isMoving) return
    
    // Update active bubble position to follow shooter
    this.activeBubble.x = this.shooter.x
    this.activeBubble.y = this.shooter.y - this.shooter.height / 2 - this.bubbleRadius
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height)
    
    // Draw background (could be enhanced with actual background)
    this.ctx.fillStyle = '#f8f9fa'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    // Draw grid bubbles
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (this.grid[row][col]) {
          this.grid[row][col].draw(this.ctx)
        }
      }
    }
    
    // Draw shooter
    if (this.shooter) {
      this.shooter.draw(this.ctx)
    }
    
    // Draw active bubble
    if (this.activeBubble) {
      this.activeBubble.draw(this.ctx)
    }
    
    // Draw next bubble (small preview)
    if (this.nextBubble) {
      this.ctx.globalAlpha = 0.6
      this.ctx.fillStyle = this.nextBubble.color
      this.ctx.beginPath()
      this.ctx.arc(
        this.shooter.x + this.shooter.height / 2 + this.bubbleRadius,
        this.shooter.y,
        this.bubbleRadius * 0.7,
        0,
        Math.PI * 2
      )
      this.ctx.fill()
      this.ctx.globalAlpha = 1
    }
    
    // Draw particles
    this.particleSystem.update()
    this.particleSystem.draw()
  }
  
  animate(timestamp) {
    if (this.isPaused) {
      requestAnimationFrame(this.animate)
      return
    }
    
    // Calculate delta time
    const deltaTime = timestamp - this.lastTime
    this.lastTime = timestamp
    
    // Update game state
    this.updateShooter()
    this.updateActiveBubble()
    
    // Render
    this.render()
    
    // Continue animation loop
    requestAnimationFrame(this.animate)
  }
  
  resizeCanvas(width, height) {
    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height
    
    // Update bubble size
    this.bubbleRadius = Math.min(BUBBLE_RADIUS, (width / GRID_COLS) / 2 - 1)
    
    // Reposition shooter
    if (this.shooter) {
      this.shooter.x = width / 2
      this.shooter.y = height - SHOOTER_HEIGHT / 2
    }
  }
  
  pause() {
    this.isPaused = true
  }
  
  resume() {
    this.isPaused = false
    this.lastTime = performance.now()
  }
  
  destroy() {
    // Remove event listeners
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('click', this.handleClick)
    this.canvas.removeEventListener('touchmove', this.handleTouchMove)
    this.canvas.removeEventListener('touchend', this.handleTouchEnd)
  }
}

export default BubbleShooter