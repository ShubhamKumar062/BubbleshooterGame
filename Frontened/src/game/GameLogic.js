// DFS algorithm to find matching color bubbles
export function checkColorMatches(grid, row, col) {
  if (!grid[row][col]) return []
  
  const targetColor = grid[row][col].color
  const visited = {}
  const matches = []
  
  function dfs(r, c) {
    // Check boundaries and if already visited
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return
    if (!grid[r][c] || grid[r][c].color !== targetColor) return
    
    const key = `${r},${c}`
    if (visited[key]) return
    
    // Mark as visited and add to matches
    visited[key] = true
    matches.push({
      row: r,
      col: c,
      x: grid[r][c].x,
      y: grid[r][c].y,
      color: grid[r][c].color
    })
    
    // Check neighbors (taking into account odd/even rows)
    const isEvenRow = r % 2 === 0
    const neighbors = isEvenRow
      ? [
          [r-1, c-1], [r-1, c],   // Upper left, Upper right
          [r, c-1],   [r, c+1],   // Left, Right
          [r+1, c-1], [r+1, c]    // Lower left, Lower right
        ]
      : [
          [r-1, c],   [r-1, c+1], // Upper left, Upper right
          [r, c-1],   [r, c+1],   // Left, Right
          [r+1, c],   [r+1, c+1]  // Lower left, Lower right
        ]
    
    for (const [nr, nc] of neighbors) {
      dfs(nr, nc)
    }
  }
  
  dfs(row, col)
  
  return matches
}

// Check for floating bubbles (not connected to the top)
export function checkFloatingBubbles(grid) {
  const rows = grid.length
  const cols = grid[0].length
  
  // Step 1: Mark all bubbles as "not visited"
  const visited = {}
  
  // Step 2: Start DFS from all top row bubbles
  for (let c = 0; c < cols; c++) {
    if (grid[0][c]) {
      dfsMarkConnected(0, c, grid, visited)
    }
  }
  
  // Step 3: Find all bubbles that weren't visited (they're floating)
  const floatingBubbles = []
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] && !visited[`${r},${c}`]) {
        floatingBubbles.push(grid[r][c])
      }
    }
  }
  
  return floatingBubbles
}

// Helper DFS function to mark all connected bubbles
function dfsMarkConnected(row, col, grid, visited) {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return
  if (!grid[row][col]) return
  
  const key = `${row},${col}`
  if (visited[key]) return
  
  // Mark as visited
  visited[key] = true
  
  // Check neighbors (taking into account odd/even rows)
  const isEvenRow = row % 2 === 0
  const neighbors = isEvenRow
    ? [
        [row-1, col-1], [row-1, col],   // Upper left, Upper right
        [row, col-1],   [row, col+1],   // Left, Right
        [row+1, col-1], [row+1, col]    // Lower left, Lower right
      ]
    : [
        [row-1, col],   [row-1, col+1], // Upper left, Upper right
        [row, col-1],   [row, col+1],   // Left, Right
        [row+1, col],   [row+1, col+1]  // Lower left, Lower right
      ]
  
  for (const [nr, nc] of neighbors) {
    dfsMarkConnected(nr, nc, grid, visited)
  }
}