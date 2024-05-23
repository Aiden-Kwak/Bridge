import React, { useState, useEffect } from 'react';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import './css/DiaryCalendarForm.css';


function DiaryCalendarForm() {
  const [currentDate, setCurrentDate] = useState(new Date());
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
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(
        <div key={day} className="calendar-day">
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
              <button onClick={previousMonth}>&lt;</button>
              <span>{getMonthName(currentDate)} {currentDate.getFullYear()}</span>
              <button onClick={nextMonth}>&gt;</button>
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
        </div> 
      </div>
    </div>
  );
}

export default DiaryCalendarForm;