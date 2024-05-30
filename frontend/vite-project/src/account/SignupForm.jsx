import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../utils';
import { URLManagement } from '../utils';
import './css/SignupForm.css';
import { Link, useNavigate } from 'react-router-dom';

function SignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [tempMessage, setTempMessage] = useState('');

    const API_BASE_URL = URLManagement();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const csrfToken=getCookie('csrftoken');
        try {
            setTempMessage("인증메일을 전송중입니다. 잠시만 기다려주세요");
            const response = await axios.post(`${API_BASE_URL}/api/account/signup/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                }
            });
            setTempMessage("인증메일이 전송되었습니다. 도착하지 않은 경우 스팸메일함을 확인해주세요"); // 메시지 설정
            setTimeout(() => {
                setTempMessage(''); // 2초 후 메시지 제거
            }, 10000);
            // 회원가입 성공 처리 로직
        } catch (error) {
            if (error.response && error.response.data) {
                // 서버로부터의 응답에 따라 오류 메시지 설정
                let error_msg = error.response.data;
                if (error_msg.username) {
                    setError(error_msg.username);
                } else if (error_msg.email) {
                    setError(error_msg.email);
                } else if (error_msg.password) {
                    setError(error_msg.password);
                } else {
                    setError('회원가입 실패. 다시 시도해주세요.');
                }
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
        <div className="signup-container">
            <div className='logo'>
                <p>Bridge</p>
            </div>
            {tempMessage && <div className='error'>{tempMessage}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    className="signup-input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="아이디"
                />
                <input
                    className="signup-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일"
                />
                <input
                    className="signup-input"
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호"
                />
                <button className="signup-button" type="submit">회원가입</button>
                <Link to="/login" className='login-link'>
                <p className='signup-notice'>메일전송에는 최대 3분이 소요될 수 있습니다.<span style={{color:"rgb(85, 26, 139)", marginLeft:"1rem"}}>로그인</span></p>
                </Link>
            </form> 
        </div>
    );
  
}
export default SignupForm;