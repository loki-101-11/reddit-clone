const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

// Socket.io 인스턴스 (server.js에서 전달받음)
let io = null;

// Socket.io 인스턴스 설정
function setIo(instance) {
    io = instance;
}

// 게시글 업보트 이벤트
router.post('/posts/:id/upvote', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        // 게시글 업보트
        const upvoteQuery = `
            INSERT INTO post_votes (post_id, user_id, vote_type)
            VALUES (?, ?, 'up')
            ON CONFLICT(post_id, user_id) DO UPDATE SET vote_type = 'up'
        `;
        db.run(upvoteQuery, [id, userId]);

        // 점수 업데이트
        const scoreQuery = `
            UPDATE posts
            SET score = score + 1
            WHERE id = ?
        `;
        db.run(scoreQuery, [id]);

        // 게시글 정보 가져오기
        const postQuery = `
            SELECT p.*, u.username
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `;
        const post = db.prepare(postQuery).get(id);

        // Socket.io로 실시간 알림 전송
        if (io) {
            io.emit('post_upvoted', {
                postId: id,
                post: post,
                userId: userId,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ success: true, score: post.score });
    } catch (error) {
        console.error('Error upvoting post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 게시글 다운보트 이벤트
router.post('/posts/:id/downvote', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        // 게시글 다운보트
        const downvoteQuery = `
            INSERT INTO post_votes (post_id, user_id, vote_type)
            VALUES (?, ?, 'down')
            ON CONFLICT(post_id, user_id) DO UPDATE SET vote_type = 'down'
        `;
        db.run(downvoteQuery, [id, userId]);

        // 점수 업데이트
        const scoreQuery = `
            UPDATE posts
            SET score = score - 1
            WHERE id = ?
        `;
        db.run(scoreQuery, [id]);

        // 게시글 정보 가져오기
        const postQuery = `
            SELECT p.*, u.username
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `;
        const post = db.prepare(postQuery).get(id);

        // Socket.io로 실시간 알림 전송
        if (io) {
            io.emit('post_downvoted', {
                postId: id,
                post: post,
                userId: userId,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ success: true, score: post.score });
    } catch (error) {
        console.error('Error downvoting post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 댓글 작성 이벤트
router.post('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const { content, authorId, parentId } = req.body;

    try {
        // 댓글 생성
        const commentQuery = `
            INSERT INTO comments (post_id, parent_id, content, author_id)
            VALUES (?, ?, ?, ?)
        `;
        const result = db.prepare(commentQuery).run(id, parentId || null, content, authorId);
        const commentId = result.lastInsertRowid;

        // 댓글 정보 가져오기
        const commentQuery2 = `
            SELECT c.*, u.username
            FROM comments c
            LEFT JOIN users u ON c.author_id = u.id
            WHERE c.id = ?
        `;
        const comment = db.prepare(commentQuery2).get(commentId);

        // 게시글 정보 가져오기
        const postQuery = `
            SELECT p.*, u.username as author_username
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `;
        const post = db.prepare(postQuery).get(id);

        // Socket.io로 실시간 알림 전송
        if (io) {
            io.emit('new_comment', {
                postId: id,
                post: post,
                comment: comment,
                userId: authorId,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ success: true, comment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 댓글 삭제 이벤트
router.delete('/comments/:id', (req, res) => {
    const { id } = req.params;

    try {
        // 댓글 삭제
        const commentQuery = `
            DELETE FROM comments
            WHERE id = ?
        `;
        db.prepare(commentQuery).run(id);

        // 게시글 ID 가져오기
        const postQuery = `
            SELECT post_id
            FROM comments
            WHERE id = ?
        `;
        const comment = db.prepare(postQuery).get(id);
        const postId = comment.post_id;

        // Socket.io로 실시간 알림 전송
        if (io) {
            io.emit('comment_removed', {
                postId: postId,
                commentId: id,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 게시글 작성 이벤트
router.post('/posts', (req, res) => {
    const { title, content, authorId, community } = req.body;

    try {
        // 게시글 생성
        const postQuery = `
            INSERT INTO posts (title, content, author_id, community)
            VALUES (?, ?, ?, ?)
        `;
        const result = db.prepare(postQuery).run(title, content, authorId, community);
        const postId = result.lastInsertRowid;

        // 게시글 정보 가져오기
        const postQuery2 = `
            SELECT p.*, u.username
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        `;
        const post = db.prepare(postQuery2).get(postId);

        // Socket.io로 실시간 알림 전송
        if (io) {
            io.emit('new_post', {
                postId: postId,
                post: post,
                userId: authorId,
                timestamp: new Date().toISOString()
            });
        }

        res.json({ success: true, post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = { router, setIo };