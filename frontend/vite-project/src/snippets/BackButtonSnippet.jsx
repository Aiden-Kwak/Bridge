import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icon/back.svg';
import './css/BackButtonSnippet.css';

function BackButtonSnippet() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <img src={backIcon} alt="뒤로 가기" onClick={goBack} className="back-button" />
  );
}

export default BackButtonSnippet;