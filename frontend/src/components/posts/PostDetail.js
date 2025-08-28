import React, { useState } from 'react'; // useState를 import에 추가합니다.
import { useParams, useNavigate } from 'react-router-dom';
import usePostDetail from '../../hooks/usePostDetail';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import axios from 'axios';

function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { post, comments, loading, error, currentUser } = usePostDetail(postId);

    // 수정 상태를 관리하는 useState 추가
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedCategory, setEditedCategory] = useState('');

    const isLoggedIn = !!localStorage.getItem('token');
    const isAuthor = isLoggedIn && post && parseInt(post.user_id, 10) === currentUser;

    const handleDeletePost = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인 후 글을 삭제할 수 있습니다.');
            return;
        }

        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('게시글이 삭제되었습니다.');
                navigate('/');
            } catch (err) {
                alert(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
            }
        }
    };

    // 수정 모드 활성화 및 초기 데이터 설정
    const handleEditPost = () => {
        setIsEditing(true);
        setEditedTitle(post.title);
        setEditedContent(post.content);
        setEditedCategory(post.category);
    };

    // 수정 완료 로직
    const handleSaveEdit = async () => {
        const token = localStorage.getItem('token');
        if (!editedTitle || !editedContent || !editedCategory) {
            alert('제목, 내용, 카테고리는 필수 항목입니다.');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/posts/${postId}`, {
                title: editedTitle,
                content: editedContent,
                category: editedCategory,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('게시글이 성공적으로 수정되었습니다.');
            setIsEditing(false); // 수정 모드 종료
            window.location.reload(); // 페이지 새로고침
        } catch (err) {
            alert(err.response?.data?.message || '게시글 수정에 실패했습니다.');
        }
    };

    if (loading) {
        return <div className="container-lg my-4"><p>로딩 중...</p></div>;
    }

    if (error) {
        return <div className="container-lg my-4"><p className="text-danger">{error}</p></div>;
    }

    if (!post) {
        return <div className="container-lg my-4"><p>게시글을 찾을 수 없습니다.</p></div>;
    }

    return (
        <div className="container-lg my-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">
                        {isEditing ? (
                            <input
                                type="text"
                                className="form-control"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                        ) : (
                            post.title
                        )}
                    </h4>
                    {isAuthor && (
                        <div>
                            {isEditing ? (
                                <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>
                                    저장
                                </button>
                            ) : (
                                <button className="btn btn-warning btn-sm me-2" onClick={handleEditPost}>
                                    수정
                                </button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={handleDeletePost}>
                                삭제
                            </button>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
                        <span>작성자: {post.username}</span>
                        <span>작성일: {new Date(post.created_at).toLocaleString()}</span>
                    </div>
                    {isEditing ? (
                        <div className="card-text mb-4">
                            <textarea
                                className="form-control"
                                rows="10"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="card-text mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                            {post.content}
                        </div>
                    )}
                    <hr />
                    <h6 className="mb-3">댓글</h6>

                    <CommentList
                        comments={comments}
                        currentUser={currentUser}
                        fetchComments={() => window.location.reload()}
                        postId={postId}
                    />

                    <div className="mt-4">
                        <h6 className="mb-3">댓글 작성</h6>
                        <CommentForm
                            postId={postId}
                            fetchComments={() => window.location.reload()}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;