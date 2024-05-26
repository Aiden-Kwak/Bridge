import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm from '../snippets/SideNavbarForm';
import './css/DiaryWriteForm.css';
import axios from 'axios';
import { getCookie } from '../utils';



function DiaryWriteForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [city, setCity] = useState(''); // 임시영역(지역) 추가
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('city', city);
        const user = localStorage.getItem('user');
        if (!user) {
            console.error('로그인이 필요합니다.');
            return;
        }
        console.log('token2 sibal:', getCookie('testcookie'));

        try {
            const csrftoken = getCookie('csrftoken');
            console.log('csrftoken:', csrftoken);
            const response = await axios.post('http://localhost:8000/api/diary/create-diary', {
                title,
                content,
                city
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });
            const pk = response.data.id;
            if (pk) {
                navigate(`/user-diary/${pk}`);
            } else {
                console.error('응답에서 일기 ID(pk)를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('일기 제출 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <div className="diary-write-container">
            <TopNavbarForm />
            <div className="content-container">
                <SideNavbarForm />
                <div className="content">
                    <div className="diary-write-form">
                        <h1>일기 쓰기 CSS ㅅㅂ</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">제목</label>
                                <input 
                                    type="text" 
                                    id="title" 
                                    name="title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">내용</label>
                                <textarea 
                                    id="content" 
                                    name="content" 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">임시영역(지역)</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    name="city" 
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <button type="submit">저장</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiaryWriteForm;