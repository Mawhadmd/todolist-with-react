import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Form.css'
const Form = () => {
    const navigate = useNavigate();
    const [isSignupUp, setIsSignupUp] = useState(false); 
    const [signupStyle, setSignupStyle] = useState({});
    const [signinStyle, setSigninStyle] = useState({});
    const [signupFormStyle, setSignupFormStyle] = useState({});
    const [loginButtonText, setLoginButtonText] = useState("Login");
    const [signupButtonText, setSignupButtonText] = useState("SignUp");
    const [statusInfo, setStatusInfo] = useState("");
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        axios.post('/currentUser').then((res) => {
                    navigate('/');
            })
            .catch((e) => console.error(e));
    }, []);


    const slideUp = () => {
        setIsSignupUp(true);
        setSignupFormStyle({ top: '15%', borderRadius: '0' });
        setSignupStyle({ top: '0', padding: '10px', backgroundColor: 'green' });
        setSigninStyle({ backgroundColor: 'transparent' });
        setName('');
        setPassword('');
        setTimeout(() => {
            setSigninStyle({ top: '-45px', backgroundColor: 'transparent' });
        }, 250);
    };


    const slideDown = () => {
        setIsSignupUp(false);
        setSigninStyle({});
        setSignupStyle({});
        setSignupFormStyle({});
        setName('');
        setPassword('');
    };

    // Handle form submission for login or signup
    const handleForm = async (operation) => {
        const resetButton = () => {
            if (operation === 'signin') {
                setLoginButtonText('Login');
            } else {
                setSignupButtonText('SignUp');
            }
        };

        if (operation === 'signin') setLoginButtonText('Loading');
        if (operation === 'signup') setSignupButtonText('Loading');

        if (name && password) {
            try {
                const res = await axios.post('/suplin', { name, password, operation }, { withCredentials: true });
                const message = res.data.message || JSON.stringify(res.data);
                setStatusInfo(message);

                if (message === 'Welcome') navigate('/');
            } catch (e) {
                alert('Error: ' + e.message);
            } finally {
                resetButton();
            }
        } else {
            setStatusInfo('Name and Password Required');
            resetButton();
        }

        setName('');
        setPassword('');
    };

    return (
        <div className='formContainer'>
            
        <div className='wraper'>
            <div className='error'>
               <p> {statusInfo} </p>
            </div>
            <main className="Main signin">
                <form onSubmit={(e) => { e.preventDefault(); }}>
                    <h1
                        onClick={() => { isSignupUp ? slideDown() : handleForm('signin'); }}
                        style={signinStyle}
                    >
                        {loginButtonText}
                    </h1>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                    <input value={password} type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                </form>

                <div style={signupFormStyle} className="Main signup">
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <h1
                            onClick={() => { !isSignupUp ? slideUp() : handleForm('signup'); }}
                            style={signupStyle}
                            >
                            {signupButtonText}
                        </h1>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                        <input value={password} type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    </form>
                </div>
            </main>
            <div style={{padding: '10px' }}><Link style={{textDecoration: 'none', color: 'white', cursor:'pointer'}} to="/">Continue as a guest</Link></div>
        </div>
                            </div>
    );
};

export default Form;
