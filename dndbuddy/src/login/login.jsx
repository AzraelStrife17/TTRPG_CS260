import { useNavigate } from 'react-router-dom';
import {useState} from 'react';

export default function Login({onLogin}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        setError('');

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password){
            setError('Enter an email and password');
            return;
        }
        
        if (!onLogin(normalizedEmail)){
            setError('Could not save the mock login. Please try again');
            return;
        }

        navigate('/dashboard');
    }

    return (
        <main>
            <div className="login_section">
                <h1>Welcome to D&D Buddy</h1>
                <form onSubmit={handleSubmit}>
                    <div className="email">
                        <span>@</span>
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            value={email}
                            required
                            onChange={(event) => setEmail(event.target.value)}    
                        />
                    </div>

                    <div className="password">
                        <span>🔒</span>
                        <input 
                            type="password" 
                            placeholder="password" 
                            value={password}
                            required
                            onChange={(event) => setPassword(event.target.value)}    
                        />
                    </div>

                    <button type="submit">Login</button>
                    <button type="submit">Create</button>
                </form>
            </div>
        </main>
    );

}