import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import TopNavbarForm from '../snippets/TopNavbarForm';
import SideNavbarForm  from '../snippets/SideNavbarForm';
import './css/DiaryDetailForm.css';

function DiaryDetailForm(){

    const location=useLocation();
    const test=location.state;
    console.log(test);
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