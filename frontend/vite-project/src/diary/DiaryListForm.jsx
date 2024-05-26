import React, {useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCookie } from '../utils';

function DiaryListForm() {
    const [diaries, setDiary] = useState([]);

    const getList =  async () => {
        const csrftoken = getCookie('csrftoken');
        try{
        const response = await axios.get('http://localhost:8000/api/diary/list',{
            withCredentials: true,
            headers:{
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            }
        });
        setDiary(response.data);
    } catch(error) {
        console.error('Error fetching the list:',error);
        }
    };
    useEffect(() => {
        getList();
    }, []);
    
    console.log('test:', diaries)
    return (
        <div>
            <h1>일기 목록</h1>
            <div>
                {diaries.map((diary) => (
                    <div key={diary.id}>
                        <Link to={`/diary/${diary.id}`}>
                            <div>
                                <p>{diary.created_at.split('T')[0]}</p>
                                <p>{diary.title}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );

}


export default DiaryListForm;