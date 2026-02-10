// 고급 데이터 조작 헬퍼 스크립트
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

function vote(type, id, action) {
    const table = type === 'post' ? 'posts' : 'comments';
    const delta = action === 'upvote' ? 1 : -1;
    db.prepare(`UPDATE ${table} SET score = score + ? WHERE id = ?`).run(delta, id);
    return db.prepare(`SELECT score FROM ${table} WHERE id = ?`).get(id).score;
}

const action = process.argv[2];
const args = JSON.parse(process.argv[3] || '{}');

try {
    if (action === 'post') {
        const id = insertPost(args.community, args.title, args.content, args.author);
        console.log(`Inserted post ID: ${id}`);
    } else if (action === 'comment') {
        const id = insertComment(args.postId, args.content, args.author, args.parentId);
        console.log(`Inserted comment ID: ${id}`);
    } else if (action === 'listPosts') {
        const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT ?').all(args.limit || 10);
        console.log(JSON.stringify(posts));
    } else if (action === 'listComments') {
        const comments = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC').all(args.postId);
        console.log(JSON.stringify(comments));
    } else if (action === 'vote') {
        const newScore = vote(args.type, args.id, args.action);
        console.log(`Updated ${args.type} ${args.id} score to: ${newScore}`);
    } else if (action === 'listCommunities') {
        const list = db.prepare('SELECT name FROM communities').all();
        console.log(JSON.stringify(list));
    }
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
