// Reddit Clone - JavaScript 로직

// ========================================
// 1. 상태 관리
// ========================================
const state = {
    posts: [],
    communities: [],
    currentCommunity: null,
    currentUser: 'guest',
    token: null
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
        return await response.json();
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
        return await response.json();
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error('게시글을 작성하는데 실패했습니다.');
        return await response.json();
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error('게시글을 수정하는데 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        throw error;
    }
}

// 게시글 삭제
async function deletePost(id) {
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('게시글을 삭제하는데 실패했습니다.');
        return true;
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        throw error;
    }
}

// 게시글 업보트
async function upvotePost(id) {
    try {
        const response = await fetch(`/api/posts/${id}/upvote`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('업보트에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('업보트 오류:', error);
        throw error;
    }
}

// 게시글 다운보트
async function downvotePost(id) {
    try {
        const response = await fetch(`/api/posts/${id}/downvote`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('다운보트에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('다운보트 오류:', error);
        throw error;
    }
}

// 댓글 조회
async function fetchComments(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (!response.ok) throw new Error('댓글을 불러오는데 실패했습니다.');
        return await response.json();
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });
        if (!response.ok) throw new Error('댓글을 작성하는데 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('댓글 작성 오류:', error);
        throw error;
    }
}

// 댓글 삭제
async function deleteComment(id) {
    try {
        const response = await fetch(`/api/comments/${id}`, {
            method: 'DELETE'
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
        return await response.json();
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

    // 사이드바 커뮤니티 목록
    communityList.innerHTML = communities.map(community => `
        <li class="${state.currentCommunity === community.name ? 'active' : ''}"
            data-community="${community.name}">
            🏘️ ${community.name}
        </li>
    `).join('');

    // 게시글 작성 폼 커뮤니티 선택
    postCommunitySelect.innerHTML = communities.map(community => `
        <option value="${community.name}">${community.name}</option>
    `).join('');

    // 커뮤니티 클릭 이벤트
    communityList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const communityName = li.dataset.community;
            state.currentCommunity = communityName;
            renderCommunities(communities);
            fetchAndRenderPosts(communityName);
        });
    });
}

// 게시글 목록 렌더링
function renderPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    const feedTitle = document.getElementById('feedTitle');

    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="text-center">게시글이 없습니다.</div>';
        return;
    }

    postsContainer.innerHTML = posts.map(post => `
        <article class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <span class="post-author">u/${post.author}</span>
                <span class="post-community">r/${post.community}</span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-content">${escapeHtml(post.content)}</p>
            <div class="post-footer">
                <div class="vote-buttons">
                    <button class="vote-btn upvote" data-post-id="${post.id}" data-action="upvote">
                        ⬆️
                    </button>
                    <span class="vote-count">${post.score}</span>
                    <button class="vote-btn downvote" data-post-id="${post.id}" data-action="downvote">
                        ⬇️
                    </button>
                </div>
                <div class="post-meta">
                    <span>📅 ${formatDate(post.created_at)}</span>
                    <button class="comment-toggle" data-post-id="${post.id}">
                        💬 댓글
                    </button>
                </div>
            </div>
            <div class="comments-section hidden" id="comments-${post.id}">
                <div class="comments-list" id="comments-list-${post.id}">
                    <!-- 댓글이 여기에 동적으로 추가됨 -->
                </div>
                <div class="comment-form">
                    <textarea id="comment-input-${post.id}" placeholder="댓글을 작성하세요..."></textarea>
                    <button id="submit-comment-${post.id}">댓글 작성</button>
                </div>
            </div>
        </article>
    `).join('');

    // 투표 버튼 이벤트
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', handleVote);
    });

    // 댓글 토글 이벤트
    document.querySelectorAll('.comment-toggle').forEach(btn => {
        btn.addEventListener('click', toggleComments);
    });

    // 댓글 작성 이벤트
    document.querySelectorAll('#submit-comment-').forEach(btn => {
        btn.addEventListener('click', handleCommentSubmit);
    });
}

// 댓글 목록 렌더링
async function renderComments(postId) {
    const commentsList = document.getElementById(`comments-list-${postId}`);
    const comments = await fetchComments(postId);

    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="text-center">댓글이 없습니다.</div>';
        return;
    }

    commentsList.innerHTML = renderCommentTree(comments);
}

// 댓글 트리 렌더링
function renderCommentTree(comments, parentId = null) {
    const filteredComments = comments.filter(comment => comment.parent_id === parentId);

    if (filteredComments.length === 0) return '';

    return filteredComments.map(comment => `
        <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">u/${comment.author}</span>
                <span class="comment-score">⬆️ ${comment.score}</span>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
            <div class="comment-footer">
                <span>📅 ${formatDate(comment.created_at)}</span>
                <button class="delete-comment" data-comment-id="${comment.id}">
                    🗑️ 삭제
                </button>
            </div>
            <div class="replies-container" id="replies-${comment.id}">
                ${renderCommentTree(comments, comment.id)}
            </div>
        </div>
    `).join('');
}

// ========================================
// 4. 이벤트 핸들러
// ========================================

// 투표 핸들러
async function handleVote(e) {
    const btn = e.target.closest('.vote-btn');
    const postId = btn.dataset.postId;
    const action = btn.dataset.action;

    try {
        if (action === 'upvote') {
            await upvotePost(postId);
            btn.classList.add('upvoted');
            btn.classList.remove('downvoted');
        } else if (action === 'downvote') {
            await downvotePost(postId);
            btn.classList.add('downvoted');
            btn.classList.remove('upvoted');
        }

        // 점수 업데이트
        const postCard = document.querySelector(`[data-post-id="${postId}"]`);
        const voteCount = postCard.querySelector('.vote-count');
        const currentScore = parseInt(voteCount.textContent);
        voteCount.textContent = currentScore + (action === 'upvote' ? 1 : -1);
    } catch (error) {
        alert('투표에 실패했습니다.');
    }
}

// 댓글 토글
function toggleComments(e) {
    const postId = e.target.dataset.postId;
    const commentsSection = document.getElementById(`comments-${postId}`);
    commentsSection.classList.toggle('hidden');

    if (!commentsSection.classList.contains('hidden')) {
        renderComments(postId);
    }
}

// 댓글 작성 핸들러
async function handleCommentSubmit(e) {
    const btn = e.target;
    const postId = btn.id.replace('submit-comment-', '');
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    try {
        await createComment(postId, { content });
        input.value = '';
        renderComments(postId);
    } catch (error) {
        alert('댓글 작성에 실패했습니다.');
    }
}

// 댓글 삭제 핸들러
async function handleDeleteComment(e) {
    const btn = e.target.closest('.delete-comment');
    const commentId = btn.dataset.commentId;

    if (!confirm('이 댓글을 삭제하시겠습니까?')) {
        return;
    }

    try {
        await deleteComment(commentId);
        const comment = document.querySelector(`[data-comment-id="${commentId}"]`);
        comment.remove();
    } catch (error) {
        alert('댓글 삭제에 실패했습니다.');
    }
}

// ========================================
// 5. 유틸리티 함수
// ========================================

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR');
}

// ========================================
// 6. 초기화
// ========================================

// 게시글 및 커뮤니티 로드
async function init() {
    try {
        // 커뮤니티 로드
        state.communities = await fetchCommunities();
        renderCommunities(state.communities);

        // 게시글 로드
        state.posts = await fetchPosts(state.currentCommunity);
        renderPosts(state.posts);

        // 게시글 작성 폼 제출 이벤트
        document.getElementById('createPostForm').addEventListener('submit', handleCreatePost);
    } catch (error) {
        console.error('초기화 오류:', error);
        alert('초기화에 실패했습니다.');
    }
}

// 게시글 작성 핸들러
async function handleCreatePost(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const community = document.getElementById('postCommunity').value;

    if (!title || !content) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }

    try {
        await createPost({ title, content, community });
        document.getElementById('createPostForm').reset();

        // 게시글 목록 새로고침
        state.posts = await fetchPosts(state.currentCommunity);
        renderPosts(state.posts);

        // 모달 닫기
        closeModal();
    } catch (error) {
        alert('게시글 작성에 실패했습니다.');
    }
}

// 모달 열기/닫기
function openModal() {
    document.getElementById('createPostModal').classList.add('active');
}

function closeModal() {
    document.getElementById('createPostModal').classList.remove('active');
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // 게시글 작성 버튼
    document.getElementById('createPostBtn').addEventListener('click', openModal);

    // 모달 닫기 버튼
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);

    // 모달 외부 클릭 시 닫기
    document.getElementById('createPostModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('createPostModal')) {
            closeModal();
        }
    });

    // 댓글 삭제 이벤트
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-comment')) {
            handleDeleteComment(e);
        }
    });

    // 초기화 실행
    init();
});