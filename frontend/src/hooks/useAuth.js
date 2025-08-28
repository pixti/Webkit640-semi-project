import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 로그인 처리 로직
    const handleLogin = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            alert('로그인 성공!');
            navigate('/');
            return true;
        } catch (err) {
            setError(err.response?.data?.message || '로그인에 실패했습니다.');
            alert(err.response?.data?.message || '로그인에 실패했습니다.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 회원가입 처리 로직
    const handleRegister = async (username, password, confirmPassword) => {
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            alert('비밀번호가 일치하지 않습니다.');
            setLoading(false);
            return false;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password,
            });
            alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
            return true;
        } catch (err) {
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
            alert(err.response?.data?.message || '회원가입에 실패했습니다.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handleLogin,
        handleRegister,
    };
}

export default useAuth;