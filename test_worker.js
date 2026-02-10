const worker = require('./scripts/worker_controller');

async function test() {
    console.log('Testing worker controller...');
    
    // Enable worker
    worker.setEnabled(true);
    console.log('Worker enabled:', worker.getStatus().enabled);
    
    // Run task manually
    try {
        const result = await worker.runTask();
        console.log('Task result:', result);
    } catch (e) {
        console.error('Task failed:', e);
    }
    
    // Check logs
    console.log('Logs:', worker.getLogs());
}

test();
