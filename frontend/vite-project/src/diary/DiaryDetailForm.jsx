import React, { useState, useEffect } from 'react';
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import './css/DiaryDetailForm.css';

function DiaryDetailForm(){
    return (
        <div className="diary-detail-container">
            <TopNavbarForm /> 
            <div className='content-container'>
                <SideNavbarForm />
                <div className='content'>
                    <div className="diary-container">
                        <p>diary</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiaryDetailForm;