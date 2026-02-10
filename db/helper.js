// 샘플 데이터 삽입 헬퍼 스크립트
const path = require('path');
const db = require(path.join(__dirname, 'db.js'));

function insertPost(community, title, content, author) {
    const info = db.prepare('INSERT INTO posts (community, title, content, author) VALUES (?, ?, ?, ?)').run(community, title, content, author);
    return info.lastInsertRowid;
}

function insertComment(postId, content, author, parentId = null) {
    const info = db.prepare('INSERT INTO comments (post_id, content, author, parent_id) VALUES (?, ?, ?, ?)').run(postId, content, author, parentId);
    return info.lastInsertRowid;
}

const action = process.argv[2];
const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};

if (action === 'post') {
    const id = insertPost(args.community, args.title, args.content, args.author);
    console.log(`Inserted post ID: ${id}`);
} else if (action === 'comment') {
    const id = insertComment(args.postId, args.content, args.author, args.parentId);
    console.log(`Inserted comment ID: ${id}`);
} else if (action === 'getLatest') {
    const post = db.prepare('SELECT * FROM posts WHERE community = ? ORDER BY id DESC LIMIT 1').get(args.community);
    console.log(JSON.stringify(post));
}
