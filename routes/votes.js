// 투표 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

console.log('Votes router loaded');

// POST /api/posts/:id/upvote - 게시글 업보트
router.post('/:id/upvote', (req, res) => {
    try {
        const { id } = req.params;

        // 게시글 존재 확인
        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: '게시글을 찾을 수 없습니다'
            });
        }

        // 점수 업데이트 (+1)
        const result = db.prepare(`
            UPDATE posts
            SET score = score + 1
            WHERE id = ?
        `).run(id);

        const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        res.json({
            success: true,
            data: updatedPost,
            message: '업보트 완료'
        });
    } catch (error) {
        console.error('업보트 에러:', error);
        res.status(500).json({
            success: false,
            error: '업보트 실패'
        });
    }
});

// POST /api/posts/:id/downvote - 게시글 다운보트
router.post('/:id/downvote', (req, res) => {
    try {
        const { id } = req.params;

        // 게시글 존재 확인
        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: '게시글을 찾을 수 없습니다'
            });
        }

        // 점수 업데이트 (-1)
        const result = db.prepare(`
            UPDATE posts
            SET score = score - 1
            WHERE id = ?
        `).run(id);

        const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        res.json({
            success: true,
            data: updatedPost,
            message: '다운보트 완료'
        });
    } catch (error) {
        console.error('다운보트 에러:', error);
        res.status(500).json({
            success: false,
            error: '다운보트 실패'
        });
    }
});

module.exports = router;