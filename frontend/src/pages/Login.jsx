import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const data = await login(form.username, form.password)
      toast.success(`Welcome back, ${data.fullName}!`)
      navigate(data.role === 'ROLE_ADMIN' ? '/admin' : '/student')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Invalid username or password')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎓</div>
          <h1 className="auth-box__title">Welcome Back</h1>
          <p className="auth-box__sub">Sign in to CollegeEvents</p>
        </div>

        <form className="auth-box__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              id="login-username"
              className="form-input"
              placeholder="your_username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button id="login-submit" className="btn btn--primary" style={{ marginTop: 4 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-box__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  )
}
