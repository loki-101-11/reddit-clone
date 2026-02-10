// Socket.io 통합 테스트 스크립트
// 작성일: 2026-02-10

const http = require('http');
const { Server } = require('socket.io');
const db = require('./db/db.js');

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.io Test Server');
});

// Socket.io 서버 설정
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

console.log('Socket.io 서버 시작 중...');

// 테스트 데이터
const testPost = {
    id: 999,
    title: 'Socket.io 테스트 게시글',
    content: '이 게시글은 Socket.io 통합 테스트를 위해 생성되었습니다.',
    author: 'test_user',
    community: 'test',
    score: 0,
    created_at: new Date().toISOString()
};

const testComment = {
    id: 999,
    post_id: 999,
    parent_id: null,
    content: 'Socket.io 테스트 댓글',
    author: 'test_user',
    score: 0,
    created_at: new Date().toISOString()
};

// Socket.io 연결 핸들러
io.on('connection', (socket) => {
    console.log(`클라이언트 연결됨: ${socket.id}`);

    // 테스트 이벤트 리스너
    socket.on('test_upvote', (data) => {
        console.log('업보트 테스트 이벤트 수신:', data);
        io.emit('test_upvote_response', { success: true, postId: data.postId });
    });

    socket.on('test_downvote', (data) => {
        console.log('다운보트 테스트 이벤트 수신:', data);
        io.emit('test_downvote_response', { success: true, postId: data.postId });
    });

    socket.on('test_comment', (data) => {
        console.log('댓글 테스트 이벤트 수신:', data);
        io.emit('test_comment_response', { success: true, commentId: data.commentId });
    });

    socket.on('disconnect', () => {
        console.log(`클라이언트 연결 종료: ${socket.id}`);
    });
});

// 서버 시작
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`\n✅ Socket.io 테스트 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
    console.log('\n테스트 방법:');
    console.log('1. 브라우저에서 http://localhost:3001 접속');
    console.log('2. 개발자 도구 콘솔에서 다음 명령어 실행:');
    console.log('   socket.emit("test_upvote", { postId: 999 })');
    console.log('   socket.emit("test_downvote", { postId: 999 })');
    console.log('   socket.emit("test_comment", { commentId: 999 })');
    console.log('\n서버 종료: Ctrl+C');
});