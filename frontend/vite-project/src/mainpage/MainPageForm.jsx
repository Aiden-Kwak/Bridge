import { useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function MainPageForm() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (!user){
      navigate('/login');
    } else {
      navigate('/calendar');
    }
  }, []);
  return (
    <div>
      <h1>혹시 내가 보여요..? 그러면 안되는데..고쳐볼게요</h1>
    </div>
  );
}

export default MainPageForm;