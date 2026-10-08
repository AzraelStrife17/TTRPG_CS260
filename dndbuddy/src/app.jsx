import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import Dashboard from './pages/dashboard.jsx';
import CharacterSheet from './pages/charactersheet.jsx';
import About from './pages/about.jsx';
import Login from './pages/login.jsx';
import './app.css';

export default function App() {
  const { pathname } = useLocation();
  const showLoggedIn = [
    '/dashboard',
    '/charactersheet',
    '/about',
  ].includes(pathname);

  return (
    <div className="page">
      <header>
        <h1>
          D&D Buddy<sup>&reg;</sup>
        </h1>

        <nav>
          <menu>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
          </menu>
        </nav>

        {showLoggedIn && <p>Dr. Tofu Logged In</p>}
      </header>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/charactersheet" element={<CharacterSheet />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer>
        <hr />
        <div className="footer_content">
          <span className="text-reset">Adam Leishman</span>
          <a href="https://github.com/AzraelStrife17/TTRPG_CS260">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <main>
      <h2>Page not found</h2>
      <p>That D&amp;D Buddy page doesn’t exist.</p>
      <NavLink to="/">Return Home</NavLink>
    </main>
  );
}