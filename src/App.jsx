import { useState } from 'react';
import GeofenceDemo from './GeofenceDemo.jsx';
import SudokuGame from './SudokuGame.jsx';

const EMAIL = 'pesaravaimanohar.dev@gmail.com';
const GITHUB = 'https://github.com/pesaravaimanohar';

const links = [
  { label: 'AttendX', href: '#attendx' },
  { label: 'Projects', href: '#work' },
  { label: 'Skills', href: '#skills', optional: true },
  { label: 'About', href: '#about', optional: true },
  { label: 'Contact', href: '#contact' },
];

const attendxFacts = [
  { value: '6', detail: 'role dashboards, from student to principal' },
  { value: '17', detail: 'REST controllers in Spring Boot' },
  { value: '50 m', detail: 'default geofence radius per session' },
];

const attendxBuilt = [
  { title: 'Secure access:', detail: 'stateless JWT sign-in, with a central permission matrix for each role.' },
  { title: 'Sessions that match timetables:', detail: 'faculty run classes up to 3 hours long, and analytics weight them correctly.' },
  { title: 'Bulk data:', detail: 'Excel upload for students, faculty and past attendance, using Apache POI.' },
  { title: 'Early warnings:', detail: 'low-attendance alerts and at-risk views for class coordinators.' },
];

const attendxStack = ['Java 17', 'Spring Boot 3', 'Spring Security', 'JPA', 'MySQL', 'React 19', 'Vite', 'MUI', 'Recharts'];

const projects = [
  {
    title: 'FinanceFlow',
    tag: 'Live · sign up to try · AI-assisted build',
    image: '/projects/financeflow.jpg',
    width: 800,
    height: 500,
    alt: 'FinanceFlow sign-in screen with its list of features',
    url: 'https://finance-flow-sand-eight.vercel.app',
    urlLabel: 'Live app',
    code: `${GITHUB}/FinanceFlow`,
    detail: 'A personal finance tracker with pages for transactions, budgets, EMIs and analytics. Each user’s data is protected by Postgres row-level security policies, and people can sign in with Google.',
    stack: ['React 19', 'Supabase', 'PostgreSQL', 'Tailwind', 'Recharts'],
  },
  {
    title: 'Names Sudoku',
    tag: 'Live · no sign-in · made for friends',
    image: '/projects/sudoku.jpg',
    width: 799,
    height: 456,
    alt: 'Names Sudoku game board with friends’ names in place of numbers',
    url: '/games/sudoku',
    urlLabel: 'Play it',
    code: `${GITHUB}/pesaravai-manohar-portfolio`,
    detail: 'A 6×6 Sudoku that uses six friends’ names as its symbols. Every board has one solution. Each link carries a seed, so a shared link opens the same puzzle, served by a small API or generated in the browser if the API is down.',
    stack: ['React', 'Vercel Functions', 'Seeded generation'],
  },
];

const smallerBuilds = [
  { title: 'College ID Card Generator', detail: 'Fill in one student’s card with a live preview, or generate a batch from an Excel sheet with photos and signatures.', url: 'https://id-card-generation-seven.vercel.app', label: 'Live tool' },
  { title: 'Todo app', detail: 'Full-stack CRUD with Spring Boot, JPA and PostgreSQL, on Java 21, with a Dockerfile.', url: `${GITHUB}/todo_app`, label: 'Code' },
  { title: 'Banking console app', detail: 'Core Java practice in encapsulation, validation and exception handling.', url: `${GITHUB}/Banking_Application`, label: 'Code' },
  { title: 'DSA practice', detail: 'Java solutions to array and string problems.', url: `${GITHUB}/DSA`, label: 'Code' },
];

const skills = [
  { area: 'Backend', tools: 'Java, Spring Boot, Spring Security, JWT, Spring Data JPA', usedIn: 'AttendX, Todo app' },
  { area: 'Frontend', tools: 'React, JavaScript, HTML, CSS, Vite, MUI, Tailwind', usedIn: 'AttendX, FinanceFlow, Names Sudoku' },
  { area: 'Databases', tools: 'MySQL, PostgreSQL, Supabase, row-level security', usedIn: 'AttendX, FinanceFlow, Todo app' },
  { area: 'Delivery', tools: 'Git, GitHub, Vercel, Docker, serverless functions', usedIn: 'All live projects, Todo app' },
  { area: 'Foundations', tools: 'OOP, data structures, REST API design', usedIn: 'Banking app, DSA practice, AttendX' },
];

function Stack({ items }) {
  return <ul className="stack" aria-label="Tech stack">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

function Header() {
  return (
    <header>
      <div className="wrap bar">
        <a className="logo" href="#top" aria-label="Manohar Pesaravai, back to top">MP<span>.</span></a>
        <nav aria-label="Main">
          {links.map(link => <a key={link.href} className={link.optional ? 'opt' : undefined} href={link.href}>{link.label}</a>)}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="status"><i aria-hidden="true" />Open to developer roles</p>
            <h1>Manohar Pesaravai<span>.</span></h1>
            <p className="role">Full-stack developer. Java, Spring Boot and React.</p>
            <p className="intro">I build complete web apps, from the database to the interface. My largest is AttendX, a QR and GPS attendance system with dashboards for six campus roles.</p>
            <div className="actions">
              <a className="btn primary" href="#attendx">See how AttendX works</a>
              <a className="btn" href={GITHUB}>GitHub</a>
              {/* Add when ready:
              <a className="btn" href="/resume.pdf">Resume (PDF)</a>
              <a className="btn" href="https://www.linkedin.com/in/YOUR-HANDLE">LinkedIn</a>
              */}
            </div>
          </div>
          <div className="photo-box">
            <img className="photo" src="/manohar-pesaravai.jpg" width="900" height="1125" alt="Manohar Pesaravai in a dark suit jacket and white shirt, smiling" />
          </div>
        </div>
        <dl className="glance">
          <div><dt>Looking for</dt><dd>Full-stack or web developer roles, and freelance sites</dd></div>
          <div><dt>Main stack</dt><dd>Java, Spring Boot, React, MySQL</dd></div>
          <div><dt>Based in</dt><dd>Bengaluru, Karnataka, India</dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
        </dl>
      </div>
    </div>
  );
}

function AttendX() {
  return (
    <section id="attendx">
      <div className="wrap">
        <p className="label">Featured project · Final-year build</p>
        <h2>AttendX: attendance that checks you’re in the room.</h2>
        <div className="split">
          <div>
            <p className="lede">Roll calls waste class time and a shared QR photo is easy to abuse. In AttendX, a student scans a code the faculty member can refresh, and the server checks that the student is physically in the room before the mark counts.</p>
            <dl className="facts">
              {attendxFacts.map(fact => <div key={fact.value}><dt>{fact.value}</dt><dd>{fact.detail}</dd></div>)}
            </dl>
            <ul className="built">
              {attendxBuilt.map(item => <li key={item.title}><strong>{item.title}</strong> {item.detail}</li>)}
            </ul>
            <Stack items={attendxStack} />
            <div className="links">
              <a href="https://smart-campus-attendance-management.vercel.app">Open the live app</a>
              <a href={`${GITHUB}/Smart_Campus_Attendance_Management`}>Read the code</a>
            </div>
            <p className="tiny login-note">The live app needs a sign-in. <a href="#contact">Email me</a> for a demo login or a walkthrough.</p>
          </div>
          <GeofenceDemo />
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="rule">
      <div className="wrap">
        <h2>More things I’ve built</h2>
        <div className="work">
          {projects.map(project => (
            <article key={project.title}>
              <a href={project.url}><img className="shot" src={project.image} width={project.width} height={project.height} loading="lazy" alt={project.alt} /></a>
              <p className="tag">{project.tag}</p>
              <h3>{project.title}</h3>
              <p>{project.detail}</p>
              <Stack items={project.stack} />
              <div className="links"><a href={project.url}>{project.urlLabel}</a><a href={project.code}>Code</a></div>
            </article>
          ))}
        </div>
        <div className="more">
          <h3>Smaller builds</h3>
          <ul className="rows">
            {smallerBuilds.map(build => <li key={build.title}><b>{build.title}</b><p>{build.detail}</p><a href={build.url}>{build.label}</a></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="rule">
      <div className="wrap">
        <h2>Skills, and where to check them</h2>
        <div className="table">
          <table>
            <thead><tr><th scope="col">Area</th><th scope="col">Tools</th><th scope="col">Used in</th></tr></thead>
            <tbody>
              {skills.map(skill => <tr key={skill.area}><td>{skill.area}</td><td>{skill.tools}</td><td>{skill.usedIn}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="rule">
      <div className="wrap about">
        <h2>About me</h2>
        <div>
          <p className="lede">I’m an early-career developer in Bengaluru, and I’ve been putting Java code on GitHub since 2023.</p>
          <p>I like building for a problem I can see in front of me. That has meant attendance for JNTUA, a tracker for personal finances, an ID card tool for a college, and a puzzle for six friends.</p>
          <p>I’m looking for a team where I can work across the backend and the interface, and learn from people who ship software every day.</p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copyLabel, setCopyLabel] = useState('Copy email');

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyLabel('Copied');
      setTimeout(() => setCopyLabel('Copy email'), 1800);
    } catch {
      setCopyLabel('Copy failed, select the address');
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <h2>Hiring, or need a website built?</h2>
        <p>Email me about the role or project. I can also walk you through any of this code.</p>
        <div className="mail">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <button className="btn" type="button" onClick={copyEmail}>{copyLabel}</button>
        </div>
        <dl>
          <div><dt>Code</dt><dd><a href={GITHUB}>github.com/pesaravaimanohar</a></dd></div>
          <div><dt>Location</dt><dd>Bengaluru, Karnataka, India</dd></div>
          <div><dt>Open to</dt><dd>Developer roles and freelance websites</dd></div>
        </dl>
      </div>
    </section>
  );
}

function PortfolioApp() {
  return (
    <div className="site">
      <a className="skip" href="#attendx">Skip to projects</a>
      <Header />
      <main id="top"><Hero /><AttendX /><Work /><Skills /><About /><Contact /></main>
      <footer><div className="wrap"><span>Manohar Pesaravai</span><a href="#top">Back to top</a></div></footer>
    </div>
  );
}

export default function App() {
  return window.location.pathname.replace(/\/$/, '') === '/games/sudoku' ? <SudokuGame /> : <PortfolioApp />;
}
