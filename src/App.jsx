import { useMemo } from 'react';
import About from './components/About.jsx';
import Approach from './components/Approach.jsx';
import Contact from './components/Contact.jsx';
import Expertise from './components/Expertise.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import QaGame from './components/QaGame.jsx';
import Skills from './components/Skills.jsx';
import { SECTION_TO_NAV } from './data/site.js';
import { useActiveSection, useReveal, useTheme } from './hooks.js';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'approach', 'expertise', 'game', 'contact'];

export default function App() {
  const [theme, toggleTheme] = useTheme();
  useReveal();
  const ids = useMemo(() => SECTION_IDS, []);
  const current = useActiveSection(ids);
  const activeNavId = SECTION_TO_NAV[current] || current;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header activeId={activeNavId} theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Approach />
        <Expertise />
        <QaGame />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
