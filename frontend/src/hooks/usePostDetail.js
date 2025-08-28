import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function usePostDetail(postId) {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchPostAndComments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const postResponse = await axios.get(`http://localhost:5000/api/posts/${postId}`);
            setPost(postResponse.data);

            // 이 부분을 백엔드 라우팅에 맞게 수정합니다.
            const commentsResponse = await axios.get(`http://localhost:5000/api/comments/${postId}`); // <-- 이 부분을 수정합니다.
            setComments(commentsResponse.data);

        } catch (err) {
            setError(err.response?.data?.message || '데이터를 불러오는 데 실패했습니다.');
            console.error('API 호출 오류:', err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPostAndComments();

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded.id);
            } catch (e) {
                console.error("토큰 디코딩 실패:", e);
                setCurrentUser(null);
            }
        }
    }, [fetchPostAndComments]);

    return { post, comments, loading, error, currentUser, fetchPostAndComments };
}

export default usePostDetail;