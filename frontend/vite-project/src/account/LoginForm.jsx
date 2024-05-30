import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import {getCookie, removeCookie} from '../utils';
import calanderRight from '../assets/icon/calendarRight.svg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { URLManagement } from '../utils';
import './css/LoginForm.css';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const { user } = useContext(UserContext);
    const [tempMessage, setTempMessage] = useState('');
    const API_BASE_URL = URLManagement();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);
/*
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);
*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const csrfToken=getCookie('csrftoken');
        console.log('csrfToken:', csrfToken);
        axios.defaults.withCredentials = true;
        try {
            const response = await axios.post(`${API_BASE_URL}/api/account/login/`, {
                username,
                password
            }, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            });
            localStorage.setItem('user', JSON.stringify({ username: username }));
            setUser({ username: username });
            navigate('/calendar');
        } catch (error) {
            if (error.response && error.response.data) {
                // 서버로부터의 응답에 따라 오류 메시지 설정
                setError(error.response.data.error || '로그인 실패. 다시 시도해주세요.');
            } else {
                setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const showTempMessage = (error) => {
        setTempMessage(error); // 메시지 설정
        setTimeout(() => {
            setTempMessage(''); // 2초 후 메시지 제거
        }, 1500);
    };

    useEffect(() => {
        if (error) {
            showTempMessage(error);
        }
    }, [error]);

    return (
        <div className='login-container'>
            <div className='logo'>
                <p>Bridge</p>
            </div>
            {tempMessage && <div className='error'>{tempMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className='input-username'>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디"
                    />
                </div>
                <div className='input-password'>
                    <input
                        type="text"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                    />
                </div>
                
                <button type="submit">로그인</button>
            </form>
            <Link to="/signup" className='signup-link'>
                <p className='login-notice'>Bridge에 처음이신가요? <span style={{color:"rgb(85, 26, 139)", marginLeft:"1rem"}}>회원가입</span></p>
            </Link>
        </div>    
    );
}

export default LoginForm;