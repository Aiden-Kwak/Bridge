import React from 'react';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import './css/DiaryCalendarForm.css';

function DiaryCalendarForm() {
  return (
    <div className='diary-calendar-container'>
      <TopNavbarForm /> 
      <div className='content-container'>
        <SideNavbarForm />
        <div className='content'>
          <p>다이어리 캘린더 페이지</p>
        </div> 
      </div>
    </div>
  );
}

export default DiaryCalendarForm;