import React from 'react';

function URLManagement() {
    const devBaseURL = 'http://localhost:8000'; // 개발
    const prodBaseURL = 'http://computer-system-team-06.dev.mobilex.kr/'; // 프로덕션

    return process.env.NODE_ENV === 'development' ? devBaseURL : prodBaseURL;
} // 이 고생을 누군가 알아줄까 집에 보내줘

export default URLManagement;