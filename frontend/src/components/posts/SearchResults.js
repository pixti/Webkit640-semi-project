import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [filter, setFilter] = useState('all'); // 'all', 'post_title', 'post_content', 'comment'

    // 커스텀 훅을 사용하여 데이터 로직 분리
    const { results, loading, error } = useSearch(query);

    if (loading) {
        return <div className="container-lg my-4"><p>검색 중...</p></div>;
    }

    if (error) {
        return <div className="container-lg my-4"><p className="text-danger">{error}</p></div>;
    }

    // 클라이언트 측에서 중복 제거 및 필터링
    const uniqueResults = results.filter((value, index, self) =>
        index === self.findIndex(t => t.id === value.id && t.found_in === value.found_in)
    );

    const filteredResults = uniqueResults.filter(result => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'post_title') {
            return result.found_in === 'post_title';
        } else if (filter === 'post_content') {
            return result.found_in === 'post_content';
        } else if (filter === 'comment') {
            return result.found_in === 'comment';
        }
        return false;
    });

    return (
        <div className="container-lg my-4">
            <h2 className="mb-4">"{query}"에 대한 검색 결과</h2>
            <div className="mb-3 d-flex flex-wrap gap-2">
                <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('all')}>전체</button>
                <button className={`btn btn-sm ${filter === 'post_title' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('post_title')}>제목</button>
                <button className={`btn btn-sm ${filter === 'post_content' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('post_content')}>내용</button>
                <button className={`btn btn-sm ${filter === 'comment' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('comment')}>댓글</button>
            </div>
            {filteredResults.length > 0 ? (
                <ul className="list-group">
                    {filteredResults.map(result => (
                        <li key={`${result.found_in}-${result.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span className="badge bg-secondary me-2">
                                    {result.found_in === 'post_title' || result.found_in === 'post_content' ? '게시글' : '댓글'}
                                </span>
                                {result.found_in === 'post_title' && (
                                    <Link to={`/posts/${result.category}/${result.id}`} className="text-decoration-none text-body fw-bold">
                                        {result.title}
                                    </Link>
                                )}
                                {result.found_in === 'post_content' && (
                                    <Link to={`/posts/${result.category}/${result.id}`} className="text-decoration-none text-body fw-bold">
                                        {result.content.substring(0, 50)}...
                                    </Link>
                                )}
                                {result.found_in === 'comment' && (
                                    <p className="mb-0 text-muted">
                                        {result.content.substring(0, 50)}...
                                    </p>
                                )}
                            </div>
                            <small className="text-muted">{result.username}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
}

export default SearchResults;