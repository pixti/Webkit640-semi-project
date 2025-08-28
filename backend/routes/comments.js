const express = require('express');
const router = express.Router();

// 특정 게시글의 댓글 조회 (GET)
// app.use('/api/comments')에 의해 최종 경로는 '/api/comments/:postId'가 됩니다.
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    const db = req.db;

    try {
        const query = 'SELECT c.*, u.username AS user_username FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC';
        const [rows] = await db.query(query, [postId]);
        res.json(rows);
    } catch (err) {
        console.error('댓글 조회 오류:', err);
        res.status(500).json({ message: '댓글을 불러오지 못했습니다.' });
    }
});

// 새로운 댓글 생성 (POST)
// 기존 경로였던 '/:postId/comments'를 '/:postId'로 수정했습니다.
router.post('/:postId', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const username = req.user.username;
    const db = req.db;

    if (!content) {
        return res.status(400).json({ message: '댓글 내용을 입력하세요.' });
    }

    try {
        await db.query('INSERT INTO comments (post_id, user_id, username, content) VALUES (?, ?, ?, ?)', [postId, userId, username, content]);
        res.status(201).json({ message: '댓글이 성공적으로 작성되었습니다.' });
    } catch (err) {
        console.error('댓글 작성 오류:', err);
        res.status(500).json({ message: '댓글 작성에 실패했습니다.' });
    }
});

// 댓글 수정 (PUT)
router.put('/:commentId', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const db = req.db;

    if (!content) {
        return res.status(400).json({ message: '수정할 댓글 내용을 입력하세요.' });
    }

    try {
        const [rows] = await db.query('UPDATE comments SET content = ? WHERE id = ? AND user_id = ?', [content, commentId, userId]);
        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없거나 수정 권한이 없습니다.' });
        }
        res.json({ message: '댓글이 성공적으로 수정되었습니다.' });
    } catch (err) {
        console.error('댓글 수정 오류:', err);
        res.status(500).json({ message: '댓글 수정에 실패했습니다.' });
    }
});

// 댓글 삭제 (DELETE)
router.delete('/:commentId', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const db = req.db;

    try {
        const [rows] = await db.query('DELETE FROM comments WHERE id = ? AND user_id = ?', [commentId, userId]);
        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }
        res.json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    } catch (err) {
        console.error('댓글 삭제 오류:', err);
        res.status(500).json({ message: '댓글 삭제에 실패했습니다.' });
    }
});

module.exports = router;