// 댓글 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

console.log('Comments router loaded');

// GET /api/posts/:id/comments - 게시글의 모든 댓글 조회
router.get('/posts/:id/comments', (req, res) => {
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

        // 댓글 조회 (대댓글 포함)
        const comments = db.prepare(`
            SELECT * FROM comments
            WHERE post_id = ?
            ORDER BY created_at ASC
        `).all(id);

        res.json({
            success: true,
            data: comments,
            message: '댓글 조회 완료'
        });
    } catch (error) {
        console.error('댓글 조회 에러:', error);
        res.status(500).json({
            success: false,
            error: '댓글 조회 실패'
        });
    }
});

// POST /api/posts/:id/comments - 댓글 작성
router.post('/posts/:id/comments', (req, res) => {
    try {
        const { id } = req.params;
        const { content, author, parent_id } = req.body;

        // 게시글 존재 확인
        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: '게시글을 찾을 수 없습니다'
            });
        }

        // 댓글 내용 유효성 검사
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                error: '댓글 내용을 입력해주세요'
            });
        }

        if (!author || !author.trim()) {
            return res.status(400).json({
                success: false,
                error: '작성자를 입력해주세요'
            });
        }

        // 대댓글인 경우 부모 댓글 존재 확인
        if (parent_id) {
            const parentComment = db.prepare('SELECT * FROM comments WHERE id = ?').get(parent_id);

            if (!parentComment) {
                return res.status(404).json({
                    success: false,
                    error: '부모 댓글을 찾을 수 없습니다'
                });
            }

            // 부모 댓글이 동일한 게시글에 있는지 확인
            if (parentComment.post_id !== parseInt(id)) {
                return res.status(400).json({
                    success: false,
                    error: '부모 댓글이 다른 게시글에 있습니다'
                });
            }
        }

        // 댓글 생성
        const result = db.prepare(`
            INSERT INTO comments (post_id, parent_id, content, author, score)
            VALUES (?, ?, ?, ?, 0)
        `).run(id, parent_id || null, content.trim(), author.trim());

        const newComment = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            data: newComment,
            message: '댓글 작성 완료'
        });
    } catch (error) {
        console.error('댓글 작성 에러:', error);
        res.status(500).json({
            success: false,
            error: '댓글 작성 실패'
        });
    }
});

// DELETE /api/comments/:id - 댓글 삭제
router.delete('/comments/:id', (req, res) => {
    try {
        const { id } = req.params;

        // 댓글 존재 확인
        const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                error: '댓글을 찾을 수 없습니다'
            });
        }

        // 대댓글이 있는지 확인
        const hasReplies = db.prepare('SELECT COUNT(*) as count FROM comments WHERE parent_id = ?').get(id);

        if (hasReplies.count > 0) {
            return res.status(400).json({
                success: false,
                error: '대댓글이 있는 댓글은 삭제할 수 없습니다'
            });
        }

        // 댓글 삭제
        const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id);

        res.json({
            success: true,
            message: '댓글 삭제 완료'
        });
    } catch (error) {
        console.error('댓글 삭제 에러:', error);
        res.status(500).json({
            success: false,
            error: '댓글 삭제 실패'
        });
    }
});

module.exports = router;