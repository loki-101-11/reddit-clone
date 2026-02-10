// 데이터베이스 스키마 변경 (이미지 URL 추가)
// 작성일: 2026-02-10

const db = require('./db.js');

try {
    // posts 테이블에 image_url 컬럼 추가
    console.log('Adding image_url column to posts table...');
    
    // 컬럼이 이미 존재하는지 확인
    const checkQuery = `
        SELECT count(*) as count 
        FROM pragma_table_info('posts') 
        WHERE name = 'image_url'
    `;
    
    const result = db.prepare(checkQuery).get();
    
    if (result.count === 0) {
        db.prepare('ALTER TABLE posts ADD COLUMN image_url TEXT').run();
        console.log('✅ image_url column added successfully.');
    } else {
        console.log('ℹ️ image_url column already exists.');
    }
    
} catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
}
