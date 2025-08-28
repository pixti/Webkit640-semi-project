import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../categories';
import usePosts from '../../hooks/usePosts';

function PostSection() {
    const { posts, loading, error } = usePosts();

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    const groupedPosts = posts.reduce((acc, post) => {
        if (!acc[post.category]) {
            acc[post.category] = [];
        }
        acc[post.category].push(post);
        return acc;
    }, {});

    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.name] = cat.slug;
        return acc;
    }, {});

    // displayCategories 배열을 하드코딩하는 대신, categories.js에서 직접 가져옵니다.
    // 기존의 '공지사항', '피드백', '게임', '소설' 카테고리 외에 '자유'도 포함하도록 수정했습니다.
    const displayCategories = categories.map(cat => cat.name);

    return (
        <div className="row g-4">
            {/* AI 번역 게시판 (두 배 크기) */}
            <div className="col-md-12">
                <div className="card h-100 bg-primary-subtle border-primary">
                    <Link to="/translator" className="text-decoration-none text-body card-header-link">
                        <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                            <h3 className="h6 mb-0 fw-bold">
                                ✨ AI 번역
                                <small className="text-muted fw-normal"> 인공지능 번역기</small>
                            </h3>
                            <i className="bi bi-robot text-muted"></i>
                        </div>
                    </Link>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item text-center">
                            <p className="mb-0 text-muted">AI 번역 기능을 사용해 보세요!</p>
                            <Link to="/translator" className="btn btn-primary mt-2">
                                번역기 바로가기
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            {/* 일반 게시판 섹션 */}
            {displayCategories.map((categoryName) => (
                <div key={categoryName} className="col-md-6">
                    <div className="card h-100">
                        <Link to={`/posts/${categoryMap[categoryName]}`} className="text-decoration-none text-body card-header-link">
                            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                                <h3 className="h6 mb-0 fw-bold">
                                    {categoryName}
                                    <small className="text-muted fw-normal"> {categoryName} 게시판</small>
                                </h3>
                                <i className="bi bi-chevron-right text-muted"></i>
                            </div>
                        </Link>
                        <ul className="list-group list-group-flush">
                            {groupedPosts[categoryName]?.slice(0, 3).map((post) => (
                                <li key={post.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    <Link to={`/posts/${categoryMap[post.category]}/${post.id}`} className="text-decoration-none text-body line-clamp-1">
                                        {post.title}
                                    </Link>
                                    <small className="text-muted text-nowrap ms-2">
                                        {new Date(post.created_at).toLocaleString()}
                                    </small>
                                </li>
                            ))}
                            {(!groupedPosts[categoryName] || groupedPosts[categoryName].length === 0) && (
                                <li className="list-group-item text-center text-muted">
                                    게시글이 없습니다.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostSection;