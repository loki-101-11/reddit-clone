const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(express.json());

// API 라우트 (static 미들웨어보다 먼저)
const postsRouter = require('./routes/posts');
const votesRouter = require('./routes/votes');
const commentsRouter = require('./routes/comments');
const communitiesRouter = require('./routes/communities');
const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');
const notificationsRouter = require('./routes/notifications');
const workerRouter = require('./routes/worker');
app.use('/api/posts', postsRouter);
app.use('/api/votes', votesRouter);
app.use('/api', commentsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/worker', workerRouter);

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
