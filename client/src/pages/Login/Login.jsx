import React from 'react'
import './Login.css';

// Gotten from https://www.youtube.com/watch?v=kghwFYOJiNg
const Login = () => {
    return (
        <div className='wrapper'>
            <h1>Login</h1>
            <div className="input-box">
                <input type="text" placeholder='Username' required />
            </div>
            <div className="input-box">
                <input type="password" placeholder='Password' required />
            </div>
            <button type="submit">Login</button>
            <div className="register">
                <p>Don't have an account? <a href="#">Register</a></p>
            </div>
        </div>
    )
}

export default Login;