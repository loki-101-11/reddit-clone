const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use((req, res, next) => {
    console.error(`[DEBUG] Request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

// API 라우트 (static 미들웨어보다 먼저)
const postsRouter = require('./routes/posts');
const votesRouter = require('./routes/votes');
app.use('/api/posts', postsRouter);
app.use('/api/posts', votesRouter);

console.log('API routes registered');

// 정적 파일 서빙 (API 라우트 이후)
app.use(express.static(path.join(__dirname, 'public')));

// 기본 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
