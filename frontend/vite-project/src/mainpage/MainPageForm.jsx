import { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

function MainPageForm() {
  const navigate = useNavigate();
  // 접속시 바로 /로 리다이렉트
  useEffect(() => {
    navigate('/calendar');
  }, []);
  return (
    <div>
      <h1>혹시 내가 보여요..? 그러면 안되는데..고쳐볼게요</h1>
    </div>
  );
}

export default MainPageForm;