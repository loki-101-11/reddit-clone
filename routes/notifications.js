// 알림 API 라우트
// 작성일: 2026-02-10

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

/**
 * GET /api/notifications
 * 사용자 알림 목록 조회
 */
router.get('/', (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: '인증이 필요합니다.' });
        }

        // 알림 목록 조회 (post_id 포함)
        const stmt = db.prepare(`
            SELECT
                n.id,
                n.type,
                n.title,
                n.content,
                n.related_id,
                n.related_type,
                n.is_read,
                n.created_at,
                CASE 
                    WHEN n.related_type = 'post' THEN n.related_id
                    WHEN n.related_type = 'comment' THEN c.post_id
                    ELSE NULL
                END as post_id
            FROM notifications n
            LEFT JOIN comments c ON n.related_type = 'comment' AND n.related_id = c.id
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC
        `);

        const notifications = stmt.all(userId);

        res.json({
            success: true,
            count: notifications.length,
            notifications: notifications
        });

    } catch (error) {
        console.error('알림 목록 조회 오류:', error);
        res.status(500).json({ error: '알림 목록 조회 중 오류가 발생했습니다.' });
    }
});

/**
 * GET /api/notifications/unread-count
 * 읽지 않은 알림 개수 조회
 */
router.get('/unread-count', (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: '인증이 필요합니다.' });
        }

        const stmt = db.prepare(`
            SELECT COUNT(*) as count
            FROM notifications
            WHERE user_id = ? AND is_read = 0
        `);

        const result = stmt.get(userId);

        res.json({
            success: true,
            count: result.count
        });

    } catch (error) {
        console.error('읽지 않은 알림 개수 조회 오류:', error);
        res.status(500).json({ error: '알림 개수 조회 중 오류가 발생했습니다.' });
    }
});

/**
 * PUT /api/notifications/:id/read
 * 알림 읽음 처리
 */
router.put('/:id/read', (req, res) => {
    try {
        const userId = req.user?.id;
        const notificationId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: '인증이 필요합니다.' });
        }

        // 알림 소유권 확인
        const checkStmt = db.prepare(`
            SELECT id FROM notifications
            WHERE id = ? AND user_id = ?
        `);

        const notification = checkStmt.get(notificationId, userId);

        if (!notification) {
            return res.status(404).json({ error: '알림을 찾을 수 없습니다.' });
        }

        // 읽음 처리
        const updateStmt = db.prepare(`
            UPDATE notifications
            SET is_read = 1
            WHERE id = ?
        `);

        updateStmt.run(notificationId);

        res.json({
            success: true,
            message: '알림을 읽음 처리했습니다.'
        });

    } catch (error) {
        console.error('알림 읽음 처리 오류:', error);
        res.status(500).json({ error: '알림 읽음 처리 중 오류가 발생했습니다.' });
    }
});

/**
 * PUT /api/notifications/read-all
 * 모든 알림 읽음 처리
 */
router.put('/read-all', (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: '인증이 필요합니다.' });
        }

        const updateStmt = db.prepare(`
            UPDATE notifications
            SET is_read = 1
            WHERE user_id = ? AND is_read = 0
        `);

        const result = updateStmt.run(userId);

        res.json({
            success: true,
            message: `${result.changes}개의 알림을 읽음 처리했습니다.`,
            count: result.changes
        });

    } catch (error) {
        console.error('모든 알림 읽음 처리 오류:', error);
        res.status(500).json({ error: '알림 읽음 처리 중 오류가 발생했습니다.' });
    }
});

/**
 * DELETE /api/notifications/:id
 * 알림 삭제
 */
router.delete('/:id', (req, res) => {
    try {
        const userId = req.user?.id;
        const notificationId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: '인증이 필요합니다.' });
        }

        // 알림 소유권 확인
        const checkStmt = db.prepare(`
            SELECT id FROM notifications
            WHERE id = ? AND user_id = ?
        `);

        const notification = checkStmt.get(notificationId, userId);

        if (!notification) {
            return res.status(404).json({ error: '알림을 찾을 수 없습니다.' });
        }

        // 알림 삭제
        const deleteStmt = db.prepare(`
            DELETE FROM notifications
            WHERE id = ?
        `);

        deleteStmt.run(notificationId);

        res.json({
            success: true,
            message: '알림을 삭제했습니다.'
        });

    } catch (error) {
        console.error('알림 삭제 오류:', error);
        res.status(500).json({ error: '알림 삭제 중 오류가 발생했습니다.' });
    }
});

/**
 * POST /api/notifications/create
 * 알림 생성 (내부용)
 */
router.post('/create', (req, res) => {
    try {
        const { userId, type, title, content, relatedId, relatedType } = req.body;

        if (!userId || !type || !title) {
            return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
        }

        const insertStmt = db.prepare(`
            INSERT INTO notifications (user_id, type, title, content, related_id, related_type)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = insertStmt.run(userId, type, title, content, relatedId, relatedType);

        res.json({
            success: true,
            message: '알림이 생성되었습니다.',
            notificationId: result.lastInsertRowid
        });

    } catch (error) {
        console.error('알림 생성 오류:', error);
        res.status(500).json({ error: '알림 생성 중 오류가 발생했습니다.' });
    }
});

module.exports = router;