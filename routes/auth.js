// 인증 라우트
// 작성일: 2026-02-10

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db.js');

const router = express.Router();

// JWT 비밀키 (실제 환경에서는 환경 변수 사용)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 회원가입
router.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;

        // 입력 검증
        if (!username || !password) {
            return res.status(400).json({ error: '사용자명과 비밀번호를 입력해주세요.' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: '사용자명은 최소 3자 이상이어야 합니다.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' });
        }

        // 사용자명 중복 확인
        const checkUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

        if (checkUser) {
            return res.status(409).json({ error: '이미 존재하는 사용자명입니다.' });
        }

        // 비밀번호 해싱
        const passwordHash = bcrypt.hashSync(password, 10);

        // 사용자 생성
        const insertUser = db.prepare(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)'
        );

        const result = insertUser.run(username, passwordHash);

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: result.lastInsertRowid, username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            token,
            user: {
                id: result.lastInsertRowid,
                username
            }
        });
    } catch (error) {
        console.error('회원가입 에러:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// 로그인
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        // 입력 검증
        if (!username || !password) {
            return res.status(400).json({ error: '사용자명과 비밀번호를 입력해주세요.' });
        }

        // 사용자 조회
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
        }

        // 비밀번호 검증
        const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: '사용자명 또는 비밀번호가 올바르지 않습니다.' });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '로그인이 완료되었습니다.',
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('로그인 에러:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// 로그아웃
router.post('/logout', (req, res) => {
    // 클라이언트에서 토큰 삭제
    res.json({ message: '로그아웃되었습니다.' });
});

// 현재 사용자 정보 조회
router.get('/me', (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
        }

        const token = authHeader.substring(7);

        // 토큰 검증
        const decoded = jwt.verify(token, JWT_SECRET);

        // 사용자 정보 조회
        const user = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        res.json({ user });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
        }
        console.error('사용자 정보 조회 에러:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;