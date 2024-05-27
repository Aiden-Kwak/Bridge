import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import './css/DiaryDetailForm.css';

function DiaryDetailForm(){

    const location=useLocation();
    const DiaryListProps=location.state;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [gpt_advise, setGpt_advise] = useState('');
    const [gpt_content, setGpt_content] = useState('');
    const [gpt_recommend, setGpt_recommend] = useState('');
    console.log(formatDate(DiaryListProps.propDiary.created_at));
    console.log(DiaryListProps.propDiary);

    useEffect(() => {
        setDate(formatDate(DiaryListProps.propDiary.created_at));
        setTitle(DiaryListProps.propDiary.title);
        setContent(DiaryListProps.propDiary.content);
        setGpt_advise(DiaryListProps.propDiary.gpt_advise);
        setGpt_content(DiaryListProps.propDiary.gpt_content);
        setGpt_recommend(DiaryListProps.propDiary.gpt_recommend);
    }, []);
    /*
    propDiary: content, created_at, gpt_advise, gpt_content, gpt_recommend, id, title, writer(pk)
    */
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
                            <div className='gpt-recommend'>{gpt_recommend}</div>
                            <div className='gpt-advise'>{gpt_advise}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiaryDetailForm;