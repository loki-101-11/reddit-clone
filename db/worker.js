const path = require('path');
const db = require(path.join(__dirname, 'db.js'));

// 워커 전용 데이터베이스 작업 모듈

// 랜덤 사용자 가져오기
function getRandomUser() {
    // 실제 사용자 테이블이 있다면 거기서 가져오고, 없다면 가상의 사용자 생성
    // 현재는 users 테이블이 있으므로 거기서 가져옵니다.
    // 데이터가 없을 경우를 대비해 기본 사용자 목록도 준비합니다.
    try {
        const user = db.prepare('SELECT username FROM users ORDER BY RANDOM() LIMIT 1').get();
        if (user) return user.username;
    } catch (e) {
        console.error('Error fetching random user:', e);
    }
    
    const defaultUsers = ['auto_worker', 'reddit_bot', 'ai_assistant', 'community_manager'];
    return defaultUsers[Math.floor(Math.random() * defaultUsers.length)];
}

// 특정 커뮤니티의 최근 게시글 가져오기 (컨텍스트 분석용)
function getRecentPosts(communityName, limit = 5) {
    return db.prepare('SELECT * FROM posts WHERE community = ? ORDER BY created_at DESC LIMIT ?').all(communityName, limit);
}

// 게시글 작성
function createPost(title, content, author, community) {
    const stmt = db.prepare('INSERT INTO posts (title, content, author, community) VALUES (?, ?, ?, ?)');
    const result = stmt.run(title, content, author, community);
    return result.lastInsertRowid;
}

// 댓글 작성
function createComment(postId, content, author, parentId = null) {
    const stmt = db.prepare('INSERT INTO comments (post_id, content, author, parent_id) VALUES (?, ?, ?, ?)');
    const result = stmt.run(postId, content, author, parentId);
    return result.lastInsertRowid;
}

// 투표 (업보트/다운보트)
function vote(type, id, scoreChange) {
    const table = type === 'post' ? 'posts' : 'comments';
    const stmt = db.prepare(`UPDATE ${table} SET score = score + ? WHERE id = ?`);
    stmt.run(scoreChange, id);
}

module.exports = {
    getRandomUser,
    getRecentPosts,
    createPost,
    createComment,
    vote
};
