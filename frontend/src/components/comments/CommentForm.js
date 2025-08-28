import React, { useState } from 'react';
import useComments from '../../hooks/useComments'; // 새로 만든 훅을 불러옴

function CommentForm({ postId, fetchComments, isLoggedIn }) {
    const [commentContent, setCommentContent] = useState('');
    const { handleCommentSubmit, loading, error } = useComments(postId, fetchComments);

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleCommentSubmit(commentContent);
        setCommentContent(''); // 댓글 작성 후 입력창 비우기
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="mb-2">
                <textarea
                    className="form-control"
                    rows="3"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder={isLoggedIn ? '댓글을 작성하세요.' : '로그인 후 댓글을 작성해 주세요.'}
                    disabled={!isLoggedIn || loading}
                    required
                ></textarea>
            </div>
            {error && <p className="text-danger small">{error}</p>}
            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary btn-sm" disabled={!isLoggedIn || loading}>
                    {loading ? '작성 중...' : '작성'}
                </button>
            </div>
        </form>
    );
}

export default CommentForm;