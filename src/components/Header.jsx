import { useEffect, useRef, useState } from 'react';
import { FileDown, Menu, Moon, Sun, X } from 'lucide-react';
import { NAV_ITEMS, site } from '../data/site.js';

export default function Header({ activeId, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#home" onClick={() => setOpen(false)}>
          <svg className="brand-mark" width="26" height="26" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <rect x="4" y="4" width="56" height="56" rx="12" fill="none" stroke="currentColor" strokeWidth="5" />
            <path d="M18 33l9 9 19-21" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{site.brand}</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="icon-btn menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <nav id="site-nav" className={open ? 'nav is-open' : 'nav'} aria-label="Primary">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  className="nav-link"
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {site.resumeUrl && (
            <a className="btn btn-small btn-ghost" href={site.resumeUrl} download>
              <FileDown size={18} aria-hidden="true" />
              <span>Download Resume</span>
            </a>
          )}
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
          >
            {theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
