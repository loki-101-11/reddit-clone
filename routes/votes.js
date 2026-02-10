// 투표 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

        // 알림 생성 로직
        try {
            let voterName = 'Someone';
            let isSelfVote = false;

            // 토큰에서 투표자 정보 확인
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                try {
                    const decoded = jwt.verify(token, JWT_SECRET);
                    voterName = decoded.username;
                    if (voterName === post.author) {
                        isSelfVote = true;
                    }
                } catch (e) {
                    // 토큰 검증 실패 시 무시
                }
            }

            // 본인 게시글 투표가 아닌 경우에만 알림
            if (!isSelfVote) {
                const targetUser = db.prepare('SELECT id FROM users WHERE username = ?').get(post.author);
                
                if (targetUser) {
                    db.prepare(`
                        INSERT INTO notifications (user_id, type, title, content, related_id, related_type)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `).run(
                        targetUser.id, 
                        'upvote_post', 
                        `"${post.title}" 게시글이 추천받았습니다`, 
                        `${voterName}님이 회원님의 게시글을 추천했습니다.`, 
                        id, 
                        'post'
                    );
                }
            }
        } catch (notiError) {
            console.error('알림 생성 실패:', notiError);
        }

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