import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm from '../snippets/SideNavbarForm';
import BackButtonSnippet from '../snippets/BackButtonSnippet';
import DiaryCreateLoadingForm from '../snippets/DiaryCreateLodingForm';
import './css/DiaryWriteForm.css';
import axios from 'axios';
import { getCookie } from '../utils';
import { URLManagement } from '../utils';
import SubmitIcon from '../assets/icon/check.svg';



function DiaryWriteForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [city, setCity] = useState(''); // 임시영역(지역)
    const [isLoading, setIsLoading] = useState(false);
    const maxLength = 1000;
    const navigate = useNavigate();
    const API_BASE_URL = URLManagement();


    const handleContentTextareaChange = (e) => {
        const newValue = e.target.value;
        if (newValue.length <= maxLength) {
            setContent(e.target.value);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('city', city);
        const user = localStorage.getItem('user');
        if (!user) {
            console.error('로그인이 필요합니다.');
            return;
        }

        try {
            const csrftoken = getCookie('csrftoken');
            const response = await axios.post(`${API_BASE_URL}/api/diary/create-diary`, {
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
                navigate(`/diary/${pk}`);
            } else {
                console.error('응답에서 일기 ID(pk)를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('일기 제출 중 오류가 발생했습니다:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getFormattedToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    return (
        <div className="diary-write-container">
            <TopNavbarForm />
            <div className="content-container">
                <SideNavbarForm />
                <div className="content">
                    {isLoading && <DiaryCreateLoadingForm />}
                    <div className="diary-write-form">
                        <p className='today-date'>{getFormattedToday()}</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                {/*<label htmlFor="title">제목</label>*/}
                                <input 
                                    type="text" 
                                    id="title" 
                                    name="title" 
                                    value={title}
                                    placeholder='제목을 입력하세요!'
                                    onChange={(e) => setTitle(e.target.value)}
                                    />
                            </div>
                            <div className="form-group">
                                {/*<label htmlFor="content">내용</label>*/}
                                <textarea 
                                    id="content" 
                                    name="content" 
                                    value={content}
                                    placeholder='오늘은 어떤 일이 있었나요?'
                                    onChange={handleContentTextareaChange}
                                    maxLength={maxLength}
                                ></textarea>
                            </div>
                            {/*
                            <div className="form-group">
                                <label htmlFor="city">임시영역(지역)</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    name="city" 
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>*/}
                            <div className='bottom-container'>
                                <BackButtonSnippet />
                                <div className="content-counter">
                                    {content.length}/{maxLength}
                                </div>
                                <button type="submit" className="submit-button">
                                    <img src={SubmitIcon} alt="Submit" className="submit-icon" />
                                </button>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiaryWriteForm;