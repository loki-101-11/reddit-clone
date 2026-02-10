// 프로필 API 테스트
// 작성일: 2026-02-10

const db = require('better-sqlite3')('reddit.db');

console.log('=== 프로필 API 테스트 ===\n');

// 테스트 사용자
const testUser = 'testuser123';

// 1. 사용자 정보 조회
console.log('1. 사용자 정보 조회:');
const user = db.prepare('SELECT id, username, created_at FROM users WHERE username = ?').get(testUser);
console.log('   사용자:', user);

// 2. 게시글 수
const postsCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE author = ?').get(testUser);
console.log('   게시글 수:', postsCount.count);

// 3. 댓글 수
const commentsCount = db.prepare('SELECT COUNT(*) as count FROM comments WHERE author = ?').get(testUser);
console.log('   댓글 수:', commentsCount.count);

// 4. 카르마 점수
const karma = db.prepare(`
    SELECT COALESCE(SUM(posts.score), 0) + COALESCE(SUM(comments.score), 0) as karma
    FROM posts
    LEFT JOIN comments ON posts.author = comments.author
    WHERE posts.author = ?
    GROUP BY posts.author
`).get(testUser);
console.log('   카르마 점수:', karma ? karma.karma : 0);

// 5. 최근 게시글 5개
const recentPosts = db.prepare(`
    SELECT id, title, score, community, created_at
    FROM posts
    WHERE author = ?
    ORDER BY created_at DESC
    LIMIT 5
`).all(testUser);
console.log('   최근 게시글:', recentPosts.length, '개');
recentPosts.forEach(post => {
    console.log(`     - ${post.title} (${post.community}) - ${post.score}점`);
});

// 6. 최근 댓글 5개
const recentComments = db.prepare(`
    SELECT id, content, score, post_id, created_at
    FROM comments
    WHERE author = ?
    ORDER BY created_at DESC
    LIMIT 5
`).all(testUser);
console.log('   최근 댓글:', recentComments.length, '개');
recentComments.forEach(comment => {
    console.log(`     - 게시글 #${comment.post_id} (${comment.score}점)`);
});

console.log('\n✅ 테스트 완료!');

db.close();