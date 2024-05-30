import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import './css/DiaryDetailForm.css';
import axios from 'axios';
import { getCookie } from '../utils';

function DiaryDetailForm() {
    const location = useLocation();
    const DiaryListProps = location.state;
    const { id } = useParams();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [gpt_advise, setGpt_advise] = useState('');
    const [gpt_content, setGpt_content] = useState('');
    const [gpt_recommend, setGpt_recommend] = useState('');

    useEffect(() => {
        if (!DiaryListProps?.propDiary) {
            getDetail();
        } else {
            const { propDiary } = DiaryListProps;
            setDate(formatDate(propDiary.created_at));
            setTitle(propDiary.title);
            setContent(propDiary.content);
            setGpt_advise(propDiary.gpt_advise);
            setGpt_content(propDiary.gpt_content);
            setGpt_recommend(propDiary.gpt_recommend);
        }
    }, [DiaryListProps]);

    const getDetail = async () => {
        const csrftoken = getCookie('csrftoken');
        try {
            const response = await axios.get(`http://localhost:8000/api/diary/user-diary/${id}`, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                }
            });
            const diary = response.data;
            setDate(formatDate(diary.created_at));
            setTitle(diary.title);
            setContent(diary.content);
            setGpt_advise(diary.gpt_advise);
            setGpt_content(diary.gpt_content);
            setGpt_recommend(diary.gpt_recommend);
        } catch (error) {
            console.error('Error fetching the diary:', error);
        }
    };

    return (
        <div className="diary-detail-container">
            <TopNavbarForm />
            <div className='content-container'>
                <SideNavbarForm />
                <div className='content'>
                    <div className="diary-container">
                        <p className='diary-date'>{date}</p>
                        <p className='diary-title'>{title}</p>
                        <div className='content-boxes'>
                            <div className='original-content'>{content}</div>
                            <div className='gpt-content'>
                                <p className='notice'>이렇게 생각해봐요!</p>
                                <p>{gpt_content}</p>
                            </div>
                        </div>
                        <div className='gpt-services'>
                            <div className='gpt-recommend'>
                                <span className='highlight'>내일은 이런 일을 해보면 어때요?</span>
                                <p>{gpt_recommend}</p>
                            </div>
                            <div className='gpt-advise'>
                                <span className='highlight'>당신에게 공감해요</span>
                                <p>{gpt_advise}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiaryDetailForm;
