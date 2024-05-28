import React from 'react';
import { Link } from 'react-router-dom';
import './css/DiaryListSnippet.css';

const DiaryListSnippet = ({ diaries }) => {
    const truncate = (str) => {
        return str?.length < 50 ? str : str.substr(0, 49) + "...";
    };

    return (
        <div className='diary-container'>
            {diaries.map((diary) => (
                <div key={diary.id}>
                    <Link to={`/diary/${diary.id}`} state={{ propDiary: diary }}>
                        <div className='diary-item'>
                            <p className='item-title'>{diary.title}</p>
                            <div>
                                <p className='item-date'>{diary.created_at.split('T')[0]}</p>
                                <p className='item-content'>{truncate(diary.content)}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default DiaryListSnippet;
