const express = require('express');
const router = express.Router();

// 사용자 설정 저장 (PUT)
router.put('/settings', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const userId = req.user.id;
    const { settings } = req.body;
    const db = req.db;

    if (!settings) {
        return res.status(400).json({ message: '설정값이 누락되었습니다.' });
    }

    try {
        await db.query('UPDATE users SET settings = ? WHERE id = ?', [JSON.stringify(settings), userId]);
        res.json({ message: '설정이 성공적으로 저장되었습니다.' });
    } catch (err) {
        console.error('설정 저장 오류:', err);
        res.status(500).json({ message: '설정 저장에 실패했습니다.' });
    }
});

// 사용자 설정 불러오기 (GET)
router.get('/settings', (req, res, next) => req.authenticateToken(req, res, next), async (req, res) => {
    const userId = req.user.id;
    const db = req.db;

    try {
        const [rows] = await db.query('SELECT settings FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.json({ settings: rows[0].settings });
    } catch (err) {
        console.error('설정 불러오기 오류:', err);
        res.status(500).json({ message: '설정 불러오기에 실패했습니다.' });
    }
});

module.exports = router;