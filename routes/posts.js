// 게시글 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

console.log('Posts router loaded');

// Multer 설정 (이미지 업로드)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('이미지 파일만 업로드 가능합니다.'));
        }
    }
});

// GET /api/posts - 전체 게시글 조회
router.get('/', (req, res) => {
    try {
        const { community } = req.query;

        let sql = 'SELECT * FROM posts';
        const params = [];

        if (community) {
            sql += ' WHERE community = ?';
            params.push(community);
        }

        sql += ' ORDER BY created_at DESC';
        const posts = db.prepare(sql).all(...params);

        res.json({
            success: true,
            data: posts,
            count: posts.length
        });
    } catch (error) {
        console.error('게시글 조회 에러:', error);
        res.status(500).json({
            success: false,
            error: '게시글 조회 실패'
        });
    }
});

// GET /api/posts/:id - 단일 게시글 조회
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                error: '게시글을 찾을 수 없습니다'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('게시글 조회 에러:', error);
        res.status(500).json({
            success: false,
            error: '게시글 조회 실패'
        });
    }
});

// POST /api/posts - 게시글 생성
router.post('/', upload.single('image'), (req, res) => {
    try {
        const { title, content, author, community } = req.body;
        
        // 이미지 파일 처리
        let image_url = null;
        if (req.file) {
            image_url = '/uploads/' + req.file.filename;
        }

        if (!title || !content || !author || !community) {
            return res.status(400).json({
                success: false,
                error: '필수 필드가 누락되었습니다: title, content, author, community'
            });
        }

        const result = db.prepare(`
            INSERT INTO posts (title, content, author, community, image_url)
            VALUES (?, ?, ?, ?, ?)
        `).run(title, content, author, community, image_url);

        const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            data: newPost,
            message: '게시글이 생성되었습니다'
        });
    } catch (error) {
        console.error('게시글 생성 에러:', error);
        res.status(500).json({
            success: false,
            error: '게시글 생성 실패'
        });
    }
});

// PUT /api/posts/:id - 게시글 수정
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        const existingPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                error: '게시글을 찾을 수 없습니다'
            });
        }

        const result = db.prepare(`
            UPDATE posts
            SET title = COALESCE(?, title),
                content = COALESCE(?, content),
                author = COALESCE(?, author)
            WHERE id = ?
        `).run(title, content, author, id);

        const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        res.json({
            success: true,
            data: updatedPost,
            message: '게시글이 수정되었습니다'
        });
    } catch (error) {
        console.error('게시글 수정 에러:', error);
        res.status(500).json({
            success: false,
            error: '게시글 수정 실패'
        });
    }
});

// DELETE /api/posts/:id - 게시글 삭제
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;

        const existingPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!existingPost) {
            return res.status(404).json({
                success: false,
                error: '게시글을 찾을 수 없습니다'
            });
        }

        db.prepare('DELETE FROM posts WHERE id = ?').run(id);

        res.json({
            success: true,
            message: '게시글이 삭제되었습니다'
        });
    } catch (error) {
        console.error('게시글 삭제 에러:', error);
        res.status(500).json({
            success: false,
            error: '게시글 삭제 실패'
        });
    }
});

module.exports = router;