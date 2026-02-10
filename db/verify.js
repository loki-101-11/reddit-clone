// 데이터베이스 검증 스크립트
// 작성일: 2026-02-10

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'reddit.db');
const db = new Database(dbPath);

console.log('📊 데이터베이스 테이블 확인:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(table => {
    console.log('  -', table.name);
});

console.log('\n👥 커뮤니티 목록:');
const communities = db.prepare('SELECT * FROM communities').all();
communities.forEach(c => {
    console.log(`  - ${c.name}: ${c.description}`);
});

console.log('\n📝 게시글 수:', db.prepare('SELECT COUNT(*) as count FROM posts').get().count);
console.log('💬 댓글 수:', db.prepare('SELECT COUNT(*) as count FROM comments').get().count);

db.close();