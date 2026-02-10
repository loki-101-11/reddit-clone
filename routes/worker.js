const express = require('express');
const router = express.Router();
const worker = require('../scripts/worker_controller'); // This will be the main logic controller

// 워커 상태 조회
router.get('/status', (req, res) => {
    res.json(worker.getStatus());
});

// 워커 활성화/비활성화
router.post('/toggle', (req, res) => {
    const { enabled } = req.body;
    worker.setEnabled(enabled);
    res.json({ success: true, enabled: worker.getStatus().enabled });
});

// 워커 로그 조회
router.get('/logs', (req, res) => {
    res.json(worker.getLogs());
});

// 워커 수동 트리거
router.post('/trigger', async (req, res) => {
    try {
        const result = await worker.runTask();
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
