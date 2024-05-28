import React, {useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import DiaryListSnippet from '../snippets/DiaryListSnippet';
import { getCookie } from '../utils';
import './css/DiaryListForm.css';
import {useParams} from 'react-router-dom';
import searchIcon from '../assets/icon/searchBar.svg'


function DiaryListForm() {
    const [diaries, setDiary] = useState([]);
    const [search, setSearch] = useState('');
    const truncate = (str) => {
        return str?.length < 50 ? str : str.substr(0, 49) + "...";
    };
    useEffect(() => {
        handleInputChange();
    }, [search]);

    useEffect(() => {
        getList();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }
    
    const handleInputChange = (e) => {
        const csrftoken = getCookie('csrftoken');
        axios.get(`http://localhost:8000/api/diary/search-title/${search}/`,{
            withCredentials: true,
            headers:{
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            }
        })
        .then(response=>{
            if (search.length<=1){
                getList();
            }else{                
                setDiary(response.data);
            }
        })
        .catch(error => {
            getList();
        })
    } 

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
        }catch(error) {
            console.error('Error fetching the list:',error);
        }
    };

    return (
        <div className='diary-list-container'>
            <TopNavbarForm />
            <div className='content-container'>
                <SideNavbarForm />
                <div className='content'>
                    <div className="search-bar">
                        <img className='search-icon'src={searchIcon} alt="icon"/>
                        <input 
                                type="text" 
                                value={search} 
                                onChange={handleSearchChange} 
                                placeholder="제목으로 검색해보세요!" 
                        />
                    </div>
                    <DiaryListSnippet diaries={diaries} />
                </div>
            </div>
        </div>
    );
}

export default DiaryListForm;