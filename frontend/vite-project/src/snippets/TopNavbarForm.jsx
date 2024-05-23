import React from 'react';
import './css/TopNavbarForm.css';
import profileLogo from '../assets/icon/userInform.svg';

function TopNavbarForm(){
    return (
        <div className="topnav-container">
            <div className='top'>
                <div className="logo">
                    Bridge
                </div>
                <div className="profile-icon">
                    <img src={profileLogo} alt="Profile" />
                </div>
            </div>
            
        </div>

    );
};

export default TopNavbarForm;
