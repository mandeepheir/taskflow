
import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  CheckCheck,
  CircleHelp,
  ClipboardList,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  X,
} from 'lucide-react'
import './App.css'

const STORAGE_KEY = 'taskflow-tasks-v1'

const FILTERS = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

const PRIORITIES = ['Low', 'Medium', 'High']

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return []

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((task) => task && typeof task.title === 'string')
      .map((task) => ({
        id: task.id ?? Date.now() + Math.random(),
        title: task.title,
        completed: Boolean(task.completed),
        priority: PRIORITIES.includes(task.priority)
          ? task.priority
          : 'Medium',
        createdAt: task.createdAt ?? Date.now(),
      }))
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(readTasks)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortByPriority, setSortByPriority] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      setNotice(
        'Could not save tasks in this browser. Check storage settings.',
      )
    }
  }, [tasks])

  const completedCount = tasks.filter(
    (task) => task.completed,
  ).length

  const remainingCount = tasks.length - completedCount

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()

    let result = tasks.filter((task) => {
      const matchesFilter =
        filter === 'active'
          ? !task.completed
          : filter === 'completed'
            ? task.completed
            : true

      return (
        matchesFilter &&
        task.title.toLowerCase().includes(query)
      )
    })

    if (sortByPriority) {
      const rank = { High: 0, Medium: 1, Low: 2 }

      result = [...result].sort(
        (a, b) =>
          rank[a.priority] - rank[b.priority] ||
          b.createdAt - a.createdAt,
      )
    } else {
      result = [...result].sort(
        (a, b) => b.createdAt - a.createdAt,
      )
    }

    return result
  }, [tasks, filter, search, sortByPriority])

  function addTask(event) {
    event.preventDefault()

    const cleanTitle = title.trim()

    if (!cleanTitle) {
      setNotice('Please enter a task before adding it.')
      return
    }

    setTasks((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        title: cleanTitle,
        completed: false,
        priority,
        createdAt: Date.now(),
      },
    ])

    setTitle('')
    setPriority('Medium')
    setNotice('')
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id),
    )

    if (editingId === id) {
      cancelEditing()
    }
  }

  function beginEditing(task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
    setNotice('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingTitle('')
  }

  function saveEdit(event, id) {
    event.preventDefault()

    const cleanTitle = editingTitle.trim()

    if (!cleanTitle) {
      setNotice('A task title cannot be empty.')
      return
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, title: cleanTitle }
          : task,
      ),
    )

    cancelEditing()
    setNotice('')
  }

  function clearCompleted() {
    if (!completedCount) return

    const confirmed = window.confirm(
      `Delete ${completedCount} completed task${
        completedCount === 1 ? '' : 's'
      }?`,
    )

    if (confirmed) {
      setTasks((current) =>
        current.filter((task) => !task.completed),
      )
      setNotice('')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#top"
          aria-label="TaskFlow home"
        >
          <span className="brand-mark">
            <CheckCheck size={21} />
          </span>
          <span>TaskFlow</span>
        </a>

        <div className="sidebar-section-label">
          WORKSPACE
        </div>

        <nav className="side-nav" aria-label="Task filters">
          {FILTERS.map((item) => {
            const count =
              item.id === 'all'
                ? tasks.length
                : item.id === 'active'
                  ? remainingCount
                  : completedCount

            const Icon =
              item.id === 'all'
                ? ListTodo
                : item.id === 'active'
                  ? Target
                  : CheckCircleIcon

            return (
              <button
                className={`nav-item ${
                  filter === item.id ? 'selected' : ''
                }`}
                key={item.id}
                onClick={() => setFilter(item.id)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
                <span className="nav-count">{count}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip-icon">
            <Sparkles size={17} />
          </div>
          <p className="tip-title">One step at a time</p>
          <p className="tip-copy">
            Focus on what matters most. Progress adds up.
          </p>
        </div>
      </aside>

      <main className="main-content" id="top">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              YOUR DAILY WORKSPACE
            </p>
            <p className="topbar-title">
              A little progress every day.
            </p>
          </div>

          <div
            className="avatar"
            aria-label="Personal workspace"
          >
            TF
          </div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">MY TASKS</p>
            <h1>
              Get things done<span>.</span>
            </h1>
            <p className="subtitle">
              Plan your day, keep your focus, and celebrate
              the small wins.
            </p>
          </div>

          <div className="date-chip">
            <Sparkles size={15} />
            Make today count
          </div>
        </section>

        <section
          className="stats-grid"
          aria-label="Task statistics"
        >
          <article className="stat-card">
            <div className="stat-top">
              <span>Total tasks</span>
              <span className="stat-icon purple">
                <ClipboardList size={18} />
              </span>
            </div>
            <strong className="stat-number">
              {tasks.length}
            </strong>
            <span className="stat-foot">
              In your workspace
            </span>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Completed</span>
              <span className="stat-icon green">
                <Check size={18} />
              </span>
            </div>
            <strong className="stat-number">
              {completedCount}
            </strong>
            <span className="stat-foot">
              Nice work so far
            </span>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Remaining</span>
              <span className="stat-icon amber">
                <Target size={18} />
              </span>
            </div>
            <strong className="stat-number">
              {remainingCount}
            </strong>
            <span className="stat-foot">
              Ready for your focus
            </span>
          </article>
        </section>

        <section
          className="progress-card"
          aria-label="Overall progress"
        >
          <div className="progress-copy">
            <div>
              <h2>Daily progress</h2>
              <p>
                {tasks.length === 0
                  ? 'Add a task to get your day moving.'
                  : `${completedCount} of ${tasks.length} tasks completed`}
              </p>
            </div>
            <strong>{progress}%</strong>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Task completion"
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="tasks-panel">
          <div className="panel-heading">
            <div>
              <h2>Your task list</h2>
              <p>
                Keep the next step clear and achievable.
              </p>
            </div>

            {completedCount > 0 && (
              <button
                className="text-button"
                type="button"
                onClick={clearCompleted}
              >
                <Trash2 size={15} />
                Clear completed
              </button>
            )}
          </div>

          <form className="task-form" onSubmit={addTask}>
            <label
              className="sr-only"
              htmlFor="new-task"
            >
              Task title
            </label>

            <input
              id="new-task"
              className="task-input"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="What needs to get done?"
              maxLength={160}
            />

            <label
              className="sr-only"
              htmlFor="task-priority"
            >
              Priority
            </label>

            <select
              id="task-priority"
              className="priority-select"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              <option value="Low">Low priority</option>
              <option value="Medium">
                Medium priority
              </option>
              <option value="High">High priority</option>
            </select>

            <button className="add-button" type="submit">
              <Plus size={17} />
              Add task
            </button>
          </form>

          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}

          <div className="task-toolbar">
            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter tasks"
            >
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`filter-tab ${
                    filter === item.id ? 'active' : ''
                  }`}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                  <span>
                    {item.id === 'all'
                      ? tasks.length
                      : item.id === 'active'
                        ? remainingCount
                        : completedCount}
                  </span>
                </button>
              ))}
            </div>

            <div className="toolbar-actions">
              <label className="search-box">
                <Search size={16} />
                <span className="sr-only">
                  Search tasks
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search tasks"
                />

                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>

              <button
                type="button"
                className={`sort-button ${
                  sortByPriority ? 'sort-active' : ''
                }`}
                onClick={() =>
                  setSortByPriority((current) => !current)
                }
                title="Toggle priority sorting"
              >
                Priority {sortByPriority ? '↑' : '↕'}
              </button>
            </div>
          </div>

          {visibleTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <CircleHelp size={24} />
              </div>

              <h3>
                {tasks.length === 0
                  ? 'Your day starts here'
                  : 'No tasks found'}
              </h3>

              <p>
                {tasks.length === 0
                  ? 'Add your first task above and build some momentum.'
                  : search.trim()
                    ? 'Try a different search term or change the filter.'
                    : 'There are no tasks in this view right now.'}
              </p>

              {search && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setSearch('')}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <article
                  className={`task-row ${
                    task.completed ? 'task-completed' : ''
                  }`}
                  key={task.id}
                >
                  <button
                    type="button"
                    className={`task-check ${
                      task.completed ? 'checked' : ''
                    }`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? `Mark ${task.title} active`
                        : `Complete ${task.title}`
                    }
                    aria-pressed={task.completed}
                  >
                    {task.completed && (
                      <Check size={14} />
                    )}
                  </button>

                  <div className="task-details">
                    {editingId === task.id ? (
                      <form
                        className="edit-form"
                        onSubmit={(event) =>
                          saveEdit(event, task.id)
                        }
                      >
                        <input
                          autoFocus
                          value={editingTitle}
                          onChange={(event) =>
                            setEditingTitle(
                              event.target.value,
                            )
                          }
                          maxLength={160}
                          aria-label="Edit task title"
                        />

                        <button
                          type="submit"
                          className="icon-button save-edit"
                          aria-label="Save task"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          type="button"
                          className="icon-button"
                          onClick={cancelEditing}
                          aria-label="Cancel editing"
                        >
                          <X size={16} />
                        </button>
                      </form>
                    ) : (
                      <>
                        <p className="task-title">
                          {task.title}
                        </p>

                        <div className="task-meta">
                          <span
                            className={`priority-badge priority-${task.priority.toLowerCase()}`}
                          >
                            <span className="priority-dot" />
                            {task.priority}
                          </span>

                          <span className="task-created">
                            Added{' '}
                            {new Date(
                              task.createdAt,
                            ).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {editingId !== task.id && (
                    <div className="task-actions">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => beginEditing(task)}
                        aria-label={`Edit ${task.title}`}
                        title="Edit task"
                      >
                        <span className="edit-glyph">
                          ✎
                        </span>
                      </button>

                      <button
                        type="button"
                        className="icon-button delete-icon"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          <div className="panel-footer">
            <span>
              {visibleTasks.length}{' '}
              {visibleTasks.length === 1
                ? 'task'
                : 'tasks'}{' '}
              shown
            </span>

            <span>
              <span className="saved-dot" />
              Saved in this browser
            </span>
          </div>
        </section>

        <footer className="app-footer">
          Built with care using React <span>·</span> One task
          at a time.
        </footer>
      </main>
    </div>
  )
}

function CheckCircleIcon({ size = 18 }) {
  return <CheckCheck size={size} />
}

export default App
