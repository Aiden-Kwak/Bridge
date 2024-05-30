import React, { useState, useEffect } from 'react';
import './css/DiaryCreateLoadingForm.css';

function DiaryCreateLoadingForm() {
    const [message, setMessage] = useState("Bridge가 일기를 생성하고 있어요!");

    useEffect(() => {
        const firstTimeout = setTimeout(() => {
            setMessage("Bridge가 내일 할일을 추천중이에요");
        }, 3000);

        const secondTimeout = setTimeout(() => {
            setMessage("거의 다 됐어요!");
        }, 8000);

        return () => {
            clearTimeout(firstTimeout);
            clearTimeout(secondTimeout);
        };
    }, []);

    return <div className='loading-snippet'>{message}</div>;
}

export default DiaryCreateLoadingForm;
