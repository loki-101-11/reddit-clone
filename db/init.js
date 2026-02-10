// 데이터베이스 초기화 스크립트
// 작성일: 2026-02-10

const Database = require('better-sqlite3');
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '..', 'reddit.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// 데이터베이스 연결
const db = new Database(dbPath);

// 스키마 적용
const schema = require('fs').readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// 초기 커뮤니티 데이터 추가
const initialCommunities = [
    { name: 'general', description: '일반적인 대화 및 정보 공유' },
    { name: 'programming', description: '프로그래밍 및 개발 관련' },
    { name: 'news', description: '뉴스 및 정보' },
    { name: 'funny', description: '유머 및 재미있는 내용' }
];

const insertCommunity = db.prepare('INSERT OR IGNORE INTO communities (name, description) VALUES (?, ?)');
initialCommunities.forEach(community => {
    insertCommunity.run(community.name, community.description);
});

console.log('✅ 데이터베이스 초기화 완료!');
console.log('📁 데이터베이스 파일: ' + dbPath);
console.log('📊 초기 커뮤니티: ' + initialCommunities.length + '개');

// 연결 종료
db.close();