import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../../categories';
import usePosts from '../../hooks/usePosts';

function PostList() {
    const { categoryName } = useParams();
    const categoryInfo = categories.find(cat => cat.slug === categoryName);
    const categoryKoreanName = categoryInfo ? categoryInfo.name : '게시판';

    // 커스텀 훅을 사용하여 데이터 로직 분리
    const { posts, loading, error } = usePosts(categoryKoreanName);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container-lg my-4">
            <h2 className="mb-4">{categoryKoreanName} 게시판</h2>
            <ul className="list-group">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <li key={post.id} className="list-group-item">
                            <Link to={`/posts/${categoryName}/${post.id}`} className="text-decoration-none text-body">
                                <h5>{post.title}</h5>
                            </Link>
                            <p className="text-muted">{new Date(post.created_at).toLocaleDateString()}</p>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-center text-muted">
                        아직 게시글이 없습니다.
                    </li>
                )}
            </ul>
        </div>
    );
}

export default PostList;