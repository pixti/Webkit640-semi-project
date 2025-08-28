import { useState, useCallback } from 'react';
import axios from 'axios';

function useComments(postId, fetchComments) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 댓글 생성
    const handleCommentSubmit = useCallback(async (commentContent) => {
        setLoading(true);
        setError(null);

        if (!commentContent.trim()) {
            setError('댓글 내용을 입력하세요.');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const payload = { content: commentContent };

        try {
            // 댓글 작성 API 호출 URL을 백엔드 라우트에 맞게 수정했습니다.
            await axios.post(`http://localhost:5000/api/comments/${postId}`, payload, { headers });
            fetchComments(); // 댓글 작성 후 부모 컴포넌트의 데이터 새로고침 함수 호출
        } catch (err) {
            setError(err.response?.data?.message || '댓글 작성에 실패했습니다.');
            console.error('댓글 작성 오류:', err);
        } finally {
            setLoading(false);
        }
    }, [postId, fetchComments]);

    // 댓글 수정
    const handleEditComment = useCallback(async (commentId, newContent) => {
        setLoading(true);
        setError(null);

        if (!newContent.trim()) {
            setError('수정할 댓글 내용을 입력하세요.');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            await axios.put(`http://localhost:5000/api/comments/${commentId}`, { content: newContent }, { headers });
            fetchComments(); // 댓글 수정 후 부모 컴포넌트의 데이터 새로고침 함수 호출
        } catch (err) {
            setError(err.response?.data?.message || '댓글 수정에 실패했습니다.');
            console.error('댓글 수정 오류:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchComments]);

    // 댓글 삭제
    const handleDeleteComment = useCallback(async (commentId) => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            await axios.delete(`http://localhost:5000/api/comments/${commentId}`, { headers });
            fetchComments(); // 댓글 삭제 후 부모 컴포넌트의 데이터 새로고침 함수 호출
        } catch (err) {
            setError(err.response?.data?.message || '댓글 삭제에 실패했습니다.');
            console.error('댓글 삭제 오류:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchComments]);

    return {
        handleCommentSubmit,
        handleEditComment,
        handleDeleteComment,
        loading,
        error
    };
}

export default useComments;