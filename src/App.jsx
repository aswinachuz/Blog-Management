import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "blog-management-posts";
const THEME_KEY = "blog-management-theme";

const EMPTY_BLOG = {
  image: "",
  title: "",
  category: "",
  author: "",
  description: "",
  date: "",
};

const SAMPLE_BLOGS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    title: "Getting Started with React Components",
    category: "React",
    author: "Cristiano Ronaldo",
    description:
      "React components are reusable building blocks that make complex interfaces easier to understand, test, and maintain. Start small, compose thoughtfully, and let your UI grow naturally.",
    date: "2026-06-19",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    title: "Essential JavaScript Concepts for Beginners",
    category: "JavaScript",
    author: "Joseph Vijay",
    description:
      "A practical tour of array methods, arrow functions, template literals, destructuring, and the other modern JavaScript ideas that make React code feel clear and expressive.",
    date: "2026-06-17",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=1200&q=80",
    title: "Designing Layouts with CSS Grid",
    category: "CSS",
    author: "Lionel Messi",
    description:
      "CSS Grid gives you precise two-dimensional control without brittle positioning. Learn a few dependable patterns for dashboards, article feeds, and responsive card layouts.",
    date: "2026-06-15",
  },
];

function loadBlogs() {
  try {
    const savedBlogs = localStorage.getItem(STORAGE_KEY);
    const parsedBlogs = savedBlogs ? JSON.parse(savedBlogs) : SAMPLE_BLOGS;
    return Array.isArray(parsedBlogs) ? parsedBlogs : SAMPLE_BLOGS;
  } catch {
    return SAMPLE_BLOGS;
  }
}

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5 8.5 8.5 0 1 0 20.5 14.4Z" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  );
}

function BlogCard({ blog, onEdit, onDelete }) {
  return (
    <article className="blog-card">
      <div className={`card-image ${blog.image ? "" : "image-placeholder"}`}>
        {blog.image ? (
          <img src={blog.image} alt="" loading="lazy" />
        ) : (
          <span>{blog.category.slice(0, 1).toUpperCase()}</span>
        )}
        <span className="card-category">{blog.category}</span>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span>{formatDate(blog.date)}</span>
          <span aria-hidden="true">•</span>
          <span>5 min read</span>
        </div>

        <h2>{blog.title}</h2>
        <p className="card-description">{blog.description}</p>

        <div className="card-footer">
          <div className="card-author">
            <span className="author-avatar">{getInitials(blog.author)}</span>
            <span>
              <small>Written by</small>
              <strong>{blog.author}</strong>
            </span>
          </div>

          <div className="card-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => onEdit(blog)}
              aria-label={`Edit ${blog.title}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="button button-danger"
              onClick={() => onDelete(blog.id)}
              aria-label={`Delete ${blog.title}`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function App() {
  // Load saved blogs only when the page opens.
  const [blogs, setBlogs] = useState(loadBlogs);
  const [search, setSearch] = useState("");
  const [blog, setBlog] = useState(EMPTY_BLOG);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "light",
  );

  // Save every add, update, and delete to localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const filteredBlogs = blogs.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.title.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.author.toLowerCase().includes(searchText)
    );
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setBlog({ ...blog, [name]: value });

    if (error) setError("");
  }

  function resetForm() {
    setBlog(EMPTY_BLOG);
    setEditId(null);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const blogToSave = {
      ...blog,
      image: blog.image.trim(),
      title: blog.title.trim(),
      category: blog.category.trim(),
      author: blog.author.trim(),
      description: blog.description.trim(),
    };

    if (
      !blogToSave.title ||
      !blogToSave.category ||
      !blogToSave.author ||
      !blogToSave.description ||
      !blogToSave.date
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (editId) {
      const updatedBlogs = blogs.map((item) =>
        item.id === editId ? { ...blogToSave, id: editId } : item,
      );
      setBlogs(updatedBlogs);
    } else {
      const newBlog = {
        ...blogToSave,
        id: Date.now(),
      };
      setBlogs([newBlog, ...blogs]);
    }

    resetForm();
  }

  function handleEdit(selectedBlog) {
    setBlog({
      image: selectedBlog.image || "",
      title: selectedBlog.title,
      category: selectedBlog.category,
      author: selectedBlog.author,
      description: selectedBlog.description,
      date: selectedBlog.date,
    });
    setEditId(selectedBlog.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    const remainingBlogs = blogs.filter((item) => item.id !== id);
    setBlogs(remainingBlogs);

    if (editId === id) resetForm();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#" aria-label="DevPulse home">
          <span className="brand-mark">D</span>
          <span>
            Blog Management
            <small>Stories worth sharing</small>
          </span>
        </a>

        <div className="header-actions">
          <div className="article-count">
            <strong>{blogs.length}</strong>
            <span>{blogs.length === 1 ? "Article" : "Articles"}</span>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme((currentTheme) =>
                currentTheme === "light" ? "dark" : "light",
              )
            }
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">THE DEVELOPER JOURNAL</p>
        <h1>Ideas, code, and everything in between.</h1>
        <p className="hero-copy">
          Capture what you learn, share your perspective, and keep your best
          ideas in one beautiful place.
        </p>
      </section>

      <main className="main-layout">
        <section className="feed-column" aria-label="Blog posts">
          <div className="feed-toolbar">
            <div>
              <p className="section-kicker">LATEST STORIES</p>
              <h2>Explore the blog</h2>
            </div>
            <label className="search-box">
              <span className="sr-only">Search blogs</span>
              <SearchIcon />
              <input
                type="search"
                placeholder="Search title, category, or author..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="blog-list">
            {filteredBlogs.length ? (
              filteredBlogs.map((item) => (
                <BlogCard
                  key={item.id}
                  blog={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="empty-state">
                <EmptyIcon />
                <h3>No stories found</h3>
                <p>
                  {search
                    ? "Try another title, category, or author."
                    : "Publish your first story using the form."}
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="sidebar-column">
          <div className="form-card">
            <div className="form-heading">
              <span>{editId === null ? "✦" : "↻"}</span>
              <div>
                <p className="section-kicker">
                  {editId === null ? "NEW STORY" : "EDITING"}
                </p>
                <h2>{editId === null ? "Create a blog" : "Update your blog"}</h2>
              </div>
            </div>

            <form className="blog-form" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <label className="form-group">
                <span>
                  Image URL <small>Optional</small>
                </span>
                <input
                  type="url"
                  name="image"
                  placeholder="https://images.example.com/photo.jpg"
                  value={blog.image}
                  onChange={handleChange}
                />
              </label>

              <label className="form-group">
                <span>Blog title *</span>
                <input
                  type="text"
                  name="title"
                  placeholder="Give your story a great title"
                  value={blog.title}
                  onChange={handleChange}
                />
              </label>

              <div className="form-row">
                <label className="form-group">
                  <span>Category *</span>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. React"
                    value={blog.category}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>Published date *</span>
                  <input
                    type="date"
                    name="date"
                    value={blog.date}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="form-group">
                <span>Author name *</span>
                <input
                  type="text"
                  name="author"
                  placeholder="Who is writing?"
                  value={blog.author}
                  onChange={handleChange}
                />
              </label>

              <label className="form-group">
                <span>Description *</span>
                <textarea
                  name="description"
                  placeholder="Share the heart of your story..."
                  rows="5"
                  value={blog.description}
                  onChange={handleChange}
                />
              </label>

              <div className="form-buttons">
                <button type="submit" className="button button-primary">
                  {editId === null ? "Publish story" : "Save changes"}
                  <span aria-hidden="true">→</span>
                </button>
                {editId !== null && (
                  <button
                    type="button"
                    className="button button-cancel"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <p className="storage-note">
            <span>✓</span> Your stories are saved automatically on this device.
          </p>
        </aside>
      </main>

      <footer>
        <span>Blog Management</span>
        <p>Built for curious minds of Softronics.</p>
      </footer>
    </div>
  );
}

export default App;
