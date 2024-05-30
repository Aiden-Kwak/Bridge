import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm from '../snippets/SideNavbarForm';
import DiaryListSnippet from '../snippets/DiaryListSnippet';
import './css/DiaryCalendarForm.css';
import previousIcon from '../assets/icon/calendarLeft.svg';
import nextIcon from '../assets/icon/calendarRight.svg';
import { URLManagement } from '../utils';

function DiaryCalendarForm() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaries, setDiaries] = useState([]);
  const [selectedDateDiaries, setSelectedDateDiaries] = useState([]);
  const API_BASE_URL = URLManagement();


  useEffect(() => {
    // 오늘 날짜의 일기를 자동으로 선택
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const filteredDiaries = diaries.filter(diary => diary.created_at.split('T')[0] === dateString);
    setSelectedDateDiaries(filteredDiaries);
  }, [diaries]);

  useEffect(() => {
    fetchMonthlyDiaries(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate]);

  const fetchMonthlyDiaries = async (year, month) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/diary/search-month/`, {
        params: { year, month },
        withCredentials: true,
      });
      setDiaries(response.data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    }
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const filteredDiaries = diaries.filter(diary => diary.created_at.split('T')[0] === dateString);
    setSelectedDateDiaries(filteredDiaries);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasDiary = diaries.some(diary => diary.created_at.split('T')[0] === dateString);
      
      calendarDays.push(
        <div key={day} className={`calendar-day ${hasDiary ? 'day-highlight' : ''}`} onClick={() => handleDayClick(day)}>
          {day}
        </div>
      );
    }
    return calendarDays;
  };

  return (
    <div className='diary-calendar-container'>
      <TopNavbarForm />
      <div className='content-container'>
        <SideNavbarForm />
        <div className='content'>
          <div className="calendar-container">
            <div className="calendar-header">
              <button onClick={previousMonth}><img src={previousIcon} alt="icon" /></button>
              <span>{getMonthName(currentDate)} {currentDate.getFullYear()}</span>
              <button onClick={nextMonth}><img src={nextIcon} alt="icon" /></button>
            </div>
            <div className="calendar-grid">
              <div className="calendar-day-name">Sun</div>
              <div className="calendar-day-name">Mon</div>
              <div className="calendar-day-name">Tue</div>
              <div className="calendar-day-name">Wed</div>
              <div className="calendar-day-name">Thu</div>
              <div className="calendar-day-name">Fri</div>
              <div className="calendar-day-name">Sat</div>
              {renderCalendar()}
            </div>
          </div>
          { selectedDateDiaries.length === 0 ? 
            <div className='no-diary-message'>해당 날짜에 작성된 일기가 없어요</div> : 
            <DiaryListSnippet diaries={selectedDateDiaries} />
          }
        </div>
      </div>
    </div>
  );
}

export default DiaryCalendarForm;
