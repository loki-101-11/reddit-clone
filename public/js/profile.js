// 프로필 페이지 JavaScript
// 작성일: 2026-02-10

// URL에서 username 파라미터 확인 또는 localStorage에서 가져오기
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username') || localStorage.getItem('currentUser');
const usernameElement = document.getElementById('username');
const joinDateElement = document.getElementById('joinDate');
const postsCountElement = document.getElementById('postsCount');
const commentsCountElement = document.getElementById('commentsCount');
const karmaElement = document.getElementById('karma');
const recentPostsElement = document.getElementById('recentPosts');
const recentCommentsElement = document.getElementById('recentComments');
const backBtn = document.getElementById('backBtn');

// 프로필 정보 로드
async function loadProfile() {
    try {
        const response = await fetch(`/api/users/${username}`);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                alert('로그인이 필요합니다.');
                window.location.href = '/';
                return;
            }
            throw new Error(data.error || '프로필을 불러올 수 없습니다.');
        }

        // 사용자 정보 표시
        usernameElement.textContent = data.user.username;
        joinDateElement.textContent = `가입일: ${formatDate(data.user.created_at)}`;

        // 통계 표시
        postsCountElement.textContent = data.stats.posts_count;
        commentsCountElement.textContent = data.stats.comments_count;
        karmaElement.textContent = data.stats.karma;

        // 최근 게시글 렌더링
        renderRecentPosts(data.recent_posts);

        // 최근 댓글 렌더링
        renderRecentComments(data.recent_comments);

    } catch (error) {
        console.error('프로필 로드 에러:', error);
        alert(error.message);
        window.location.href = '/';
    }
}

// 최근 게시글 렌더링
function renderRecentPosts(posts) {
    if (posts.length === 0) {
        recentPostsElement.innerHTML = '<p class="empty-state">게시글이 없습니다.</p>';
        return;
    }

    recentPostsElement.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <span class="post-community">${escapeHtml(post.community)}</span>
                <span class="post-score">▲ ${post.score}</span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-meta">${formatDate(post.created_at)}</p>
        </div>
    `).join('');
}

// 최근 댓글 렌더링
function renderRecentComments(comments) {
    if (comments.length === 0) {
        recentCommentsElement.innerHTML = '<p class="empty-state">댓글이 없습니다.</p>';
        return;
    }

    recentCommentsElement.innerHTML = comments.map(comment => `
        <div class="comment-card">
            <div class="comment-header">
                <span class="comment-score">▲ ${comment.score}</span>
                <span class="comment-post-id">게시글 #${comment.post_id}</span>
            </div>
            <p class="comment-content">${escapeHtml(comment.content)}</p>
            <p class="comment-meta">${formatDate(comment.created_at)}</p>
        </div>
    `).join('');
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR');
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 뒤로가기 버튼
backBtn.addEventListener('click', () => {
    window.history.back();
});

// 페이지 로드 시 프로필 정보 불러오기
document.addEventListener('DOMContentLoaded', loadProfile);