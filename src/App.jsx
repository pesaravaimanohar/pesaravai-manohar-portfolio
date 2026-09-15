import { useEffect, useState } from 'react';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const skills = [
  { number: '01', title: 'Frontend development', detail: 'React, HTML, CSS, and JavaScript for fast, usable interfaces.' },
  { number: '02', title: 'Responsive design', detail: 'Layouts that stay clear, balanced, and intuitive on every screen.' },
  { number: '03', title: 'Interaction detail', detail: 'Purposeful motion and visual feedback that support the content.' },
  { number: '04', title: 'Website delivery', detail: 'From a clear brief to a polished, ready-to-share website.' },
];

function GlowRule({ className = '' }) {
  return <div className={`glow-rule ${className}`} aria-hidden="true"><span /></div>;
}

function SectionTop({ number, label, note }) {
  return (
    <div className="section-top">
      <span className="section-kicker">{number} / {label}</span>
      <span className="section-note">{note}</span>
      <GlowRule className="section-top-rule" />
    </div>
  );
}

function Header({ active, menuOpen, setMenuOpen }) {
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <header className="header">
        <a className="brand" href="#about" aria-label="Pesaravai Manohar, home" onClick={closeMenu}>
          <span className="brand-symbol">PM<span>.</span></span>
          <span className="brand-name">Pesaravai Manohar</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          {links.map(link => <a key={link.href} className={active === link.href.slice(1) ? 'active' : ''} href={link.href}>{link.label}</a>)}
        </nav>
        <a className="header-contact" href="mailto:pesaravaimanohar.dev@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="mobile-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
      </header>
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobile-menu" aria-label="Mobile navigation" inert={!menuOpen}>
        {links.map(link => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}<span aria-hidden="true">↗</span></a>)}
        <a className="mobile-email" href="mailto:pesaravaimanohar.dev@gmail.com" onClick={closeMenu}>Let’s talk <span aria-hidden="true">↗</span></a>
      </nav>
    </>
  );
}

function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="about-glow" aria-hidden="true" />
      <div className="about-grid" aria-hidden="true" />
      <div className="about-content">
        <p className="eyebrow"><span className="eyebrow-line" /> Web developer · Bengaluru</p>
        <h1 id="about-title">Pesaravai<br /><em>Manohar<span>.</span></em></h1>
        <div className="about-bottom">
          <p>I build clean, responsive websites with a strong eye for detail. Open to web development roles and freelance projects.</p>
          <a className="primary-link" href="#projects">Explore projects <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="about-aside" aria-hidden="true"><span>Design</span><span>Development</span><span>Direction</span></div>
      <div className="about-detail" aria-hidden="true"><span>Available for new opportunities</span><span className="detail-line" /><span>{new Date().getFullYear()}</span></div>
      <GlowRule className="section-boundary" />
    </section>
  );
}

function Skills() {
  return (
    <section className="skills section" id="skills" aria-labelledby="skills-title">
      <SectionTop number="01" label="Skills" note="The foundation of my work" />
      <div className="skills-layout">
        <div className="section-intro reveal">
          <h2 id="skills-title">Built with clarity.<br /><span>Made to work.</span></h2>
          <p>My focus is on accessible, responsive web experiences that look sharp and feel effortless to use.</p>
        </div>
        <div className="skills-list">
          {skills.map(skill => (
            <div className="skill-item reveal" key={skill.number}>
              <span className="skill-no">{skill.number}</span>
              <div><h3>{skill.title}</h3><p>{skill.detail}</p></div>
              <span className="skill-icon" aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </div>
      <GlowRule className="section-boundary" />
    </section>
  );
}

function Projects() {
  return (
    <section className="projects section" id="projects" aria-labelledby="projects-title">
      <SectionTop number="02" label="Projects" note="Selected work" />
      <div className="projects-heading reveal">
        <h2 id="projects-title">Work that speaks<br /><span>for itself.</span></h2>
        <p>I’m at the beginning of my professional journey. This portfolio is my first showcased build, with more projects to follow.</p>
      </div>
      <article className="project reveal">
        <a className="project-preview" href="#about" aria-label="View the Pesaravai Manohar portfolio website">
          <div className="preview-top"><span>PM.</span><span>Web Developer</span></div>
          <div className="preview-center"><span>Pesaravai</span><strong>Manohar.</strong></div>
          <div className="preview-bottom"><span>01 / About</span><span>02 / Skills</span><span>03 / Projects</span></div>
          <span className="preview-corner" aria-hidden="true">↗</span>
        </a>
        <div className="project-info">
          <div><span className="project-category">Personal project · {new Date().getFullYear()}</span><h3>Personal portfolio</h3><p>This website: a responsive React portfolio with custom motion, accessible navigation, and a direct contact path.</p></div>
          <a href="#about" aria-label="View personal portfolio">View project <span aria-hidden="true">↗</span></a>
        </div>
      </article>
      <p className="more-projects">Additional project case studies will be added as they’re completed.</p>
      <GlowRule className="section-boundary" />
    </section>
  );
}

function Contact() {
  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <SectionTop number="03" label="Contact" note="The next step starts here" />
      <div className="contact-layout reveal">
        <div>
          <h2 id="contact-title">Let’s make<br /><span>something good.</span></h2>
          <p>Hiring for a web development role or planning a website? I’d be glad to hear about it.</p>
          <a className="email-button" href="mailto:pesaravaimanohar.dev@gmail.com?subject=Hello%20Pesaravai%20Manohar">Email me <span aria-hidden="true">↗</span></a>
        </div>
        <div className="contact-details">
          <div><span>Email</span><a href="mailto:pesaravaimanohar.dev@gmail.com">pesaravaimanohar.dev@gmail.com</a></div>
          <div><span>Location</span><strong>Bengaluru, Karnataka, India</strong></div>
          <div><span>Open to</span><strong>Web development roles<br />Freelance website projects</strong></div>
        </div>
      </div>
      <GlowRule className="section-boundary" />
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('about');

  useEffect(() => {
    const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window)) return;

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    if (motionAllowed) document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));
    else document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
    return () => { revealObserver.disconnect(); sectionObserver.disconnect(); };
  }, []);

  useEffect(() => {
    const onEscape = event => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">Skip to content</a>
      <Header active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main><About /><Skills /><Projects /><Contact /></main>
      <footer className="footer"><a href="#about">PM<span>.</span></a><p>© {new Date().getFullYear()} Pesaravai Manohar</p><a href="#about">Back to top ↑</a></footer>
    </>
  );
}

