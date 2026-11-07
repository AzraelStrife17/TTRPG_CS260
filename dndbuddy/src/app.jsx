import Dashboard from './dashboard/dashboard.jsx';
import CharacterSheet from './charactersheet/charactersheet.jsx';
import About from './about/about.jsx';
import Login from './login/login.jsx';
import './app.css';
import {useState} from 'react';
import {NavLink, Route, Routes, useLocation, useNavigate} from 'react-router-dom';

function loadMockUser() {
  try {
    const savedUser = window.localStorage.getItem('dndbuddy.user');
    return savedUser ? JSON.parse(savedUser): null;
  }
  catch (error) {
    console.error('Could not load mock user session', error);
    return null;
  }
}

export default function App() {
  const { pathname } = useLocation();
  const showLoggedIn =
    pathname === '/dashboard' ||
    pathname.startsWith('/charactersheet/') ||
    pathname === '/about';

  const [user, setUser] = useState(loadMockUser);

  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState('');

  function handleLogin(email) {
    const mockUser = {email};
    try{
      window.localStorage.setItem('dndbuddy.user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }
    catch (error) {
      console.error('Could not save mock user session', error);
      return false;
    }
  }

  async function handleLogout(event){
    event.preventDefault();
    setLogoutError('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'Delete',
      });

      if (!response.ok){
        setLogoutError('Could not logout in. Please try again.');
        return;
      }
      window.localStorage.removeItem('dndbuddy.user');
      setUser(null);
      navigate('/login');
    }
    catch (error){
      console.error('Could not clear the mock user session', error);
      setLogoutError('Could not log out. Please try again.');
    }
  }

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
            {user && (
              <li><NavLink to="/login" onClick={handleLogout}>Log out</NavLink></li>
            )}
          </menu>
        </nav>
        {logoutError && <p role="alert">{logoutError}</p>}

        {showLoggedIn && user && <p>{user.email} logged in</p>}
      </header>

      <Routes>
        <Route path='/' element={<Login onLogin={handleLogin}/>} />
        <Route path="/login" element={<Login onLogin={handleLogin}/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/charactersheet/:characterId" element={<CharacterSheet />} />
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