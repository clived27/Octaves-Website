import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import './AdminDashboard.css';

/* ── Hardcoded admin credentials ── */
const ADMIN_ID       = 'octaves_admin';
const ADMIN_PASSWORD = 'octaves@2026';

/* ─────────────────────────────────────────────
   CSV download helper
───────────────────────────────────────────── */
function downloadCSV(rows) {
  const headers = [
    'Name', 'Enrollment', 'Year of Study', 'Branch', 'Contact', 'Email', 'Skills',
    'Vocal Genre', 'Vocal Languages', 'Vocal Original Compositions',
    'Vocal Training', 'Vocal Stage Experience', 'Vocal Achievements',
    'Instruments', 'Instr. Original Compositions', 'Instr. Training',
    'Instr. Stage Experience', 'Instr. Achievements',
    'Prod. Tools', 'Prod. Experience', 'Prod. Achievements',
    'Submitted At',
  ];

  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const dataRows = rows.map((r) => [
    r.fullName,
    r.enrollment,
    r.year || '',
    r.branch || (r.year === 'MTech' ? 'MTech' : (r.department || '')),
    r.contact,
    r.email,
    Array.isArray(r.skills) ? r.skills.join('; ') : '',
    r.vocalGenre,
    r.vocalLanguages,
    r.vocalOriginal,
    r.vocalTraining,
    r.vocalStage,
    r.vocalAchievements,
    r.instruments,
    r.instrOriginal,
    r.instrTraining,
    r.instrStage,
    r.instrAchievements,
    r.prodTools,
    r.prodExperience,
    r.prodAchievements,
    r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString('en-IN') : '',
  ].map(escape).join(','));

  const csv  = [headers.map(escape).join(','), ...dataRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'octaves_auditions_2026.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────
   Login Gate
───────────────────────────────────────────── */
function LoginGate({ onLogin }) {
  const [id, setId]       = useState('');
  const [pw, setPw]       = useState('');
  const [err, setErr]     = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id === ADMIN_ID && pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setErr('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <p className="adm-login-eyebrow">Octaves VNIT · Admin</p>
        <h1 className="adm-login-title">
          Portal <em>Access</em>
        </h1>
        <form className="adm-login-form" onSubmit={handleSubmit}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="adminId">Admin ID</label>
            <input
              className="adm-input"
              id="adminId"
              type="text"
              value={id}
              onChange={(e) => { setId(e.target.value); setErr(''); }}
              autoComplete="username"
              required
            />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="adminPw">Password</label>
            <input
              className="adm-input"
              id="adminPw"
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(''); }}
              autoComplete="current-password"
              required
            />
          </div>
          {err && <p className="adm-login-error">⚠ {err}</p>}
          <button className="adm-login-btn" type="submit">Sign In →</button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AdminDashboard
───────────────────────────────────────────── */
export default function AdminDashboard() {
  const [isLoggedIn,      setIsLoggedIn]      = useState(false);
  const [registrations,   setRegistrations]   = useState([]);
  const [loading,         setLoading]         = useState(true);

  /* Real-time listener — only activates after login */
  useEffect(() => {
    if (!isLoggedIn) return;

    const q = query(
      collection(db, 'octaves_auditions_2026'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setRegistrations(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('Firestore listener error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [isLoggedIn]);

  /* ── Login gate ── */
  if (!isLoggedIn) {
    return <LoginGate onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="adm-page">

      {/* Top bar */}
      <div className="adm-topbar">
        <div className="adm-topbar-left">
          <p className="adm-eyebrow">Octaves VNIT · Admin Dashboard</p>
          <h1 className="adm-heading">
            Audition <em>Registrations</em>
          </h1>
        </div>
        <div className="adm-topbar-right">
          {!loading && (
            <span className="adm-count">
              {registrations.length} {registrations.length === 1 ? 'entry' : 'entries'}
            </span>
          )}
          <button
            className="adm-btn adm-btn-gold"
            onClick={() => downloadCSV(registrations)}
            disabled={loading || registrations.length === 0}
          >
            ↓ Download CSV
          </button>
          <button
            className="adm-btn adm-btn-outline"
            onClick={() => setIsLoggedIn(false)}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="adm-loading">Fetching registrations…</div>
      ) : registrations.length === 0 ? (
        <div className="adm-empty">No registrations yet.</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Enrollment</th>
                <th>Year</th>
                <th>Branch</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Skills</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, idx) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--clr-text-faint)', fontSize: '0.75rem' }}>
                    {registrations.length - idx}
                  </td>
                  <td className="adm-td-name">{r.fullName || '—'}</td>
                  <td className="adm-td-enroll">{r.enrollment || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{r.year || '—'}</td>
                  <td>{r.branch || (r.year === 'MTech' ? 'MTech' : (r.department || '—'))}</td>
                  <td>{r.contact || '—'}</td>
                  <td style={{ fontSize: '0.78rem' }}>{r.email || '—'}</td>
                  <td>
                    {Array.isArray(r.skills) && r.skills.length > 0 ? (
                      <div className="adm-skills">
                        {r.skills.map((s) => (
                          <span key={s} className="adm-skill-tag">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--clr-text-faint)' }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', color: 'var(--clr-text-faint)' }}>
                    {r.createdAt?.toDate
                      ? r.createdAt.toDate().toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
