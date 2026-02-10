// Reddit Clone - JavaScript 로직
// 작성일: 2026-02-10

// 인증 상태 확인 유틸리티 (auth.js의 함수들을 직접 사용하거나 로컬 정의)
function getLocalToken() {
    return localStorage.getItem('authToken');
}

function getLocalAuthHeaders() {
    const token = getLocalToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

// ========================================
// 1. 상태 관리
// ========================================
const state = {
    posts: [],
    communities: [],
    currentCommunity: null,
    currentUser: null
};

// ========================================
// 2. API 함수
// ========================================

// 게시글 목록 조회
async function fetchPosts(community = null) {
    try {
        const url = community
            ? `/api/communities/${community}/posts`
            : '/api/posts';
        const response = await fetch(url);
        if (!response.ok) throw new Error('게시글을 불러오는데 실패했습니다.');
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('게시글 조회 오류:', error);
        return [];
    }
}

// 게시글 상세 조회
async function fetchPost(id) {
    try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('게시글을 불러오는데 실패했습니다.');
        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('게시글 조회 오류:', error);
        return null;
    }
}

// 게시글 작성
async function createPost(postData) {
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: getLocalAuthHeaders(),
            body: JSON.stringify(postData)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || '게시글을 작성하는데 실패했습니다.');
        }
        return result;
    } catch (error) {
        console.error('게시글 작성 오류:', error);
        throw error;
    }
}

// 게시글 수정
async function updatePost(id, postData) {
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            headers: getLocalAuthHeaders(),
            body: JSON.stringify(postData)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || '게시글을 수정하는데 실패했습니다.');
        return result;
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        throw error;
    }
}

// 게시글 삭제
async function deletePost(id) {
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
            headers: getLocalAuthHeaders()
        });
        if (!response.ok) throw new Error('게시글을 삭제하는데 실패했습니다.');
        return true;
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        throw error;
    }
}

// 게시글 투표
async function votePost(id, action) {
    try {
        const response = await fetch(`/api/posts/${id}/${action}`, {
            method: 'POST',
            headers: getLocalAuthHeaders()
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || '투표 실패');
        }
        return result;
    } catch (error) {
        console.error('투표 오류:', error);
        throw error;
    }
}

// 댓글 조회
async function fetchComments(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (!response.ok) throw new Error('댓글을 불러오는데 실패했습니다.');
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('댓글 조회 오류:', error);
        return [];
    }
}

// 댓글 작성
async function createComment(postId, commentData) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: getLocalAuthHeaders(),
            body: JSON.stringify(commentData)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || '댓글 작성 실패');
        }
        return result;
    } catch (error) {
        console.error('댓글 작성 오류:', error);
        throw error;
    }
}

// 댓글 삭제
async function deleteComment(id) {
    try {
        const response = await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
            headers: getLocalAuthHeaders()
        });
        if (!response.ok) throw new Error('댓글을 삭제하는데 실패했습니다.');
        return true;
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        throw error;
    }
}

// 커뮤니티 목록 조회
async function fetchCommunities() {
    try {
        const response = await fetch('/api/communities');
        if (!response.ok) throw new Error('커뮤니티를 불러오는데 실패했습니다.');
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('커뮤니티 조회 오류:', error);
        return [];
    }
}

// ========================================
// 3. UI 렌더링 함수
// ========================================

// 커뮤니티 목록 렌더링
function renderCommunities(communities) {
    const communityList = document.getElementById('communityList');
    const postCommunitySelect = document.getElementById('postCommunity');

    if (communityList) {
        communityList.innerHTML = communities.map(community => `
            <li class="${state.currentCommunity === community.name ? 'active' : ''}"
                data-community="${community.name}">
                🏘️ ${community.name}
            </li>
        `).join('');

        communityList.querySelectorAll('li').forEach(li => {
            li.onclick = () => {
                const name = li.dataset.community;
                state.currentCommunity = name === state.currentCommunity ? null : name;
                renderCommunities(communities);
                loadPosts();
            };
        });
    }

    if (postCommunitySelect) {
        postCommunitySelect.innerHTML = communities.map(community => `
            <option value="${community.name}">${community.name}</option>
        `).join('');
    }
}

// 게시글 목록 렌더링
function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">게시글이 없습니다.</div>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="post-card" data-id="${post.id}">
            <div class="post-header">
                <span class="author">u/${post.author}</span>
                <span class="community">r/${post.community}</span>
                <span class="time">${formatDate(post.created_at)}</span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-content">${escapeHtml(post.content)}</p>
            <div class="post-footer">
                <div class="votes">
                    <button class="vote-btn up" onclick="handlePostVote(${post.id}, 'upvote')">⬆️</button>
                    <span class="score">${post.score}</span>
                    <button class="vote-btn down" onclick="handlePostVote(${post.id}, 'downvote')">⬇️</button>
                </div>
                <button class="comment-btn" onclick="toggleComments(${post.id})">💬 댓글</button>
            </div>
            <div id="comments-section-${post.id}" class="comments-section" style="display: none;">
                <div class="comment-form">
                    <textarea id="comment-input-${post.id}" placeholder="댓글을 남겨보세요..."></textarea>
                    <button onclick="handleCommentSubmit(${post.id})">작성</button>
                </div>
                <div id="comments-list-${post.id}" class="comments-list"></div>
            </div>
        </article>
    `).join('');
}

// ========================================
// 4. 이벤트 핸들러
// ========================================

async function loadPosts() {
    const posts = await fetchPosts(state.currentCommunity);
    state.posts = posts;
    renderPosts(posts);
}

async function handlePostVote(id, action) {
    if (!getLocalToken()) {
        alert('로그인이 필요합니다.');
        showAuthModal('login');
        return;
    }
    try {
        const result = await votePost(id, action);
        const card = document.querySelector(`.post-card[data-id="${id}"]`);
        if (card) card.querySelector('.score').textContent = result.score;
    } catch (error) {
        alert(error.message);
    }
}

async function toggleComments(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    if (section.style.display === 'none') {
        section.style.display = 'block';
        const list = document.getElementById(`comments-list-${postId}`);
        list.innerHTML = '로딩 중...';
        const comments = await fetchComments(postId);
        list.innerHTML = comments.length ? comments.map(c => `
            <div class="comment">
                <div class="comment-header"><b>u/${c.author}</b> · ${formatDate(c.created_at)}</div>
                <div class="comment-content">${escapeHtml(c.content)}</div>
            </div>
        `).join('') : '댓글이 없습니다.';
    } else {
        section.style.display = 'none';
    }
}

async function handleCommentSubmit(postId) {
    if (!getLocalToken()) {
        alert('로그인이 필요합니다.');
        showAuthModal('login');
        return;
    }
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    try {
        await createComment(postId, { content });
        input.value = '';
        const list = document.getElementById(`comments-list-${postId}`);
        const comments = await fetchComments(postId);
        list.innerHTML = comments.map(c => `
            <div class="comment">
                <div class="comment-header"><b>u/${c.author}</b> · ${formatDate(c.created_at)}</div>
                <div class="comment-content">${escapeHtml(c.content)}</div>
            </div>
        `).join('');
    } catch (error) {
        alert(error.message);
    }
}

async function handleCreatePost(e) {
    e.preventDefault();
    if (!getLocalToken()) {
        alert('로그인이 필요합니다.');
        showAuthModal('login');
        return;
    }

    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const community = document.getElementById('postCommunity').value;

    try {
        await createPost({ title, content, community });
        closeModal();
        document.getElementById('createPostForm').reset();
        loadPosts();
    } catch (error) {
        alert(error.message);
    }
}

// ========================================
// 5. 유틸리티 및 초기화
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function openModal() { document.getElementById('createPostModal').style.display = 'flex'; }
function closeModal() { document.getElementById('createPostModal').style.display = 'none'; }

async function initApp() {
    const communities = await fetchCommunities();
    state.communities = communities;
    renderCommunities(communities);
    loadPosts();

    const createBtn = document.getElementById('createPostBtn');
    if (createBtn) createBtn.onclick = openModal;
    
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) closeBtn.onclick = closeModal;

    const form = document.getElementById('createPostForm');
    if (form) form.onsubmit = handleCreatePost;
}

document.addEventListener('DOMContentLoaded', initApp);