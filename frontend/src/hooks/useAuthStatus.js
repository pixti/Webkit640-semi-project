import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useAuthStatus() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/');
    };

    return { isLoggedIn, username, handleLogout };
}

export default useAuthStatus;