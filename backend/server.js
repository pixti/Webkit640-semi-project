const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// 라우터 모듈 불러오기
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const searchRouter = require('./routes/search');
const usersRouter = require('./routes/users');
const translateRouter = require('./routes/translate');

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// MySQL 연결 풀 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(connection => {
        console.log('✅ MySQL 데이터베이스에 성공적으로 연결되었습니다.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL 데이터베이스 연결 실패:', err);
        // 서버 시작 전 데이터베이스 연결에 실패하면 프로세스 종료
        process.exit(1);
    });

// 인증 미들웨어: 모든 라우터에서 사용하기 위해 전역적으로 정의
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        }
        req.user = user;
        next();
    });
};

// 라우터에 데이터베이스 커넥션 풀과 인증 미들웨어 전달
// req 객체에 db와 authenticateToken을 추가하여 라우터 내에서 접근 가능하도록 합니다.
app.use((req, res, next) => {
    req.db = db;
    req.authenticateToken = authenticateToken;
    next();
});

// 기본 라우트
app.get('/', (req, res) => {
    res.send('반응형 웹사이트 서버가 작동 중입니다!');
});

// 라우트 사용
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/search', searchRouter);
app.use('/api/users', usersRouter);
app.use('/api/translate', translateRouter);

// 서버 시작
app.listen(port, () => {
    console.log(`✅ 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});