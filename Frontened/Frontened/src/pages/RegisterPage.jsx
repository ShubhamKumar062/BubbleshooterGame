import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SoundManager from '../utils/SoundManager'
import './AuthPages.css'
import bgImage from '../assets/2951605.jpg'

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  
  const { register, error } = useAuth()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Clear error for this field when typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      })
    }
  }
  
  const validateForm = () => {
    const errors = {}
    
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    SoundManager.play('buttonClick')
    
    if (!validateForm()) return
    
    setIsLoading(true)
    const { username, email, password } = formData
    
    await register(username, email, password)
    setIsLoading(false)
  }
  
  return (
    <div className="auth-page"
     style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  }}
    >
      <div className="auth-container">
        <h1>Create Account</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input ${formErrors.username ? 'error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              required
            />
            {formErrors.username && (
              <div className="field-error">{formErrors.username}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${formErrors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && (
              <div className="field-error">{formErrors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${formErrors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formErrors.password && (
              <div className="field-error">{formErrors.password}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {formErrors.confirmPassword && (
              <div className="field-error">{formErrors.confirmPassword}</div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage