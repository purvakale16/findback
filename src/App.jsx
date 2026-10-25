
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/items'

const initialItems = [
  {
    id: 1,
    title: 'Wireless Headphones',
    category: 'Electronics',
    location: 'Central Library',
    date: 'Oct 22, 2026',
    status: 'Lost',
    emoji: '🎧',
    color: '#e8e5ff',
    description: 'Black wireless headphones in a hard case.',
  },
  {
    id: 2,
    title: 'Blue Water Bottle',
    category: 'Accessories',
    location: 'Sports Complex',
    date: 'Oct 23, 2026',
    status: 'Found',
    emoji: '🧴',
    color: '#dff4ff',
    description: 'Blue reusable bottle with a silver cap.',
  },
  {
    id: 3,
    title: 'Student ID Card',
    category: 'Essentials',
    location: 'Cafeteria',
    date: 'Oct 24, 2026',
    status: 'Found',
    emoji: '💳',
    color: '#fff0d9',
    description: 'Student ID card found near the cafeteria entrance.',
  },
  {
    id: 4,
    title: 'Notebook & Notes',
    category: 'Stationery',
    location: 'Lecture Hall B',
    date: 'Oct 24, 2026',
    status: 'Lost',
    emoji: '📓',
    color: '#ffe5ec',
    description: 'A spiral notebook with handwritten class notes.',
  },
  {
    id: 5,
    title: 'House Keys',
    category: 'Essentials',
    location: 'Parking Area',
    date: 'Oct 25, 2026',
    status: 'Found',
    emoji: '🔑',
    color: '#e4f5e8',
    description: 'A small set of keys with a green keychain.',
  },
  {
    id: 6,
    title: 'Black Backpack',
    category: 'Accessories',
    location: 'Computer Lab',
    date: 'Oct 25, 2026',
    status: 'Lost',
    emoji: '🎒',
    color: '#eee8ff',
    description: 'Black backpack with a laptop compartment.',
  },
]

const categories = [
  'All Items',
  'Electronics',
  'Accessories',
  'Essentials',
  'Stationery',
]

function formatItem(item) {
  const category = item.category || 'Other'

  return {
    ...item,
    status: item.item_type || item.status || 'Lost',
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : item.date || 'Date not specified',
    emoji:
      category === 'Electronics'
        ? '🎧'
        : category === 'Stationery'
          ? '📓'
          : category === 'Accessories'
            ? '🎒'
            : category === 'Essentials'
              ? '🔑'
              : '🔎',
    color: '#e8e5ff',
    title: item.title || 'Untitled item',
    location: item.location || 'Location not specified',
    description: item.description || 'No description provided.',
  }
}

function App() {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Items')
  const [status, setStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    category: 'Essentials',
    location: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Lost',
    description: '',
  })

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Failed to load items')
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response')
        }

        setItems(data.map(formatItem))
      } catch (error) {
        console.error('Loading items failed:', error)
        setNotice(
          'Backend connect nahi hua. Demo listings dikh rahi hain; backend check karo.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const visibleItems = items.filter((item) => {
    const query = search.toLowerCase()

    const matchesSearch = [
      item.title,
      item.category,
      item.location,
      item.description,
    ].some((value) => String(value || '').toLowerCase().includes(query))

    return (
      matchesSearch &&
      (category === 'All Items' || item.category === category) &&
      (status === 'All' || item.status === status)
    )
  })

  async function submitItem(event) {
    event.preventDefault()

    if (saving) return

    setSaving(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          location: form.location.trim(),
          description: form.description.trim(),
          item_type: form.status,
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Item could not be saved')
      }

      let result = null

      try {
        result = await response.json()
      } catch {
        // Some APIs return no JSON body after saving.
      }

      let savedItem

      if (result && result.item) {
        savedItem = formatItem(result.item)
      } else if (result && result.id && result.title) {
        savedItem = formatItem(result)
      } else {
        savedItem = formatItem({
          ...form,
          id: result?.id ?? Date.now(),
          item_type: form.status,
          created_at: new Date().toISOString(),
        })
      }

      setItems((currentItems) => [savedItem, ...currentItems])

      setForm({
        title: '',
        category: 'Essentials',
        location: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'Lost',
        description: '',
      })

      setShowForm(false)
      setNotice('Item database mein save ho gaya!')
    } catch (error) {
      console.error('Saving item failed:', error)
      setNotice(
        'Item save nahi hua. Backend terminal mein error check karo.'
      )
    } finally {
      setSaving(false)
    }
  }

  function markResolved(id) {
    setNotice(
      `Item #${id} abhi database se remove nahi hoga. Delete API alag se connect karni hai.`
    )
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="FindBack home">
          <span className="brand-icon">f</span>
          <span>
            find<span className="brand-accent">back</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#items">Browse items</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <button
          className="button button-primary nav-report"
          onClick={() => setShowForm(true)}
        >
          <span>＋</span> Report an item
        </button>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" /> YOUR CAMPUS, MORE CONNECTED
            </div>

            <h1>
              Lost something?
              <br />
              Let’s <span>find it back.</span>
            </h1>

            <p className="hero-description">
              One community, a thousand helping hands. Find what you’ve lost
              and return what you’ve found.
            </p>

            <div className="hero-actions">
              <button
                className="button button-primary"
                onClick={() => setShowForm(true)}
              >
                Report an item <span>↗</span>
              </button>
              <a className="button button-secondary" href="#items">
                Explore listings <span>↓</span>
              </a>
            </div>

            <div className="community-proof">
              <div className="avatar-stack">
                <span>👩🏻</span>
                <span>👨🏽</span>
                <span>👩🏾</span>
                <span>👨🏻</span>
              </div>
              <div>
                <strong>Campus community</strong>
                <small>Helping things find their way home.</small>
              </div>
            </div>
          </div>

          <div
            className="hero-art"
            aria-label="Illustration of a lost and found box"
          >
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="floating-note note-top">
              <span>✦</span> A little help goes a long way
            </div>

            <div className="art-circle">
              <div className="art-sun" />
              <div className="search-glass"><span>⌕</span></div>
              <div className="item-float item-headphones">🎧</div>
              <div className="item-float item-keys">🔑</div>
              <div className="item-float item-card">💳</div>
              <div className="item-float item-book">📒</div>
              <div className="art-box">
                <div className="box-handle" />
                <div className="box-label">LOST<br />&amp; FOUND</div>
              </div>
            </div>

            <div className="floating-note note-bottom">
              <span>♥</span> Good things come full circle
            </div>
          </div>
        </section>

        <section className="stats-strip" aria-label="Platform highlights">
          <div>
            <strong>{items.length.toString().padStart(2, '0')}</strong>
            <span>Community listings</span>
          </div>
          <div>
            <strong>
              {items.filter((item) => item.status === 'Lost').length
                .toString()
                .padStart(2, '0')}
            </strong>
            <span>Items reported lost</span>
          </div>
          <div>
            <strong>
              {items.filter((item) => item.status === 'Found').length
                .toString()
                .padStart(2, '0')}
            </strong>
            <span>Items found</span>
          </div>
          <div className="stats-message">
            <span className="sparkle">✳</span>
            <span>
              Small acts of kindness.
              <br />
              <strong>Big campus energy.</strong>
            </span>
          </div>
        </section>

        <section className="listings-section" id="items">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE COMMUNITY BOARD</div>
              <h2>Lost &amp; found <span>near you.</span></h2>
              <p>Every item has a story. Let’s help it find its way home.</p>
            </div>
            <button
              className="button button-outline"
              onClick={() => setShowForm(true)}
            >
              ＋ Post a listing
            </button>
          </div>

          <div className="filter-panel">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search items, places, keywords..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>

            <div className="status-filters" aria-label="Filter by status">
              {['All', 'Lost', 'Found'].map((value) => (
                <button
                  key={value}
                  className={`status-chip ${status === value ? 'selected' : ''}`}
                  onClick={() => setStatus(value)}
                >
                  {value === 'Lost' ? '↗ ' : value === 'Found' ? '✓ ' : ''}
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="category-filters" aria-label="Filter by category">
            {categories.map((value) => (
              <button
                key={value}
                className={`category-chip ${category === value ? 'selected' : ''}`}
                onClick={() => setCategory(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="listing-summary">
            <span>
              Showing <strong>{visibleItems.length}</strong>{' '}
              {visibleItems.length === 1 ? 'listing' : 'listings'}
            </span>
            <span>
              {loading ? 'Loading items…' : 'Recently added'}{' '}
              <span className="summary-dot">•</span>
            </span>
          </div>

          {visibleItems.length ? (
            <div className="item-grid">
              {visibleItems.map((item) => (
                <article className="item-card" key={item.id}>
                  <div
                    className="item-visual"
                    style={{ backgroundColor: item.color || '#eee8ff' }}
                  >
                    <span className={`item-status ${item.status.toLowerCase()}`}>
                      {item.status === 'Lost' ? '↗' : '✓'} {item.status}
                    </span>
                    <span className="item-emoji">{item.emoji}</span>
                    <span className="visual-sparkle">✳</span>
                  </div>

                  <div className="item-details">
                    <div className="item-meta">
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p className="item-location">
                      <span>⌖</span> {item.location}
                    </p>
                    <p className="item-description">{item.description}</p>
                    <div className="item-card-footer">
                      <span className="campus-tag">Campus listing</span>
                      <button
                        className="resolve-button"
                        onClick={() => markResolved(item.id)}
                        title="Remove this listing"
                        aria-label={`Remove ${item.title}`}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>🔎</span>
              <h3>No items found</h3>
              <p>Try another search or change your filters.</p>
              <button
                className="button button-secondary"
                onClick={() => {
                  setSearch('')
                  setCategory('All Items')
                  setStatus('All')
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="how-section" id="how-it-works">
          <div className="eyebrow">GOOD THINGS HAPPEN TOGETHER</div>
          <h2>Three steps. <span>One less worry.</span></h2>
          <div className="steps-grid">
            <article className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">📣</div>
              <h3>Report it</h3>
              <p>Lost something or found an item? Add a listing with the details.</p>
            </article>
            <article className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">🔍</div>
              <h3>Find a match</h3>
              <p>Search the community board and check matching descriptions and locations.</p>
            </article>
            <article className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">💚</div>
              <h3>Bring it home</h3>
              <p>Connect with your campus community and help an item find its owner.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">f</span>
          <span>
            find<span className="brand-accent">back</span>
          </span>
        </a>
        <p>Made for campus. Powered by kindness. <span>♥</span></p>
        <span className="footer-note">
          Built for campus communities, designed to reunite lost belongings
        </span>
      </footer>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section
            className="report-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <div className="eyebrow">HELP THE COMMUNITY</div>
                <h2 id="report-title">Report an item</h2>
                <p>Share a few details so the right person can find it.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={submitItem}>
              <label>
                Item name
                <input
                  required
                  maxLength="70"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Blue water bottle"
                />
              </label>

              <div className="form-row">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    {categories.slice(1).map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Listing type
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option>Lost</option>
                    <option>Found</option>
                  </select>
                </label>
              </div>

              <label>
                Location
                <input
                  required
                  maxLength="100"
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  placeholder="Where was it lost or found?"
                />
              </label>

              <label>
                Date
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                />
              </label>

              <label>
                Description
                <textarea
                  required
                  maxLength="400"
                  rows="3"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Add identifying details..."
                />
              </label>

              <button
                className="button button-primary submit-button"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Publish listing'} <span>↗</span>
              </button>
              <p className="privacy-note">
                Listings are submitted to the FindBack backend.
              </p>
            </form>
          </section>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default App
