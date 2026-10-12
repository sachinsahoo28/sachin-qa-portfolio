import { useEffect, useState } from 'react';

/** Returns the id of the section currently under the upper part of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** Theme state. Server and first client render both use 'dark'; the saved choice is applied in an effect. */
export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* Storage can be blocked; the theme still changes for this visit. */
    }
  };

  return [theme, toggle];
}

const REVEAL_SELECTOR = '.section-title, .card';

/**
 * Fades section headings and project cards in as they scroll into view.
 * Fail-safe by design: the pre-rendered HTML is fully visible, and only elements that start below the
 * fold are hidden (data-reveal="pending") once JS is running. Nothing is hidden if IntersectionObserver is
 * missing or the user prefers reduced motion, and everything is shown again when printing.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const all = [...document.querySelectorAll(REVEAL_SELECTOR)];
    const targets = all.filter((el) => !el.dataset.reveal && el.getBoundingClientRect().top > window.innerHeight - 40);
    if (!targets.length) return undefined;

    const show = (el, delay = 0) => {
      el.style.animationDelay = delay ? `${delay}ms` : '';
      el.dataset.reveal = 'shown';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            show(entry.target, Math.min(i, 3) * 70); // small stagger for items entering together
            observer.unobserve(entry.target);
          });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    targets.forEach((el) => {
      el.dataset.reveal = 'pending';
      observer.observe(el);
    });

    const revealAll = () => {
      targets.forEach((el) => {
        if (el.dataset.reveal === 'pending') el.dataset.reveal = 'shown';
      });
    };
    window.addEventListener('beforeprint', revealAll);

    return () => {
      observer.disconnect();
      window.removeEventListener('beforeprint', revealAll);
      revealAll(); // never leave anything hidden if the effect is torn down (e.g. StrictMode remount)
    };
  }, []);
}
