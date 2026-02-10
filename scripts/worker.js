const worker = require('./worker_controller');

// Standalone worker script
// This script runs the worker loop continuously.

const INTERVAL = 60 * 1000; // 1 minute

console.log('Starting standalone worker...');
worker.setEnabled(true);

setInterval(async () => {
    try {
        console.log('Running worker task...');
        const result = await worker.runTask();
        console.log('Task result:', result);
    } catch (e) {
        console.error('Worker task error:', e);
    }
}, INTERVAL);

// Keep alive
process.stdin.resume();
