const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const PORT = process.env.PORT || 3000;

// HTTP 서버 생성 (Socket.io용)
const server = http.createServer(app);

// Socket.io 설정
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

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
const usersRouter = require('./routes/users');
const { router: socketRouter, setIo } = require('./routes/socket');
app.use('/api/posts', postsRouter);
app.use('/api/votes', votesRouter);
app.use('/api', commentsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/worker', workerRouter);
app.use('/api/users', usersRouter);
app.use('/api/socket', socketRouter);

console.log('API routes registered');

// 정적 파일 서빙 (API 라우트 이후)
app.use(express.static(path.join(__dirname, 'public')));

// 기본 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io 연결 핸들러
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // 사용자가 게시글을 업보트할 때 다른 클라이언트에게 알림
    socket.on('upvote_post', (data) => {
        io.emit('post_upvoted', data);
    });

    // 사용자가 게시글을 다운보트할 때 다른 클라이언트에게 알림
    socket.on('downvote_post', (data) => {
        io.emit('post_downvoted', data);
    });

    // 사용자가 댓글을 작성할 때 다른 클라이언트에게 알림
    socket.on('comment_created', (data) => {
        io.emit('new_comment', data);
    });

    // 사용자가 댓글을 삭제할 때 다른 클라이언트에게 알림
    socket.on('comment_deleted', (data) => {
        io.emit('comment_removed', data);
    });

    // 사용자가 게시글을 작성할 때 다른 클라이언트에게 알림
    socket.on('post_created', (data) => {
        io.emit('new_post', data);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Socket.io 인스턴스를 라우터에 설정
setIo(io);

// 서버 시작
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
