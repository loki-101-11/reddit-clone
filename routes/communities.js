// 커뮤니티 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

console.log('Communities router loaded');

// GET /api/communities - 모든 커뮤니티 목록 조회
router.get('/', (req, res) => {
    try {
        const communities = db.prepare(`
            SELECT * FROM communities
            ORDER BY name ASC
        `).all();

        res.json({
            success: true,
            data: communities,
            message: '커뮤니티 목록 조회 완료'
        });
    } catch (error) {
        console.error('커뮤니티 목록 조회 에러:', error);
        res.status(500).json({
            success: false,
            error: '커뮤니티 목록 조회 실패'
        });
    }
});

// POST /api/communities - 새 커뮤니티 생성
router.post('/', (req, res) => {
    try {
        const { name, description } = req.body;

        // 커뮤니티 이름 유효성 검사
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                error: '커뮤니티 이름을 입력해주세요'
            });
        }

        if (name.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: '커뮤니티 이름은 최소 3자 이상이어야 합니다'
            });
        }

        if (name.trim().length > 50) {
            return res.status(400).json({
                success: false,
                error: '커뮤니티 이름은 최대 50자 이하여야 합니다'
            });
        }

        // 중복 커뮤니티 이름 확인
        const existingCommunity = db.prepare('SELECT * FROM communities WHERE name = ?').get(name.trim());

        if (existingCommunity) {
            return res.status(409).json({
                success: false,
                error: '이미 존재하는 커뮤니티 이름입니다'
            });
        }

        // 커뮤니티 생성
        const result = db.prepare(`
            INSERT INTO communities (name, description)
            VALUES (?, ?)
        `).run(name.trim(), description ? description.trim() : null);

        const newCommunity = db.prepare('SELECT * FROM communities WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            data: newCommunity,
            message: '커뮤니티 생성 완료'
        });
    } catch (error) {
        console.error('커뮤니티 생성 에러:', error);
        res.status(500).json({
            success: false,
            error: '커뮤니티 생성 실패'
        });
    }
});

// GET /api/communities/:name/posts - 특정 커뮤니티의 게시글 조회
router.get('/:name/posts', (req, res) => {
    try {
        const { name } = req.params;

        // 커뮤니티 존재 확인
        const community = db.prepare('SELECT * FROM communities WHERE name = ?').get(name);

        if (!community) {
            return res.status(404).json({
                success: false,
                error: '커뮤니티를 찾을 수 없습니다'
            });
        }

        // 커뮤니티별 게시글 조회
        const posts = db.prepare(`
            SELECT * FROM posts
            WHERE community = ?
            ORDER BY created_at DESC
        `).all(name);

        res.json({
            success: true,
            data: posts,
            message: '커뮤니티 게시글 조회 완료'
        });
    } catch (error) {
        console.error('커뮤니티 게시글 조회 에러:', error);
        res.status(500).json({
            success: false,
            error: '커뮤니티 게시글 조회 실패'
        });
    }
});

module.exports = router;