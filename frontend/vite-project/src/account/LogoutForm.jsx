import { useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils';
import { URLManagement } from '../utils';

function LogoutForm() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const API_BASE_URL = URLManagement();

    const handleLogout = useCallback(async () => {
        const csrfToken=getCookie('csrftoken');
        axios.defaults.withCredentials = true;
        try {
            await axios.post(`${API_BASE_URL}/api/account/logout/`, {}, {
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