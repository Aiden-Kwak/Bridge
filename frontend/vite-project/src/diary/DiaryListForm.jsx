import React, {useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import { getCookie } from '../utils';
import './css/DiaryListForm.css';
import {useParams} from 'react-router-dom';

function DiaryListForm() {
    const [diaries, setDiary] = useState([]);
    const [search, setSearch] = useState('');

    const truncate = (str) => {
        return str?.length < 50 ? str : str.substr(0, 49) + "...";
    };
    
    const handleInputChange = (e) => {
        const csrftoken = getCookie('csrftoken');
        setSearch(e.target.value);
        axios.get(`http://localhost:8000/api/diary/search-title/${search}/`,{
            withCredentials: true,
            headers:{
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            }
        })
            .then(response=>{
                console.log(response.length);
                if (response.length==0){
                    getList();
                }else{                
                    setDiary(response.data);
                }
            })
            .catch(error => {
                getList();
            })
    } 

/*
    const searchTitle = async () => {
        try{
            const response = await axios.get(`http://localhost:8000/api/diary/search-title/${search}`);
            setDiary(response.data);
        } catch (error){
            setDiary("");
        }
    }
   },[search]);
}
*/
    

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
        console.log(response.data)
    } catch(error) {
        console.error('Error fetching the list:',error);
        }
    };
    useEffect(() => {
        getList();
    }, []);
    
    console.log('test:', diaries)
    return (
        <div className='diary-list-container'>
            <TopNavbarForm />
            <div className='content-container'>
                <SideNavbarForm />
                <div className='content'>
                    <input 
                        type="text" 
                        value={search} 
                        onChange={handleInputChange} 
                        placeholder="일기제목을 입력하세요" 
                    />
                    <div className='diary-container'>
                        {diaries.map((diary) => (
                            <div key={diary.id}>
                                <Link to={`/diary/${diary.id}`}>
                                    <div className='diary-item'>
                                        <p>{diary.created_at.split('T')[0]}</p>
                                        <div>
                                            <p>{diary.title}</p>
                                            <p>{truncate(diary.content)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );


}

export default DiaryListForm;