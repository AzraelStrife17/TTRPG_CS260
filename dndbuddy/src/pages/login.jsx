import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        navigate('/dashboard');
    }

    return (
        <main>
            <div className="login_section">
                <h1>Welcome to D&D Buddy</h1>
                <form onSubmit={handleSubmit}>
                    <div className="email">
                        <span>@</span>
                        <input type="text" placeholder="your@email.com" />
                    </div>

                    <div className="password">
                        <span>🔒</span>
                        <input type="password" placeholder="password" />
                    </div>

                    <button type="submit">Login</button>
                    <button type="submit">Create</button>
                </form>
            </div>
        </main>
    );

}