document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('statusText');
    const statusIcon = document.getElementById('statusIcon');
    const lastRunTime = document.getElementById('lastRunTime');
    const toggleBtn = document.getElementById('toggleBtn');
    const triggerBtn = document.getElementById('triggerBtn');
    const logContainer = document.getElementById('logContainer');

    let workerEnabled = false;

    // 초기 상태 로드
    fetchStatus();
    fetchLogs();

    // 상태 업데이트 함수
    async function fetchStatus() {
        try {
            const res = await fetch('/api/worker/status');
            const data = await res.json();
            workerEnabled = data.enabled;
            updateUI(data);
        } catch (error) {
            console.error('Failed to fetch status:', error);
            statusText.textContent = 'Error fetching status';
        }
    }

    // 로그 업데이트 함수
    async function fetchLogs() {
        try {
            const res = await fetch('/api/worker/logs');
            const logs = await res.json();
            logContainer.innerHTML = '';
            logs.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                
                const timeSpan = document.createElement('span');
                timeSpan.className = 'log-time';
                timeSpan.textContent = new Date(log.timestamp).toLocaleTimeString();
                
                const msgSpan = document.createElement('span');
                msgSpan.textContent = log.message;
                
                logEntry.appendChild(timeSpan);
                logEntry.appendChild(msgSpan);
                logContainer.appendChild(logEntry);
            });
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    }

    // UI 업데이트 함수
    function updateUI(data) {
        statusText.textContent = workerEnabled ? 'Running' : 'Stopped';
        statusIcon.className = `status-indicator ${workerEnabled ? 'status-active' : 'status-inactive'}`;
        lastRunTime.textContent = data.lastRun ? new Date(data.lastRun).toLocaleString() : 'Never';
        
        toggleBtn.textContent = workerEnabled ? 'Stop Worker' : 'Start Worker';
        toggleBtn.className = `btn-toggle ${workerEnabled ? 'btn-disable' : 'btn-enable'}`;
    }

    // 버튼 이벤트 리스너
    toggleBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/worker/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: !workerEnabled })
            });
            const data = await res.json();
            if (data.success) {
                workerEnabled = data.enabled;
                fetchStatus(); // Refresh status
            }
        } catch (error) {
            console.error('Error toggling worker:', error);
        }
    });

    triggerBtn.addEventListener('click', async () => {
        try {
            triggerBtn.disabled = true;
            triggerBtn.textContent = 'Working...';
            const res = await fetch('/api/worker/trigger', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                console.log('Task result:', data.result);
                fetchLogs();
                fetchStatus();
            } else {
                alert('Failed to trigger task: ' + data.error);
            }
        } catch (error) {
            console.error('Error triggering worker:', error);
        } finally {
            triggerBtn.disabled = false;
            triggerBtn.textContent = 'Trigger Action Now';
        }
    });

    // 주기적으로 상태 갱신
    setInterval(() => {
        fetchStatus();
        fetchLogs();
    }, 5000);
});
