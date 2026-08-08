import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'
import toast from 'react-hot-toast'

export default function EventsPage() {
  const { user, isStudent } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events')
      setEvents(data)
    } catch { toast.error('Failed to load events') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEvents() }, [])

  const handleRegister = async (eventId) => {
    try {
      const { data } = await api.post(`/registrations/events/${eventId}`)
      toast.success(data.message)
      fetchEvents()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Registration failed')
    }
  }

  const handleCancel = async (eventId) => {
    try {
      const { data } = await api.delete(`/registrations/events/${eventId}`)
      toast.success(data.message)
      fetchEvents()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Cancellation failed')
    }
  }

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.venue.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'ALL' || e.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-header__row">
            <div>
              <h1>🗓 All Events</h1>
              <p>Discover and register for upcoming college events</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                className="form-input"
                style={{ width: 220 }}
                placeholder="🔍 Search events…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="tabs">
                {['ALL', 'UPCOMING', 'CLOSED'].map(f => (
                  <button key={f} className={`tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎪</div>
            <div className="empty-state__text">No events found</div>
          </div>
        ) : (
          <div className="events-grid">
            {filtered.map(event => (
              <EventCard key={event.id} event={event} actions={
                isStudent && event.status === 'UPCOMING' && (
                  event.registeredByCurrentUser
                    ? <button className="btn btn--danger btn--sm" onClick={() => handleCancel(event.id)}>Cancel</button>
                    : <button className="btn btn--primary btn--sm" onClick={() => handleRegister(event.id)}>Register</button>
                )
              } />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
