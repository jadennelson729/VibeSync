import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:8888/vibeAuth/login' : 'http://localhost:8888/vibeAuth/register';
        try {
            await axios.post(url, { username, password });
            if (isLogin) {
                document.cookie = `username=${username}; path=/`; // Store username in cookies
                window.location.href = 'http://localhost:8888'; // Redirect to Spotify login page
            } else {
                alert('User registered successfully');
            }
        } catch (error) {
            alert('Error: ' + error.response.data);
        }
    };

    return (
        <div className='wrapper'>
            <h1>{isLogin ? 'Login' : 'Signup'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
            </form>
            <div className="register">
                <p>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;