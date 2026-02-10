// 사용자 관련 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db/db');

/**
 * GET /api/users/:username
 * 사용자 정보 조회
 */
router.get('/:username', (req, res) => {
    try {
        const { username } = req.params;

        // 사용자 정보 조회
        const user = db.prepare('SELECT id, username, created_at FROM users WHERE username = ?').get(username);

        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자의 게시글 수, 댓글 수, 카르마 점수 계산
        const posts = db.prepare('SELECT COUNT(*) as count FROM posts WHERE author = ?').get(username);
        const comments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE author = ?').get(username);

        // 카르마 점수 계산 (게시글 + 댓글의 score 합계)
        const karma = db.prepare(`
            SELECT COALESCE(SUM(posts.score), 0) + COALESCE(SUM(comments.score), 0) as karma
            FROM posts
            LEFT JOIN comments ON posts.author = comments.author
            WHERE posts.author = ?
        `).get(username);

        // 최근 게시글 5개 조회
        const recentPosts = db.prepare(`
            SELECT id, title, score, community, created_at
            FROM posts
            WHERE author = ?
            ORDER BY created_at DESC
            LIMIT 5
        `).all(username);

        // 최근 댓글 5개 조회
        const recentComments = db.prepare(`
            SELECT id, content, score, post_id, created_at
            FROM comments
            WHERE author = ?
            ORDER BY created_at DESC
            LIMIT 5
        `).all(username);

        res.json({
            user: {
                id: user.id,
                username: user.username,
                created_at: user.created_at
            },
            stats: {
                posts_count: posts.count,
                comments_count: comments.count,
                karma: karma.karma
            },
            recent_posts: recentPosts,
            recent_comments: recentComments
        });
    } catch (error) {
        console.error('사용자 정보 조회 에러:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;