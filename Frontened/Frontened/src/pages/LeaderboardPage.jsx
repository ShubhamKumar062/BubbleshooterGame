import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LeaderboardPage.css'

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (filter && isAuthenticated !== null) {
      fetchLeaderboard()
    }
  }, [filter, isAuthenticated])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const endpoint =
        filter === 'weekly' ? '/api/leaderboard/weekly' : '/api/leaderboard'
      const response = await axios.get(endpoint)
      const data = Array.isArray(response.data) ? response.data : []
      setLeaderboard(data)

      if (isAuthenticated && user && user._id) {
        const userScore = data.find(entry => entry.userId === user._id)
        if (userScore) {
          setUserRank({
            rank: data.findIndex(entry => entry.userId === user._id) + 1,
            score: userScore.score
          })
        } else {
          setUserRank(null)
        }
      } else {
        setUserRank(null)
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <h1>Leaderboard</h1>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button
            className={`btn ${filter === 'weekly' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('weekly')}
          >
            Weekly
          </button>
        </div>

        {userRank && (
          <div className="user-rank">
            <p>Your Rank: <span>#{userRank.rank}</span></p>
            <p>Best Score: <span>{userRank.score}</span></p>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {leaderboard.length === 0 ? (
              <div className="empty-leaderboard">
                <p>No scores yet! Be the first to play.</p>
                <Link to="/" className="btn btn-primary">Play Now</Link>
              </div>
            ) : (
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry._id}
                        className={user && entry.userId === user._id ? 'current-user' : ''}
                      >
                        <td className="rank-cell">
                          <div className={`rank-badge rank-${index < 3 ? index + 1 : 'other'}`}>
                            {index + 1}
                          </div>
                        </td>
                        <td>{entry.username}</td>
                        <td className="score-cell">{entry.score}</td>
                        <td>{formatDate(entry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="leaderboard-footer">
              {!isAuthenticated && (
                <div className="auth-prompt">
                  <p>Login to save your scores and compete!</p>
                  <div className="auth-buttons">
                    <Link to="/login" className="btn btn-primary">Login</Link>
                    <Link to="/register" className="btn btn-outline">Sign Up</Link>
                  </div>
                </div>
              )}

              <Link to="/" className="btn btn-secondary play-button">Play Game</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LeaderboardPage
