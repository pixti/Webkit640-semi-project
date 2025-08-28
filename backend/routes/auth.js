const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 환경 변수는 server.js에서 관리하므로, 여기서는 JWT_SECRET만 사용합니다.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// 회원가입 라우트
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const db = req.db; // server.js에서 전달받은 db 객체

    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호는 필수입니다.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
        }
        console.error('회원가입 오류:', err);
        res.status(500).json({ message: '회원가입에 실패했습니다.' });
    }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = req.db; // server.js에서 전달받은 db 객체

    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호는 필수입니다.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: '아이디가 존재하지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: '로그인 성공', token, username: user.username });
    } catch (err) {
        console.error('로그인 오류:', err);
        res.status(500).json({ message: '로그인에 실패했습니다.' });
    }
});

module.exports = router;