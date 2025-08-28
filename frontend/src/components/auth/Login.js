import React, { useState, useEffect } from 'react'; // useEffect를 import에 추가
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberId, setRememberId] = useState(false); // 아이디 기억 상태 추가
    const navigate = useNavigate();

    // 페이지가 처음 로드될 때 localStorage 확인
    useEffect(() => {
        const savedId = localStorage.getItem('savedId');
        if (savedId) {
            setUsername(savedId);
            setRememberId(true);
        }
    }, []); // 빈 배열을 넣어 컴포넌트가 처음 마운트될 때만 실행되도록 설정

    const handleLogin = async (e) => {
        e.preventDefault();

        // 아이디 기억 체크박스 상태에 따라 localStorage에 저장
        if (rememberId) {
            localStorage.setItem('savedId', username);
        } else {
            localStorage.removeItem('savedId');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            alert('로그인 성공!');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || '로그인에 실패했습니다.');
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
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="inputUsername" className="form-label">아이디</label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputUsername"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputPassword" className="form-label">비밀번호</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="inputPassword"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mb-4 small">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="rememberIdCheck"
                                    checked={rememberId}
                                    onChange={(e) => setRememberId(e.target.checked)} // 체크박스 상태 변경 핸들러
                                />
                                <label className="form-check-label text-muted" htmlFor="rememberIdCheck">
                                    아이디 기억
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="keepLoggedInCheck" />
                                <label className="form-check-label text-muted" htmlFor="keepLoggedInCheck">
                                    로그인 상태 유지
                                </label>
                            </div>
                        </div>
                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary btn-lg">로그인</button>
                        </div>
                    </form>
                    <div className="text-center mt-4">
                        <p className="small text-muted mb-1">계정이 없으신가요?</p>
                        <Link to="/register" className="btn btn-sm btn-outline-secondary">회원가입</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;