import React from 'react';
import useComments from '../../hooks/useComments';

// props로 postId를 받아야 합니다.
function CommentList({ comments, currentUser, fetchComments, postId }) {
    const isLoggedIn = !!localStorage.getItem('token');
    // useComments 훅에 postId를 전달합니다.
    const { handleDeleteComment, handleEditComment } = useComments(postId, fetchComments);

    const onEditClick = async (commentId) => {
        const newContent = prompt('수정할 댓글 내용을 입력하세요.');
        if (newContent === null || newContent.trim() === '') return;
        await handleEditComment(commentId, newContent);
    };

    const onDeleteClick = async (commentId) => {
        if (window.confirm('정말로 댓글을 삭제하시겠습니까?')) {
            await handleDeleteComment(commentId);
        }
    };

    if (comments.length === 0) {
        return <p className="text-muted small">아직 댓글이 없습니다.</p>;
    }

    return (
        <ul className="list-unstyled">
            {comments.map((comment) => (
                <li key={comment.id} className="mb-3 border-bottom pb-2">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">
                            {comment.user_username || '익명'}
                        </div>
                        <div className="small text-muted">
                            {new Date(comment.created_at).toLocaleString()}
                        </div>
                    </div>
                    <p className="ms-3 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                    {(isLoggedIn && comment.user_id && parseInt(comment.user_id, 10) === currentUser) && (
                        <div className="text-end small">
                            <button className="btn btn-sm btn-link text-muted p-0 me-2" onClick={() => onEditClick(comment.id)}>수정</button>
                            <button className="btn btn-sm btn-link text-muted p-0" onClick={() => onDeleteClick(comment.id)}>삭제</button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default CommentList;