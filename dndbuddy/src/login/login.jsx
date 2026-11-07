import { useNavigate } from 'react-router-dom';
import {useState} from 'react';

export default function Login({onLogin}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password){
            setError('Enter an email and password');
            return;
        }
        
        const action = event.nativeEvent.submitter.value;

        try{
            const response = await fetch(`/api/auth/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                    password,
                }),
            });

            const result = await response.json();

            if (!response.ok){
                setError(result.msg || 'Could not log in. Please try again.');
                return;
            }

            if (!onLogin(result.email)){
                setError('Logged in, but could not save local session.');
                return;
            }

            navigate('/dashboard');
        }
        catch (error){
            console.error('Authentication failed:', error);
            setError('Could not reach service try again')
        }
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

                    <button type="submit" value="login">Login</button>
                    <button type="submit" value="create">Create</button>
                    {error && <p role="alert">{error}</p>}
                </form>
            </div>
        </main>
    );

}