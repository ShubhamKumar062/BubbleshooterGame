import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">Bubble<span>Shooter</span></span>
            <p className="footer-tagline">A fun bubble popping adventure!</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-section">
              <h3>Game</h3>
              <ul>
                <li><Link to="/">Play Now</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-section">
              <h3>Account</h3>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {year} BubbleShooter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer