import React from 'react';
import './css/TopNavbarForm.css';
import profileLogo from '../assets/icon/userInform.svg';
import { Link } from 'react-router-dom';

function TopNavbarForm(){
    return (
        <div className="topnav-container">
            <div className='top'>
                <Link to="/" className="top-nav-item">
                    <div className="logo">
                        Bridge
                    </div>
                </Link>
                <Link to="/profile" className="top-nav-item">
                    <div className="profile-icon">
                        <img src={profileLogo} alt="Profile" />
                    </div>
                </Link>
            </div>
        </div>

    );
};

export default TopNavbarForm;
