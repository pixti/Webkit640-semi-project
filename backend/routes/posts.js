const express = require('express');
const router = express.Router();

// 모든 게시글 조회 (카테고리별 필터링 포함)
router.get('/', async (req, res) => {
    const { category } = req.query;
    const db = req.db;
    let query = 'SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC';
    let params = [];

    if (category) {
        query = 'SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.category = ? ORDER BY p.created_at DESC';
        params = [category];
    }
    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('게시글 조회 오류:', err);
        res.status(500).json({ message: '게시글을 불러오지 못했습니다.' });
    }
});

// 특정 게시글 조회
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = req.db;
    try {
        const query = 'SELECT p.*, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?';
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('게시글 조회 오류:', err);
        res.status(500).json({ message: '게시글을 불러오지 못했습니다.' });
    }
});

// 새로운 게시글 생성
router.post('/', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const { title, content, category } = req.body;
    const userId = req.user.id;
    const db = req.db;

    if (!title || !content || !category) {
        return res.status(400).json({ message: '제목, 내용, 카테고리는 필수 항목입니다.' });
    }

    try {
        const [result] = await db.query('INSERT INTO posts (title, content, category, user_id) VALUES (?, ?, ?, ?)', [title, content, category, userId]);
        res.status(201).json({ id: result.insertId, title, content, category, user_id: userId });
    } catch (err) {
        console.error('게시글 생성 오류:', err);
        res.status(500).json({ message: '게시글 생성에 실패했습니다.' });
    }
});

// 게시글 수정
router.put('/:id', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user.id;
    const db = req.db;

    if (!title || !content || !category) {
        return res.status(400).json({ message: '제목, 내용, 카테고리는 필수 항목입니다.' });
    }

    try {
        const [result] = await db.query('UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ? AND user_id = ?', [title, content, category, id, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없거나 수정 권한이 없습니다.' });
        }
        res.json({ message: '게시글이 성공적으로 수정되었습니다.' });
    } catch (err) {
        console.error('게시글 수정 오류:', err);
        res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
    }
});

// 게시글 삭제
router.delete('/:id', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const db = req.db;
    try {
        const [result] = await db.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }
        res.json({ message: '게시글이 성공적으로 삭제되었습니다.' });
    } catch (err) {
        console.error('게시글 삭제 오류:', err);
        res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
    }
});

module.exports = router;