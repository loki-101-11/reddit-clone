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

module.exports = { insertPost, insertComment };