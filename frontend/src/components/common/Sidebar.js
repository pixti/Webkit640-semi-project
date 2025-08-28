import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../categories'; // 경로 수정: components 폴더에서 src 폴더로 이동

function Sidebar() {
    return (
        <div className="vstack gap-4">
            {/* Quick Links */}
            <div className="card">
                <div className="card-header bg-transparent">
                    <h3 className="h6 mb-0 fw-bold">카테고리</h3>
                </div>
                <div className="list-group list-group-flush">
                    {/* AI 번역 카테고리 */}
                    <Link
                        to="/translator"
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-white bg-primary py-3"
                        style={{ fontWeight: 'bold' }}
                    >
                        <span>✨ AI 번역</span>
                        <i className="bi bi-robot"></i>
                    </Link>
                    {/* categories 배열을 사용해 카테고리 링크 동적 생성 */}
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            to={`/posts/${category.slug}`}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                            <span>{category.name}</span>
                            <i className="bi bi-chevron-right text-muted"></i>
                        </Link>
                    ))}
                </div>
            </div>
            {/* ... Subscribed/Visited Subs 섹션은 그대로 유지 ... */}
        </div>
    );
}

export default Sidebar;