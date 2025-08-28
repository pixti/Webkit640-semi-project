import React from 'react';
import { Link } from 'react-router-dom';
import PostSection from '../posts/PostSection'; // 경로 수정
import Sidebar from './Sidebar'; // 경로 수정

function MainContent() {
    return (
        <main className="container-lg my-4">
            <div className="row g-4">
                {/* Left Column (Main Content) */}
                <div className="col-lg-9">
                    <div className="vstack gap-4">
                        {/* Welcome Box */}
                        <div className="card">
                            <div className="card-body p-4">
                                <h1 className="h4 fw-bold">🥳 박재형의 semi-project에 오신 것을 환영합니다! 😎</h1>
                                <div className="mt-4">
                                    <h2 className="h6 fw-bold">자유롭게 소통하세요</h2>
                                    <p className="small text-muted">
                                        <Link to="/create-post" className="text-decoration-none">글쓰기</Link> 버튼을 눌러 다양한 주제의 원하는 글을 작성할 수 있습니다.
                                    </p>
                                    <h2 className="h6 fw-bold mt-3">AI로 번역하세요</h2>
                                    <p className="small text-muted">
                                        Google AI Studio의 Gemini API를 활용하여 번역할 수 있습니다.{' '}
                                        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            여기서</a>{' '}
                                        API Key를 획득하세요.
                                    </p>
                                    <p className="small text-muted mt-2">하단의{' '}
                                        <Link to="/translator" className="text-decoration-none">AI 번역</Link>을 클릭하여 지금 번역을 시작해보세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <PostSection />
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="col-lg-3">
                    <Sidebar />
                </div>
            </div>
        </main>
    );
}

export default MainContent;