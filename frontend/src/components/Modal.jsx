export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="modal__title" style={{ margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1 }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
