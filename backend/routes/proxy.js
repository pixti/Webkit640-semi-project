// backend/routes/proxy.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('URL이 필요합니다.');
    }

    try {
        const response = await axios.get(url, { responseType: 'text' });

        const headers = response.headers;

        // **핵심: X-Frame-Options 헤더를 제거**
        delete headers['x-frame-options'];
        delete headers['content-security-policy'];

        // 상태 코드와 수정된 헤더를 포함하여 프론트엔드에 응답을 보냅니다.
        res.status(response.status).set(headers).send(response.data);
    } catch (error) {
        console.error('프록시 요청 오류:', error);
        res.status(error.response?.status || 500).send('프록시 요청 실패');
    }
});

module.exports = router;