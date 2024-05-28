import React from 'react';
import { Link } from 'react-router-dom';
import './css/DiaryListSnippet.css';

const DiaryListSnippet = ({ diaries }) => {
    const truncate = (str) => {
        return str?.length < 70 ? str : str.substr(0, 69) + "...";
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    };

    return (
        <div className='diary-container'>
            {diaries.map((diary) => (
                <div key={diary.id}>
                    <Link to={`/diary/${diary.id}`} state={{ propDiary: diary }}>
                        {/*
                        <div className='diary-item'>
                            <p className='item-title'>{diary.title}</p>
                            <div>
                                <p className='item-date'>{diary.created_at.split('T')[0]}</p>
                                <p className='item-content'>{truncate(diary.content)}</p>
                            </div>
                        </div>
                        */}
                        <div className='diary-item'>
                            <div className='item-top-thread'>
                                <p className='item-title'>{diary.title}</p>
                                <p className='item-date'>{formatDate(diary.created_at)}</p>
                            </div>
                            <div className='item-content'>
                                <p>{truncate(diary.content)}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default DiaryListSnippet;
