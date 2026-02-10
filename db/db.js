// 데이터베이스 모듈
// 작성일: 2026-02-10

const Database = require('better-sqlite3');
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '..', 'reddit.db');

// 데이터베이스 연결 (읽기/쓰기)
const db = new Database(dbPath);

// 쿼리 실행 시 자동 커밋
db.pragma('journal_mode = WAL');

module.exports = db;