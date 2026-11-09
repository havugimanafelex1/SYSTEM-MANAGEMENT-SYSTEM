import { useEffect, useMemo, useState } from 'react'
import {
  Users, UserPlus, LayoutDashboard, Search, Trash2, Eye, GraduationCap,
  Menu, X, Keyboard, ShieldCheck, BookOpen, Bell, LogOut, ChevronRight,
  CircleHelp, CheckCircle2, AlertCircle
} from 'lucide-react'

const initialStudents = [
  { id: 'STU001', name: 'Aline Uwase', email: 'aline.uwase@example.com', phone: '0788123456', gender: 'Female', course: 'Software Development', level: 'L5', address: 'Kigali', joined: '2026-01-15' },
  { id: 'STU002', name: 'Eric Niyonsenga', email: 'eric.n@example.com', phone: '0788234567', gender: 'Male', course: 'Networking', level: 'L4', address: 'Rwamagana', joined: '2026-02-03' },
  { id: 'STU003', name: 'Diane Mukamana', email: 'diane.m@example.com', phone: '0788345678', gender: 'Female', course: 'Software Development', level: 'L5', address: 'Kayonza', joined: '2026-02-20' },
]

const emptyForm = { name: '', email: '', phone: '', gender: '', course: '', level: '', address: '' }

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('sms-students')
      return saved ? JSON.parse(saved) : initialStudents
    } catch { return initialStudents }
  })
  const [activePage, setActivePage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    localStorage.setItem('sms-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.getElementById('student-search')?.focus()
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        setActivePage('Register Student')
        setSelected(null)
      }
      if (event.key === 'Escape') {
        setSelected(null)
        setConfirmDelete(null)
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 3200)
    return () => clearTimeout(timer)
  }, [notice])

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter(s =>
      [s.id, s.name, s.email, s.course, s.level].some(value => value.toLowerCase().includes(q))
    )
  }, [students, search])

  const notify = (type, message) => setNotice({ type, message })

  const navigate = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
    setSelected(null)
    if (page !== 'Register Student') setForm(emptyForm)
    setErrors({})
  }

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Student name is required.'
    else if (form.name.trim().length < 3) next.name = 'Name must contain at least 3 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ''))) next.phone = 'Enter a valid phone number (10–13 digits).'
    if (!form.gender) next.gender = 'Please select gender.'
    if (!form.course) next.course = 'Please select a course.'
    if (!form.level) next.level = 'Please select student level.'
    if (!form.address.trim()) next.address = 'Address is required.'
    const duplicate = students.some(s => s.email.toLowerCase() === form.email.toLowerCase())
    if (duplicate) next.email = 'A student with this email is already registered.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const registerStudent = (event) => {
    event.preventDefault() // Prevents the browser from reloading the page.
    if (!validate()) {
      notify('error', 'Please correct the highlighted registration errors.')
      return
    }
    const newStudent = {
      ...form,
      id: `STU${String(Date.now()).slice(-6)}`,
      name: form.name.trim(),
      address: form.address.trim(),
      joined: new Date().toISOString().slice(0, 10),
    }
    setStudents(prev => [newStudent, ...prev])
    setForm(emptyForm)
    setErrors({})
    setActivePage('Students')
    notify('success', 'Student registered successfully.')
  }

  const deleteStudent = () => {
    if (!confirmDelete) return
    setStudents(prev => prev.filter(s => s.id !== confirmDelete.id))
    if (selected?.id === confirmDelete.id) setSelected(null)
    notify('success', `${confirmDelete.name} was deleted.`)
    setConfirmDelete(null)
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Students', icon: Users },
    { label: 'Register Student', icon: UserPlus },
    { label: 'Event Handling Guide', icon: BookOpen },
  ]

  const pageTitle = selected ? 'Student Details' : activePage

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={24} /></div>
          <div><strong>EduManage</strong><span>ADMIN PORTAL</span></div>
          <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={19} /></button>
        </div>
        <div className="admin-card">
          <div className="avatar">AD</div>
          <div><strong>Administrator</strong><span>System Manager</span></div>
          <span className="online-dot" />
        </div>
        <p className="nav-caption">MAIN MENU</p>
        <nav className="side-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${activePage === label && !selected ? 'active' : ''}`} onClick={() => navigate(label)}>
              <Icon size={18} /><span>{label}</span>{activePage === label && !selected && <ChevronRight className="nav-chevron" size={16} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><CircleHelp size={19} /><div><strong>Need help?</strong><span>Review the event guide</span></div></div>
          <button className="nav-link logout" onClick={() => notify('success', 'You are using the local demo administrator account.')}><LogOut size={18} /><span>Sign out</span></button>
          <p className="sidebar-version">Student Management System · v1.0</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
            <div><p className="breadcrumb">Workspace <span>/</span> {pageTitle}</p><h1>{pageTitle}</h1></div>
          </div>
          <div className="topbar-actions">
            <div className="top-search"><Search size={17} /><input id="student-search" value={search} onChange={e => setSearch(e.target.value)} onKeyUp={e => { if (e.key === 'Escape') setSearch('') }} placeholder="Search students..." /><kbd>Ctrl K</kbd></div>
            <button className="icon-button notification-button" onClick={() => notify('success', 'You are all caught up.')} aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="top-avatar">AD</div>
          </div>
        </header>

        <div className="content">
          {notice && <div className={`toast ${notice.type}`}><span>{notice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}</span>{notice.message}<button onClick={() => setNotice(null)} aria-label="Dismiss notification"><X size={16} /></button></div>}

          {selected ? (
            <StudentDetails student={selected} onBack={() => setSelected(null)} onDelete={() => setConfirmDelete(selected)} />
          ) : activePage === 'Dashboard' ? (
            <Dashboard students={students} onNavigate={navigate} onView={setSelected} />
          ) : activePage === 'Students' ? (
            <StudentsPage students={filteredStudents} search={search} setSearch={setSearch} onView={setSelected} onDelete={setConfirmDelete} />
          ) : activePage === 'Register Student' ? (
            <RegisterPage form={form} errors={errors} onChange={updateForm} onSubmit={registerStudent} onCancel={() => navigate('Students')} />
          ) : (
            <GuidePage />
          )}
        </div>
        <footer className="footer"><span>© 2026 EduManage Student Management System</span><span><ShieldCheck size={14} /> Secure local demo · ReactJS Event Handling</span></footer>
      </main>

      {confirmDelete && <div className="modal-backdrop" onMouseDown={() => setConfirmDelete(null)}>
        <div className="confirm-modal" onMouseDown={event => event.stopPropagation()}>
          <div className="modal-icon"><Trash2 size={22} /></div>
          <h2>Delete student?</h2>
          <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
          <div className="modal-actions"><button className="btn btn-light" onClick={() => setConfirmDelete(null)}>Cancel</button><button className="btn btn-danger" onClick={deleteStudent}>Yes, delete</button></div>
        </div>
      </div>}
    </div>
  )
}

function Dashboard({ students, onNavigate, onView }) {
  const female = students.filter(s => s.gender === 'Female').length
  const male = students.filter(s => s.gender === 'Male').length
  return <div className="page-stack">
    <section className="welcome-row"><div><p className="eyebrow">OVERVIEW</p><h2>Welcome back, Administrator <span>👋</span></h2><p>Here is what is happening with your student records today.</p></div><button className="btn btn-primary" onClick={() => onNavigate('Register Student')}><UserPlus size={17} /> Register student</button></section>
    <section className="stats-grid">
      <StatCard icon={Users} label="Total students" value={students.length} note="Registered records" tone="blue" />
      <StatCard icon={UserPlus} label="Female students" value={female} note="Female records" tone="purple" />
      <StatCard icon={GraduationCap} label="Male students" value={male} note="Male records" tone="green" />
      <StatCard icon={BookOpen} label="Courses" value={new Set(students.map(s => s.course)).size} note="Courses represented" tone="orange" />
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h3>Recently registered students</h3><p>Latest student records in the system</p></div><button className="text-button" onClick={() => onNavigate('Students')}>View all students <ChevronRight size={16} /></button></div>
      <StudentTable students={students.slice(0, 5)} onView={onView} onDelete={() => {}} compact />
      {students.length === 0 && <EmptyState title="No students yet" text="Register your first student to see records here." />}
    </section>
    <section className="shortcut-banner"><div className="shortcut-icon"><Keyboard size={22} /></div><div><strong>Work faster with keyboard shortcuts</strong><p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search, or <kbd>Ctrl</kbd> + <kbd>N</kbd> to register a student.</p></div><button className="text-button" onClick={() => onNavigate('Event Handling Guide')}>View guide <ChevronRight size={16} /></button></section>
  </div>
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><p>{label}</p><strong>{value}</strong><span>{note}</span></div>
}

function StudentsPage({ students, search, setSearch, onView, onDelete }) {
  return <div className="page-stack">
    <section className="page-intro"><div><p className="eyebrow">STUDENT DIRECTORY</p><h2>All students</h2><p>Search, view, and manage registered student records.</p></div><span className="count-pill">{students.length} records</span></section>
    <section className="panel">
      <div className="list-toolbar"><div className="table-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, email, course..." /></div><span className="muted-text">Showing {students.length} students</span></div>
      <StudentTable students={students} onView={onView} onDelete={onDelete} />
      {students.length === 0 && <EmptyState title="No matching students" text="Try another search term or register a new student." />}
    </section>
  </div>
}

function StudentTable({ students, onView, onDelete, compact = false }) {
  return <div className="table-wrap"><table className="student-table"><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>COURSE</th><th>LEVEL</th><th>GENDER</th><th>JOINED</th><th className="action-heading">ACTIONS</th></tr></thead><tbody>
    {students.map(student => <tr key={student.id} className="clickable-row" onClick={() => onView(student)}>
      <td><div className="student-cell"><div className="student-avatar">{student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</div><div><strong>{student.name}</strong><span>{student.email}</span></div></div></td>
      <td><span className="id-text">{student.id}</span></td><td>{student.course}</td><td><span className="level-pill">{student.level}</span></td><td>{student.gender}</td><td>{student.joined}</td>
      <td><div className="row-actions"><button className="action-btn view" title="View details" onClick={e => { e.stopPropagation(); onView(student) }}><Eye size={16} /></button>{!compact && <button className="action-btn delete" title="Delete student" onClick={e => { e.stopPropagation(); onDelete(student) }}><Trash2 size={16} /></button>}</div></td>
    </tr>)}
  </tbody></table></div>
}

function RegisterPage({ form, errors, onChange, onSubmit, onCancel }) {
  const fields = [
    { name: 'name', label: 'Full name', placeholder: 'Enter student full name', type: 'text' },
    { name: 'email', label: 'Email address', placeholder: 'student@example.com', type: 'email' },
    { name: 'phone', label: 'Phone number', placeholder: '0780000000', type: 'tel' },
    { name: 'address', label: 'Address', placeholder: 'District / City', type: 'text' },
  ]
  return <div className="page-stack narrow-page">
    <section className="page-intro"><div><p className="eyebrow">NEW RECORD</p><h2>Register a student</h2><p>Fill in the information below to add a student to the system.</p></div></section>
    <form className="panel registration-form" onSubmit={onSubmit} noValidate>
      <div className="form-section-title"><div className="section-number">01</div><div><h3>Personal information</h3><p>Enter the student's contact details.</p></div></div>
      <div className="form-grid">
        {fields.map(field => <div className="form-field" key={field.name}><label htmlFor={field.name}>{field.label} <b>*</b></label><input id={field.name} name={field.name} type={field.type} value={form[field.name]} onChange={onChange} placeholder={field.placeholder} className={errors[field.name] ? 'input-error' : ''} />{errors[field.name] && <small className="error-text">{errors[field.name]}</small>}</div>)}
        <div className="form-field"><label htmlFor="gender">Gender <b>*</b></label><select id="gender" name="gender" value={form.gender} onChange={onChange} className={errors.gender ? 'input-error' : ''}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select>{errors.gender && <small className="error-text">{errors.gender}</small>}</div>
      </div>
      <div className="form-divider" />
      <div className="form-section-title"><div className="section-number">02</div><div><h3>Academic information</h3><p>Choose the student's programme and level.</p></div></div>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="course">Course / Trade <b>*</b></label><select id="course" name="course" value={form.course} onChange={onChange} className={errors.course ? 'input-error' : ''}><option value="">Select course</option><option>Software Development</option><option>Networking</option><option>Computer Systems and Architecture</option><option>Construction</option><option>Accounting</option><option>Electrical Technology</option></select>{errors.course && <small className="error-text">{errors.course}</small>}</div>
        <div className="form-field"><label htmlFor="level">Student level <b>*</b></label><select id="level" name="level" value={form.level} onChange={onChange} className={errors.level ? 'input-error' : ''}><option value="">Select level</option>{['L3','L4','L5','L6'].map(level => <option key={level}>{level}</option>)}</select>{errors.level && <small className="error-text">{errors.level}</small>}</div>
      </div>
      <div className="form-note"><ShieldCheck size={17} /><span>All required fields must be completed. Email addresses must be unique.</span></div>
      <div className="form-actions"><button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button><button type="submit" className="btn btn-primary"><UserPlus size={17} /> Save student record</button></div>
    </form>
  </div>
}

function StudentDetails({ student, onBack, onDelete }) {
  return <div className="page-stack narrow-page">
    <button className="back-link" onClick={onBack}>← Back to students</button>
    <section className="panel details-panel">
      <div className="profile-cover" />
      <div className="profile-heading"><div className="profile-avatar">{student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</div><div><h2>{student.name}</h2><p>{student.id} · {student.course}</p></div><span className="status-pill">Active student</span></div>
      <div className="details-content"><h3>Personal information</h3><div className="details-grid"><Detail label="Email address" value={student.email} /><Detail label="Phone number" value={student.phone} /><Detail label="Gender" value={student.gender} /><Detail label="Address" value={student.address} /><Detail label="Course / Trade" value={student.course} /><Detail label="Student level" value={student.level} /><Detail label="Registration date" value={student.joined} /><Detail label="Student ID" value={student.id} /></div><div className="details-actions"><button className="btn btn-light" onClick={onBack}>Back to list</button><button className="btn btn-danger" onClick={onDelete}><Trash2 size={16} /> Delete student</button></div></div>
    </section>
  </div>
}
function Detail({ label, value }) { return <div className="detail-item"><span>{label}</span><strong>{value || 'Not provided'}</strong></div> }

function GuidePage() {
  const examples = [
    ['onSubmit', 'Register a student', 'Handles form submission and calls preventDefault() to stop a page reload.'],
    ['onChange', 'Update form fields and search', 'Reads event.target.name and event.target.value to update React state.'],
    ['onClick', 'View and delete records', 'Runs an action when an administrator clicks a button.'],
    ['onKeyDown / onKeyUp', 'Keyboard shortcuts', 'Detects Ctrl + K to focus search, Ctrl + N to open registration, and Escape to close dialogs.'],
    ['stopPropagation()', 'Nested click handling', 'Stops a child button click from triggering a parent click handler.'],
    ['preventDefault()', 'Prevent default browser actions', 'Stops the browser default form submission so React can validate and save the record.'],
  ]
  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">PRACTICAL REFERENCE</p><h2>ReactJS event handling guide</h2><p>How this Student Management System demonstrates the required event-handling concepts.</p></div></section><section className="panel guide-panel"><div className="guide-callout"><Keyboard size={22} /><div><strong>Keyboard shortcuts</strong><p><kbd>Ctrl</kbd> + <kbd>K</kbd> Search students · <kbd>Ctrl</kbd> + <kbd>N</kbd> Register student · <kbd>Esc</kbd> Close dialog</p></div></div>{examples.map(([event, title, description], i) => <div className="guide-row" key={event}><span className="guide-index">0{i + 1}</span><div><strong>{title}</strong><p>{description}</p></div><code>{event}</code></div>)}</section></div>
}

function EmptyState({ title, text }) { return <div className="empty-state"><div><Users size={24} /></div><strong>{title}</strong><p>{text}</p></div> }

export default App
