import React, {useContext} from 'react';
import './css/SideNavbarForm.css'; // CSS 파일 임포트
import { Link } from 'react-router-dom';
import homeIcon from '../assets/icon/home.svg';
import profileIcon from '../assets/icon/profile.svg';
import pencilIcon from '../assets/icon/pencil.svg';
import logoutIcon from '../assets/icon/logout.svg';
import listIcon from '../assets/icon/list.svg';
import { UserContext } from '../UserContext';

function SideNavbarForm() {
    const { user } = useContext(UserContext);
    return (
        <div className="sidenav-container">
            <Link to="/" className="nav-item">
                <i className="icon-home"><img src={homeIcon} alt="icon" /></i> 홈
            </Link>
            <Link to="/profile" className="nav-item">
                <i className="icon-profile"><img src={profileIcon} alt="icon" /></i> 프로필
            </Link>
            <Link to="/diary/write" className="nav-item">
                <i className="icon-pencil"><img src={pencilIcon} alt="icon" /></i> 일기쓰기
            </Link>
            <Link to="/diary/list" className="nav-item">
                <i className="icon-list"><img src={listIcon} alt="icon" /></i> 일기목록
            </Link>
            { user ? 
            <Link to="/logout" className="nav-item">
                    <i className="icon-profile"><img src={logoutIcon} alt="icon" /></i> 로그아웃
            </Link> : 
            <Link to="/login" className="nav-item">
                    <i className="icon-profile"><img src={pencilIcon} alt="icon" /></i> 로그인
            </Link>
            }
        </div>
    );
};

export default SideNavbarForm;
