import { useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils';

function LogoutForm() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        const csrfToken=getCookie('csrftoken');
        try {
            await axios.post('http://127.0.0.1:8000/api/account/logout/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            });
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        } catch (error) {
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        }
    }, [setUser, navigate]);

    useEffect(() => {
        handleLogout();
    }, [handleLogout]);

    return null;
}

export default LogoutForm;