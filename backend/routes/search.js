const express = require('express');
const router = express.Router();

// 검색 라우트
router.get('/', async (req, res) => {
    const { q } = req.query;
    const db = req.db;

    if (!q) {
        return res.status(400).json({ message: '검색어를 입력해주세요.' });
    }

    try {
        const postQuery = `
            SELECT 
                p.id, p.title, p.content, p.category, p.created_at, u.username, 
                'post_title' as found_in
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.title LIKE ?
            UNION
            SELECT 
                p.id, p.title, p.content, p.category, p.created_at, u.username, 
                'post_content' as found_in
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.content LIKE ?
        `;
        const postParams = [`%${q}%`, `%${q}%`];
        const [postResults] = await db.query(postQuery, postParams);

        const commentQuery = `
            SELECT 
                c.id, c.content, c.post_id, c.created_at, u.username, 
                'comment' as found_in
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.content LIKE ?
        `;
        const commentParams = [`%${q}%`];
        const [commentResults] = await db.query(commentQuery, commentParams);

        // 게시글과 댓글 검색 결과를 합칩니다.
        const combinedResults = [...postResults, ...commentResults];

        // 중복 결과를 제거합니다.
        const uniqueResults = combinedResults.filter((value, index, self) =>
            index === self.findIndex(t => t.id === value.id && t.found_in === value.found_in)
        );

        res.json(uniqueResults);

    } catch (err) {
        console.error('검색 오류:', err);
        res.status(500).json({ message: '검색에 실패했습니다.' });
    }
});

module.exports = router;