import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import Dashboard from './dashboard/dashboard.jsx';
import CharacterSheet from './charactersheet/charactersheet.jsx';
import About from './about/about.jsx';
import Login from './login/login.jsx';
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
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
          </menu>
        </nav>

        {showLoggedIn && <p>Dr. Tofu Logged In</p>}
      </header>

      <Routes>
        <Route path="/Login" element={<Login />} />
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