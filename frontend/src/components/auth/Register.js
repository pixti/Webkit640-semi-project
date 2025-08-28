import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password,
            });
            alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || '회원가입에 실패했습니다.');
        }
    };

    return (
        <div className="container-lg d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <Link className="navbar-brand d-flex flex-column align-items-center text-decoration-none text-body" to="/">
                            <i className="bi bi-globe-asia-australia fs-1 mb-2 text-primary"></i>
                            <span className="fw-bold fs-4">Semi-Project</span>
                        </Link>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label htmlFor="inputUsername" className="form-label">아이디</label>
                            <input type="text" className="form-control" id="inputUsername" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디를 입력하세요" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputPassword" className="form-label">비밀번호</label>
                            <input type="password" className="form-control" id="inputPassword" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="inputConfirmPassword" className="form-label">비밀번호 확인</label>
                            <input type="password" className="form-control" id="inputConfirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호를 다시 입력하세요" required />
                        </div>
                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary btn-lg">회원가입</button>
                        </div>
                    </form>
                    <div className="text-center mt-4">
                        <p className="small text-muted mb-1">이미 계정이 있으신가요?</p>
                        <Link to="/login" className="btn btn-sm btn-outline-secondary">로그인</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;