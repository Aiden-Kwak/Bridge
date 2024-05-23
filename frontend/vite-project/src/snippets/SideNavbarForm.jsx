import React from 'react';
import './css/SideNavbarForm.css'; // CSS 파일 임포트
import { Link } from 'react-router-dom';
import homeIcon from '../assets/icon/home.svg';
import profileIcon from '../assets/icon/profile.svg';

function SideNavbarForm() {
    return (
        <div className="sidenav-container">
            <Link to="/" className="nav-item">
                <i className="icon-home"><img src={homeIcon} alt="icon" /></i> 홈
            </Link>
            <Link to="/profile" className="nav-item">
                <i className="icon-profile"><img src={profileIcon} alt="icon" /></i> 프로필
            </Link>
        </div>
    );
};

export default SideNavbarForm;
