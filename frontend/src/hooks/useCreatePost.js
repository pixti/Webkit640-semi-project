import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function useCreatePost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPost = async (title, content, category) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('로그인이 필요합니다.');
            setLoading(false);
            return { success: false, navigateTo: '/login' };
        }

        try {
            const decodedToken = jwtDecode(token);
            const postData = {
                title,
                content,
                category,
                userId: decodedToken.id,
            };

            await axios.post('http://localhost:5000/api/posts', postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            return { success: true, navigateTo: '/' };
        } catch (err) {
            setError(err.response?.data?.message || '게시글 작성에 실패했습니다.');
            return { success: false, navigateTo: null };
        } finally {
            setLoading(false);
        }
    };

    return { createPost, loading, error };
}

export default useCreatePost;