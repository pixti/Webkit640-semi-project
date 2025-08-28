import React from 'react';

function Footer() {
    return (
        <footer className="bg-body-tertiary border-top mt-auto py-5">
            <div className="container-lg">
                <div className="row">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h5 className="fw-bold">semi-project</h5>
                        <p className="small text-muted">박재형의 semi-project에 오신것을 환영해요.</p>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h5 className="fw-semibold">제작자</h5>
                        <ul className="list-unstyled">
                            <p className="text-decoration-none text-muted">금오공대 20210474</p>
                            <p className="text-decoration-none text-muted">박재형</p>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="fw-semibold">주제</h5>
                        <ul className="list-unstyled">
                            <p className="text-decoration-none text-muted">Gemini Api를 활용한 AI 번역기능 제공</p>
                            <p className="text-decoration-none text-muted">커뮤니티 기본 기능 제공</p>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;