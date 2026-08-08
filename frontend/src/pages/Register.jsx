import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    fullName: '', role: 'ROLE_STUDENT'
  })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await register(form)
      toast.success('Account created! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Registration failed')
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        id={`reg-${key}`}
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        required
      />
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>✨</div>
          <h1 className="auth-box__title">Create Account</h1>
          <p className="auth-box__sub">Join CollegeEvents today</p>
        </div>

        <form className="auth-box__form" onSubmit={handleSubmit}>
          {field('fullName',  'Full Name',  'text',     'Rohit Sharma')}
          {field('username',  'Username',   'text',     'rohit_09')}
          {field('email',     'Email',      'email',    'rohit@example.com')}
          {field('password',  'Password',   'password', '••••••••')}
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              id="reg-role"
              className="form-input"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option value="ROLE_STUDENT">Student</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <button id="reg-submit" className="btn btn--primary" style={{ marginTop: 4 }} disabled={loading}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-box__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
