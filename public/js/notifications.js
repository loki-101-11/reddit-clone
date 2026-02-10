// 알림 기능 JavaScript
// 작성일: 2026-02-10

document.addEventListener('DOMContentLoaded', () => {
    const notificationWrapper = document.getElementById('notificationWrapper');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationBadge = document.getElementById('notificationBadge');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationList = document.getElementById('notificationList');
    const markAllReadBtn = document.getElementById('markAllReadBtn');

    let isDropdownOpen = false;

    // 초기화
    checkLoginAndInit();

    // 로그인 상태 변경 감지 (커스텀 이벤트)
    window.addEventListener('login-state-changed', () => {
        checkLoginAndInit();
    });

    // 알림 버튼 클릭
    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
    }

    // 모두 읽음 처리
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await markAllAsRead();
        });
    }

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (isDropdownOpen && !notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
            closeDropdown();
        }
    });

    function checkLoginAndInit() {
        const token = localStorage.getItem('token');
        if (token) {
            notificationWrapper.style.display = 'block';
            fetchUnreadCount();
            // 1분마다 폴링
            setInterval(fetchUnreadCount, 60000);
        } else {
            notificationWrapper.style.display = 'none';
        }
    }

    async function fetchUnreadCount() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/notifications/unread-count', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                updateBadge(data.count);
            }
        } catch (error) {
            console.error('알림 카운트 조회 실패:', error);
        }
    }

    function updateBadge(count) {
        if (count > 0) {
            notificationBadge.textContent = count > 99 ? '99+' : count;
            notificationBadge.style.display = 'block';
        } else {
            notificationBadge.style.display = 'none';
        }
    }

    async function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
        if (isDropdownOpen) {
            notificationDropdown.style.display = 'block';
            await fetchNotifications();
        } else {
            notificationDropdown.style.display = 'none';
        }
    }

    function closeDropdown() {
        isDropdownOpen = false;
        notificationDropdown.style.display = 'none';
    }

    async function fetchNotifications() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            notificationList.innerHTML = '<li class="loading">로딩 중...</li>';

            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                renderNotifications(data.notifications);
            } else {
                notificationList.innerHTML = '<li class="error">알림을 불러올 수 없습니다.</li>';
            }
        } catch (error) {
            console.error('알림 목록 조회 실패:', error);
            notificationList.innerHTML = '<li class="error">알림을 불러올 수 없습니다.</li>';
        }
    }

    function renderNotifications(notifications) {
        if (!notifications || notifications.length === 0) {
            notificationList.innerHTML = '<li class="empty">새로운 알림이 없습니다.</li>';
            return;
        }

        notificationList.innerHTML = '';
        notifications.forEach(noti => {
            const li = document.createElement('li');
            li.className = `notification-item ${noti.is_read ? 'read' : 'unread'}`;
            li.innerHTML = `
                <div class="noti-content">
                    <p class="noti-title">${escapeHtml(noti.title)}</p>
                    <p class="noti-body">${escapeHtml(noti.content)}</p>
                    <span class="noti-time">${formatTime(noti.created_at)}</span>
                </div>
            `;
            
            li.addEventListener('click', async () => {
                if (!noti.is_read) {
                    await markAsRead(noti.id);
                }
                
                // 관련 콘텐츠로 이동
                if (noti.post_id) {
                    window.location.href = `/post.html?id=${noti.post_id}`;
                } else if (noti.related_type === 'post') {
                    // post_id가 없는 경우 (직접 post인 경우)
                    window.location.href = `/post.html?id=${noti.related_id}`;
                } else {
                    // 삭제된 게시글이나 댓글인 경우
                    alert('삭제되었거나 존재하지 않는 콘텐츠입니다.');
                }
            });
            
            notificationList.appendChild(li);
        });
    }

    async function markAsRead(id) {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUnreadCount(); // 뱃지 업데이트
        } catch (error) {
            console.error('읽음 처리 실패:', error);
        }
    }

    async function markAllAsRead() {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/notifications/read-all', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUnreadCount(); // 뱃지 업데이트
            // 목록 다시 불러오기
            fetchNotifications();
        } catch (error) {
            console.error('모두 읽음 처리 실패:', error);
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // 초 단위

        if (diff < 60) return '방금 전';
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        return date.toLocaleDateString();
    }
});