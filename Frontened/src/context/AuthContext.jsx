import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token')
    if (token) {
      checkUserAuth(token)
    } else {
      setLoading(false)
    }
  }, [])

  const checkUserAuth = async (token) => {
    try {
      const res = await axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.data.user) {
        setUser(res.data.user)
      }
    } catch (err) {
      console.error('Auth verification failed:', err)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setError(null)
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (username, email, password) => {
    setError(null)
    try {
      const res = await axios.post('/api/auth/register', {
        username,
        email,
        password
      })
      
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}