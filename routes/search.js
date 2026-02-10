// 검색 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/search?q=검색어
 * 게시글 제목/내용 검색
 */
router.get('/posts', (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: '검색어를 입력해주세요.' });
        }

        const searchTerm = `%${q}%`;

        // 게시글 검색 쿼리
        const stmt = db.prepare(`
            SELECT
                p.id,
                p.title,
                p.content,
                p.author,
                p.score,
                p.community,
                p.created_at,
                c.name as community_name,
                c.description as community_description
            FROM posts p
            LEFT JOIN communities c ON p.community = c.name
            WHERE p.title LIKE ? OR p.content LIKE ?
            ORDER BY p.created_at DESC
        `);

        const results = stmt.all(searchTerm, searchTerm);

        res.json({
            success: true,
            query: q,
            count: results.length,
            results: results
        });

    } catch (error) {
        console.error('게시글 검색 오류:', error);
        res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    }
});

/**
 * GET /api/search/comments?q=검색어
 * 댓글 검색
 */
router.get('/comments', (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: '검색어를 입력해주세요.' });
        }

        const searchTerm = `%${q}%`;

        // 댓글 검색 쿼리
        const stmt = db.prepare(`
            SELECT
                c.id,
                c.post_id,
                c.content,
                c.author,
                c.score,
                c.created_at,
                p.title as post_title,
                p.community as post_community
            FROM comments c
            LEFT JOIN posts p ON c.post_id = p.id
            WHERE c.content LIKE ?
            ORDER BY c.created_at DESC
        `);

        const results = stmt.all(searchTerm);

        res.json({
            success: true,
            query: q,
            count: results.length,
            results: results
        });

    } catch (error) {
        console.error('댓글 검색 오류:', error);
        res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    }
});

/**
 * GET /api/search?q=검색어
 * 통합 검색 (게시글 + 댓글)
 */
router.get('/', (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: '검색어를 입력해주세요.' });
        }

        const searchTerm = `%${q}%`;

        // 게시글 검색
        const postsStmt = db.prepare(`
            SELECT
                'post' as type,
                id,
                title,
                content,
                author,
                score,
                community,
                created_at,
                NULL as post_title,
                NULL as post_community
            FROM posts
            WHERE title LIKE ? OR content LIKE ?
            ORDER BY created_at DESC
        `);

        const posts = postsStmt.all(searchTerm, searchTerm);

        // 댓글 검색
        const commentsStmt = db.prepare(`
            SELECT
                'comment' as type,
                id,
                content as title,
                content,
                author,
                score,
                post_id as community,
                created_at,
                p.title as post_title,
                p.community as post_community
            FROM comments c
            LEFT JOIN posts p ON c.post_id = p.id
            WHERE c.content LIKE ?
            ORDER BY c.created_at DESC
        `);

        const comments = commentsStmt.all(searchTerm);

        // 결과 병합
        const results = [...posts, ...comments];

        res.json({
            success: true,
            query: q,
            count: results.length,
            results: results
        });

    } catch (error) {
        console.error('통합 검색 오류:', error);
        res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    }
});

module.exports = router;