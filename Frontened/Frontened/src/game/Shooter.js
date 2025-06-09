class Shooter {
  constructor(x, y, height, bubbleRadius) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.bubbleRadius = bubbleRadius;
    this.angle = -Math.PI / 2; // Pointing up by default
    this.maxAngle = -Math.PI / 12; // Limit right movement
    this.minAngle = (-11 * Math.PI) / 12; // Limit left movement

    // Visual properties
    this.baseWidth = 20;
    this.color = "#333";
    this.accentColor = "#555";
  }

  aim(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const angle = Math.atan2(dy, dx);
    const verticalAngle = -Math.PI / 2; // straight up

    // Compute angle relative to vertical
    let relativeAngle = angle - verticalAngle;

    // Clamp within ±75 degrees (you can adjust this)
    const maxRelativeAngle = (75 * Math.PI) / 180; // 1.308 rad
    const minRelativeAngle = (-75 * Math.PI) / 180; // -1.308 rad

    relativeAngle = Math.max(
      minRelativeAngle,
      Math.min(maxRelativeAngle, relativeAngle)
    );

    // Final angle to use
    this.angle = verticalAngle + relativeAngle;
  }

  draw(ctx) {
    ctx.save();

    // Draw base (circle)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.height / 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw shooter body (rotated rectangle)
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle-4.7);

    // Shooter body
    ctx.fillStyle = this.accentColor;
    ctx.fillRect(
      -this.baseWidth / 2,
      -this.height / 2,
      this.baseWidth,
      this.height / 1.5
    );

    // Shooter tip (triangle pointing in the direction of aim)
    ctx.beginPath();
    // Start at the left edge of the rectangle
    ctx.moveTo(-this.baseWidth / 2, -this.height / 2);
    // Draw to the right edge of the rectangle
    ctx.lineTo(this.baseWidth / 2, -this.height / 2);
    // Draw to the tip point (centered horizontally, offset vertically by bubbleRadius)
    ctx.lineTo(0, -this.height / 2 - this.bubbleRadius);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

export default Shooter;
