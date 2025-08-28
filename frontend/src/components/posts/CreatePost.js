import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { categories } from '../../categories'; // 올바른 경로로 수정
import useCreatePost from '../../hooks/useCreatePost'; // 올바른 경로로 수정

function CreatePost() {
    const navigate = useNavigate();
    const location = useLocation(); // useNavigate와 함께 import

    // 번역기 페이지에서 전달된 초기 데이터를 useLocation을 통해 받습니다.
    const { initialTitle = '', initialContent = '' } = location.state || {};

    // useState의 초기값으로 전달받은 데이터를 사용합니다.
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

    const { createPost, loading, error } = useCreatePost();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await createPost(title, content, selectedCategory);
        if (result.success) {
            alert('게시글이 성공적으로 작성되었습니다.');
            navigate(result.navigateTo);
        } else if (result.navigateTo) {
            alert(error);
            navigate(result.navigateTo);
        } else {
            alert(error);
        }
    };

    return (
        <div className="container-lg my-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">새 게시글 작성</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="post-title" className="form-label">제목</label>
                            <input
                                type="text"
                                className="form-control"
                                id="post-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="post-content" className="form-label">내용</label>
                            <textarea
                                className="form-control"
                                id="post-content"
                                rows="8"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 입력하세요"
                                required
                                disabled={loading}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label d-block">카테고리</label>
                            {categories.map((category) => (
                                <div className="form-check form-check-inline" key={category.name}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="post-category"
                                        id={`category-${category.slug}`}
                                        value={category.name}
                                        checked={selectedCategory === category.name}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <label className="form-check-label" htmlFor={`category-${category.slug}`}>
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <div className="d-grid gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? '작성 중...' : '게시글 작성'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;