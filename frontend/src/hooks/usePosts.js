import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * 게시글 데이터를 불러오는 커스텀 훅
 * @param {string | null} categoryName - 불러올 카테고리 이름 (선택 사항)
 */
function usePosts(categoryName = null) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = 'http://localhost:5000/api/posts';
                if (categoryName) {
                    url += `?category=${encodeURIComponent(categoryName)}`;
                }
                const response = await axios.get(url);
                setPosts(response.data);
            } catch (err) {
                setError('게시글을 불러오는 데 실패했습니다.');
                console.error('API 호출 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [categoryName]);

    return { posts, loading, error };
}

export default usePosts;