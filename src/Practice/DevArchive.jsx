import { useState, useEffect, useRef } from "react";

const MOCK_ENTRIES = [
  {
    id: 1,
    title: "React useEffect infinite loop with object dependency",
    errorMessage: "Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.",
    solution: `// ❌ Problem: object reference changes every render
useEffect(() => {
  fetchData(config);
}, [config]); // config = { url: '/api/data' } — new ref each render

// ✅ Fix: destructure primitive values
const { url, method } = config;
useEffect(() => {
  fetchData({ url, method });
}, [url, method]);

// OR use useMemo to stabilize the reference
const stableConfig = useMemo(() => config, [config.url, config.method]);`,
    tags: ["React", "JavaScript", "Hooks", "useEffect"],
    language: "javascript",
    project: "Dashboard App",
    severity: "medium",
    createdAt: "2024-11-15",
    solvedIn: "2h 30m",
  },
  {
    id: 2,
    title: "Spring Boot N+1 query problem with JPA",
    errorMessage: "HibernateJdbcException: Unable to execute JDBC batch update. Too many queries generated — detected 847 SELECT statements for 50 records.",
    solution: `// ❌ Problem: lazy loading triggers N+1 queries
@OneToMany(fetch = FetchType.LAZY)
private List<Comment> comments;

// ✅ Fix 1: Use JOIN FETCH in JPQL
@Query("SELECT p FROM Post p LEFT JOIN FETCH p.comments WHERE p.id IN :ids")
List<Post> findAllWithComments(@Param("ids") List<Long> ids);

// ✅ Fix 2: Use @EntityGraph
@EntityGraph(attributePaths = {"comments", "author"})
List<Post> findByStatus(String status);

// ✅ Fix 3: @BatchSize for collections
@BatchSize(size = 25)
@OneToMany(fetch = FetchType.LAZY)
private List<Comment> comments;`,
    tags: ["Java", "Spring Boot", "JPA", "Hibernate", "SQL"],
    language: "java",
    project: "Blog Platform",
    severity: "high",
    createdAt: "2024-10-22",
    solvedIn: "4h 15m",
  },
  {
    id: 3,
    title: "CORS error on fetch request to Spring API",
    errorMessage: "Access to fetch at 'http://localhost:8080/api/entries' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.",
    solution: `// Spring Boot: Add CORS configuration globally
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000", "https://yourdomain.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}

// OR per-controller using @CrossOrigin
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/entries")
public class EntryController { ... }`,
    tags: ["Spring Boot", "CORS", "React", "API", "HTTP"],
    language: "java",
    project: "DevArchive",
    severity: "low",
    createdAt: "2024-10-08",
    solvedIn: "45m",
  },
  {
    id: 4,
    title: "MySQL LONGTEXT full-text search not returning results",
    errorMessage: "SELECT * FROM entries WHERE MATCH(error_message, solution) AGAINST ('useEffect' IN BOOLEAN MODE) — returns 0 rows despite matching records existing in the database.",
    solution: `-- Check if FULLTEXT index exists
SHOW INDEX FROM entries WHERE Index_type = 'FULLTEXT';

-- Create FULLTEXT index if missing
ALTER TABLE entries 
ADD FULLTEXT INDEX ft_search (error_message, solution, title);

-- Minimum word length might be filtering short terms
-- Check ft_min_word_len (default = 4 chars!)
SHOW VARIABLES LIKE 'ft_min_word_len';

-- Fix: Set in my.cnf and rebuild indexes
[mysqld]
ft_min_word_len = 2
innodb_ft_min_token_size = 2

-- Then rebuild
REPAIR TABLE entries QUICK;

-- For InnoDB use this instead:
OPTIMIZE TABLE entries;`,
    tags: ["MySQL", "SQL", "Full-text Search", "Database"],
    language: "sql",
    project: "DevArchive",
    severity: "high",
    createdAt: "2024-09-30",
    solvedIn: "3h",
  },
];

const LANG_COLORS = {
  javascript: "#F7DF1E",
  java: "#ED8B00",
  sql: "#336791",
  python: "#3776AB",
  typescript: "#3178C6",
  css: "#264DE4",
};

const SEVERITY_CONFIG = {
  low: { color: "#22c55e", label: "LOW" },
  medium: { color: "#f59e0b", label: "MED" },
  high: { color: "#ef4444", label: "HIGH" },
};

const TAGS_PALETTE = [
  "#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7",
  "#DDA0DD","#98D8C8","#F7DC6F","#BB8FCE","#85C1E9",
];

function getTagColor(tag) {
  let hash = 0;
  for (let c of tag) hash = (hash * 31 + c.charCodeAt(0)) % TAGS_PALETTE.length;
  return TAGS_PALETTE[hash];
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", marginTop: 8 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#0d1117", borderRadius: "8px 8px 0 0",
        padding: "6px 14px", borderBottom: "1px solid #30363d"
      }}>
        <span style={{ color: LANG_COLORS[language] || "#ccc", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, letterSpacing: 1 }}>
          {language?.toUpperCase()}
        </span>
        <button onClick={copy} style={{
          background: copied ? "#22c55e22" : "transparent", border: `1px solid ${copied ? "#22c55e" : "#30363d"}`,
          color: copied ? "#22c55e" : "#8b949e", fontSize: 11, padding: "3px 10px",
          borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
          transition: "all 0.2s"
        }}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre style={{
        background: "#0d1117", margin: 0, padding: "16px", borderRadius: "0 0 8px 8px",
        overflowX: "auto", fontSize: 13, lineHeight: 1.7,
        fontFamily: "'JetBrains Mono', monospace", color: "#e6edf3",
        border: "1px solid #30363d", borderTop: "none"
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Tag({ label, removable, onRemove }) {
  const color = getTagColor(label);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: color + "20", color, border: `1px solid ${color}50`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11,
      fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
      letterSpacing: 0.5, whiteSpace: "nowrap"
    }}>
      {label}
      {removable && (
        <span onClick={onRemove} style={{ cursor: "pointer", opacity: 0.7, marginLeft: 2, fontSize: 13, lineHeight: 1 }}>×</span>
      )}
    </span>
  );
}

function EntryCard({ entry, onClick, isSelected }) {
  const sev = SEVERITY_CONFIG[entry.severity];
  return (
    <div onClick={onClick} style={{
      background: isSelected ? "#1a1f2e" : "#111827",
      border: `1px solid ${isSelected ? "#4f6ef7" : "#1f2937"}`,
      borderLeft: `3px solid ${isSelected ? "#4f6ef7" : sev.color}`,
      borderRadius: 10, padding: "16px 18px", cursor: "pointer",
      transition: "all 0.2s", marginBottom: 10,
      boxShadow: isSelected ? "0 0 0 1px #4f6ef744" : "none"
    }}
    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "#2d3748"; }}
    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "#1f2937"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          color: sev.color, letterSpacing: 1.5,
          background: sev.color + "15", padding: "2px 7px", borderRadius: 4
        }}>{sev.label}</span>
        <span style={{ fontSize: 11, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace" }}>{entry.createdAt}</span>
      </div>
      <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>
        {entry.title}
      </h3>
      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
      }}>
        {entry.errorMessage}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {entry.tags.slice(0, 4).map(t => <Tag key={t} label={t} />)}
        {entry.tags.length > 4 && <span style={{ fontSize: 11, color: "#4b5563", alignSelf: "center" }}>+{entry.tags.length - 4}</span>}
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      backdropFilter: "blur(4px)"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111827", border: "1px solid #1f2937", borderRadius: 16,
        width: "100%", maxWidth: 720, maxHeight: "90vh", overflow: "auto",
        padding: 32, position: "relative",
        boxShadow: "0 25px 80px #000000aa"
      }}>
        {children}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "transparent",
          border: "none", color: "#6b7280", cursor: "pointer", fontSize: 20, lineHeight: 1
        }}>×</button>
      </div>
    </div>
  );
}

function NewEntryForm({ onSave, onClose }) {
  const [form, setForm] = useState({
    title: "", errorMessage: "", solution: "", tags: [],
    language: "javascript", project: "", severity: "medium"
  });
  const [tagInput, setTagInput] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const handleSubmit = () => {
    if (!form.title || !form.errorMessage || !form.solution) return;
    onSave({ ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], solvedIn: "—" });
  };

  const inputStyle = {
    width: "100%", background: "#0d1117", border: "1px solid #1f2937", borderRadius: 8,
    color: "#e2e8f0", padding: "10px 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
  };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280",
    letterSpacing: 1.5, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f6ef7" }} />
          <h2 style={{ margin: 0, fontSize: 20, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
            New Archive Entry
          </h2>
        </div>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 13, paddingLeft: 18, fontFamily: "'DM Sans', sans-serif" }}>
          Document the bug and solution for future reference
        </p>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        <div>
          <label style={labelStyle}>ENTRY TITLE</label>
          <input value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="Brief description of the issue..." style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#4f6ef7"}
            onBlur={e => e.target.style.borderColor = "#1f2937"} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>PROJECT</label>
            <input value={form.project} onChange={e => set("project", e.target.value)}
              placeholder="Project name" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#4f6ef7"}
              onBlur={e => e.target.style.borderColor = "#1f2937"} />
          </div>
          <div>
            <label style={labelStyle}>LANGUAGE</label>
            <select value={form.language} onChange={e => set("language", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}>
              {["javascript","typescript","java","python","sql","css"].map(l =>
                <option key={l} value={l}>{l}</option>
              )}
            </select>
          </div>
          <div>
            <label style={labelStyle}>SEVERITY</label>
            <select value={form.severity} onChange={e => set("severity", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}>
              {["low","medium","high"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>🔴 ERROR MESSAGE</label>
          <textarea value={form.errorMessage} onChange={e => set("errorMessage", e.target.value)}
            placeholder="Paste the exact error message or describe what went wrong..."
            rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = "#ef4444"}
            onBlur={e => e.target.style.borderColor = "#1f2937"} />
        </div>

        <div>
          <label style={labelStyle}>✅ SOLUTION CODE</label>
          <textarea value={form.solution} onChange={e => set("solution", e.target.value)}
            placeholder="Document the working solution with code comments..."
            rows={8} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#1f2937"} />
        </div>

        <div>
          <label style={labelStyle}>TAGS</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add tag and press Enter..." style={{ ...inputStyle, flex: 1 }}
              onFocus={e => e.target.style.borderColor = "#4f6ef7"}
              onBlur={e => e.target.style.borderColor = "#1f2937"} />
            <button onClick={addTag} style={{
              background: "#4f6ef7", border: "none", color: "#fff",
              borderRadius: 8, padding: "0 18px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 14
            }}>Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {form.tags.map(t => <Tag key={t} label={t} removable onRemove={() => set("tags", form.tags.filter(x => x !== t))} />)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8 }}>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid #1f2937", color: "#9ca3af",
            borderRadius: 8, padding: "10px 22px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", border: "none",
            color: "#fff", borderRadius: 8, padding: "10px 28px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
            boxShadow: "0 4px 20px #4f6ef740"
          }}>
            Archive Entry →
          </button>
        </div>
      </div>
    </div>
  );
}

function EntryDetail({ entry }) {
  const sev = SEVERITY_CONFIG[entry.severity];
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: sev.color, background: sev.color + "15",
            padding: "3px 9px", borderRadius: 4, letterSpacing: 1.5
          }}>{sev.label} SEVERITY</span>
          {entry.project && (
            <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>
              📁 {entry.project}
            </span>
          )}
          <span style={{ fontSize: 11, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace", marginLeft: "auto" }}>
            {entry.createdAt} · ⏱ {entry.solvedIn}
          </span>
        </div>
        <h2 style={{ margin: 0, fontSize: 22, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.3 }}>
          {entry.title}
        </h2>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
          padding: "10px 14px", background: "#ef444412", border: "1px solid #ef444430", borderRadius: 8
        }}>
          <span style={{ fontSize: 16 }}>🔴</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", letterSpacing: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>
            ERROR MESSAGE
          </span>
        </div>
        <pre style={{
          background: "#0d1117", border: "1px solid #ef444420", borderRadius: 8,
          padding: 16, margin: 0, fontSize: 13, color: "#fca5a5",
          fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap",
          wordBreak: "break-word", lineHeight: 1.6
        }}>
          {entry.errorMessage}
        </pre>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
          padding: "10px 14px", background: "#22c55e12", border: "1px solid #22c55e30", borderRadius: 8
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>
            SOLUTION
          </span>
        </div>
        <CodeBlock code={entry.solution} language={entry.language} />
      </div>

      <div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1.5,
          fontFamily: "'JetBrains Mono', monospace", display: "block", marginBottom: 8 }}>TAGS</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {entry.tags.map(t => <Tag key={t} label={t} />)}
        </div>
      </div>
    </div>
  );
}

export default function DevArchive() {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(MOCK_ENTRIES[0].id);
  const [showNew, setShowNew] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileView, setMobileView] = useState("list");

  const selectedEntry = entries.find(e => e.id === selectedId);

  const filtered = entries.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) ||
      e.errorMessage.toLowerCase().includes(q) || e.solution.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q));
    const matchFilter = activeFilter === "all" || e.severity === activeFilter ||
      e.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase());
    return matchSearch && matchFilter;
  });

  const allTags = [...new Set(entries.flatMap(e => e.tags))].slice(0, 8);

  const saveEntry = (entry) => {
    setEntries(prev => [entry, ...prev]);
    setSelectedId(entry.id);
    setShowNew(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0a0e1a; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #374151; }
        input::placeholder, textarea::placeholder { color: #374151; }
        select option { background: #111827; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .entry-animate { animation: fadeIn 0.3s ease; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        .pulse { animation: pulse 2s infinite; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0e1a", color: "#e2e8f0" }}>

        {/* TOP NAV */}
        <header style={{
          background: "#080c17", borderBottom: "1px solid #1f2937",
          padding: "0 24px", display: "flex", alignItems: "center", gap: 16,
          height: 56, flexShrink: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #4f6ef7, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
            }}>⚡</div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#e2e8f0" }}>
              Dev<span style={{ color: "#4f6ef7" }}>Archive</span>
            </span>
          </div>

          <div style={{ flex: 1, maxWidth: 400, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#4b5563" }}>⌕</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search errors, solutions, tags..."
              style={{
                width: "100%", background: "#111827", border: "1px solid #1f2937",
                borderRadius: 8, color: "#e2e8f0", padding: "8px 12px 8px 34px",
                fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none"
              }}
              onFocus={e => e.target.style.borderColor = "#4f6ef7"}
              onBlur={e => e.target.style.borderColor = "#1f2937"}
            />
            {search && (
              <span onClick={() => setSearch("")} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                cursor: "pointer", color: "#6b7280", fontSize: 16
              }}>×</span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <div style={{ display: "flex", gap: 3 }}>
              {[
                { label: "All", val: "all" }, { label: "🔴 High", val: "high" },
                { label: "🟡 Med", val: "medium" }, { label: "🟢 Low", val: "low" }
              ].map(f => (
                <button key={f.val} onClick={() => setActiveFilter(f.val)} style={{
                  background: activeFilter === f.val ? "#4f6ef720" : "transparent",
                  border: `1px solid ${activeFilter === f.val ? "#4f6ef7" : "#1f2937"}`,
                  color: activeFilter === f.val ? "#4f6ef7" : "#9ca3af",
                  borderRadius: 6, padding: "5px 11px", cursor: "pointer",
                  fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600
                }}>{f.label}</button>
              ))}
            </div>
            <button onClick={() => setShowNew(true)} style={{
              background: "linear-gradient(135deg, #4f6ef7, #7c3aed)", border: "none",
              color: "#fff", borderRadius: 8, padding: "7px 16px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
              boxShadow: "0 2px 12px #4f6ef740", whiteSpace: "nowrap"
            }}>+ New Entry</button>
          </div>
        </header>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* SIDEBAR */}
          <aside style={{
            width: 360, minWidth: 320, borderRight: "1px solid #1f2937",
            display: "flex", flexDirection: "column", overflow: "hidden",
            background: "#0a0e1a"
          }}>
            {/* Stats bar */}
            <div style={{
              padding: "12px 16px", borderBottom: "1px solid #1f2937",
              display: "flex", gap: 16
            }}>
              {[
                { label: "Total", val: entries.length, color: "#4f6ef7" },
                { label: "This Month", val: 3, color: "#22c55e" },
                { label: "High Sev", val: entries.filter(e => e.severity === "high").length, color: "#ef4444" },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#4b5563", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tag filters */}
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #1f2937", display: "flex", flexWrap: "wrap", gap: 5 }}>
              {allTags.map(t => (
                <span key={t} onClick={() => setActiveFilter(activeFilter === t ? "all" : t)} style={{
                  cursor: "pointer", opacity: activeFilter === t ? 1 : 0.6,
                  transform: activeFilter === t ? "scale(1.05)" : "scale(1)", transition: "all 0.15s"
                }}>
                  <Tag label={t} />
                </span>
              ))}
            </div>

            {/* Entry count */}
            <div style={{ padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace" }}>
                {filtered.length} ENTRIES
              </span>
              {search && (
                <span style={{ fontSize: 11, color: "#4f6ef7", fontFamily: "'JetBrains Mono', monospace" }}>
                  "{search}"
                </span>
              )}
            </div>

            {/* Entry list */}
            <div style={{ flex: 1, overflow: "auto", padding: "4px 12px 12px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#4b5563" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 6 }}>No entries found</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>Try different search terms</div>
                </div>
              ) : filtered.map(entry => (
                <div key={entry.id} className="entry-animate">
                  <EntryCard
                    entry={entry}
                    isSelected={selectedId === entry.id}
                    onClick={() => setSelectedId(entry.id)}
                  />
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
            {selectedEntry ? (
              <div className="entry-animate">
                <EntryDetail entry={selectedEntry} />
              </div>
            ) : (
              <div style={{
                height: "100%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", textAlign: "center",
                color: "#4b5563"
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 20, marginBottom: 20,
                  background: "linear-gradient(135deg, #4f6ef720, #7c3aed20)",
                  border: "1px solid #4f6ef730",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36
                }}>⚡</div>
                <h2 style={{ margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif", color: "#9ca3af", fontWeight: 700 }}>
                  Select an entry
                </h2>
                <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  Choose a bug entry from the list to view details
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Right panel - quick stats */}
        <div style={{
          position: "fixed", right: 0, top: 56, bottom: 0, width: 200,
          background: "#080c17", borderLeft: "1px solid #1f2937",
          padding: 16, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto"
        }}>
          <div>
            <div style={{ fontSize: 10, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1.5, marginBottom: 10 }}>ACTIVITY</div>
            {[
              { month: "Nov", count: 12, max: 15 },
              { month: "Oct", count: 15, max: 15 },
              { month: "Sep", count: 8, max: 15 },
              { month: "Aug", count: 10, max: 15 },
              { month: "Jul", count: 6, max: 15 },
            ].map(m => (
              <div key={m.month} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ width: 26, fontSize: 10, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>{m.month}</span>
                <div style={{ flex: 1, height: 6, background: "#1f2937", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${(m.count / m.max) * 100}%`, height: "100%",
                    background: "linear-gradient(90deg, #4f6ef7, #7c3aed)", borderRadius: 3
                  }} />
                </div>
                <span style={{ fontSize: 10, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace", width: 16, textAlign: "right" }}>{m.count}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 10, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1.5, marginBottom: 10 }}>TOP TAGS</div>
            {[
              { tag: "React", count: 8 }, { tag: "Java", count: 6 },
              { tag: "SQL", count: 4 }, { tag: "API", count: 4 },
              { tag: "Hooks", count: 3 },
            ].map(t => (
              <div key={t.tag} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: getTagColor(t.tag), fontFamily: "'JetBrains Mono', monospace" }}>{t.tag}</span>
                <span style={{
                  background: "#1f2937", color: "#9ca3af", fontSize: 10,
                  padding: "1px 6px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace"
                }}>{t.count}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 10, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1.5, marginBottom: 10 }}>BREAKDOWN</div>
            {[
              { label: "High", count: 2, color: "#ef4444" },
              { label: "Medium", count: 1, color: "#f59e0b" },
              { label: "Low", count: 1, color: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 11, color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{
              background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: 12,
              textAlign: "center"
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>🧠</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>
                Knowledge Score
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#4f6ef7", fontFamily: "'JetBrains Mono', monospace" }}>
                847
              </div>
              <div style={{ fontSize: 10, color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>
                +12 this week
              </div>
            </div>
          </div>
        </div>

        {/* Adjust main padding for right panel */}
        <style>{`
          main { padding-right: 220px !important; }
        `}</style>
      </div>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)}>
        <NewEntryForm onSave={saveEntry} onClose={() => setShowNew(false)} />
      </Modal>
    </>
  );
}
