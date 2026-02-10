// Reddit Clone - 게시글 상세 페이지 로직
// 작성일: 2026-02-10

// 인증 모듈 가져오기
const { getToken, getAuthHeaders } = require('./auth.js');

const state = {
    postId: null,
    post: null,
    comments: [],
    currentUser: 'guest',
    token: getToken()
};

// ========================================
// 1. API 함수
// ========================================

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

// 댓글 목록 조회
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
            headers: getAuthHeaders(),
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

// 커뮤니티 목록 조회 (사이드바용)
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
// 2. UI 렌더링 함수
// ========================================

// 게시글 상세 렌더링
function renderPostDetail(post) {
    const postContainer = document.getElementById('postDetail');
    
    if (!post) {
        postContainer.innerHTML = '<div class="text-center">게시글을 찾을 수 없습니다.</div>';
        return;
    }

    document.title = `${post.title} - Reddit Clone`;

    postContainer.innerHTML = `
        <div class="post-header">
            <span class="post-author">u/${post.author}</span>
            <span class="post-community">r/${post.community}</span>
        </div>
        <h1 class="post-title" style="font-size: 1.8rem;">${escapeHtml(post.title)}</h1>
        <div class="post-content" style="font-size: 1.1rem; margin-top: 1rem;">${escapeHtml(post.content)}</div>
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
            </div>
        </div>
    `;

    // 투표 버튼 이벤트 연결
    postContainer.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', handleVote);
    });
}

// 댓글 목록 렌더링
function renderComments(comments) {
    const commentsList = document.getElementById('commentsList');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="text-center">댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</div>';
        return;
    }

    commentsList.innerHTML = renderCommentTree(comments);
    
    // 댓글 삭제 이벤트 연결
    commentsList.querySelectorAll('.delete-comment').forEach(btn => {
        btn.addEventListener('click', handleDeleteComment);
    });

    // 대댓글 버튼 이벤트 연결 (추후 구현)
    // commentsList.querySelectorAll('.reply-comment').forEach(btn => {
    //     btn.addEventListener('click', handleReplyComment);
    // });
}

// 댓글 트리 재귀 렌더링
function renderCommentTree(comments, parentId = null, depth = 0) {
    const filteredComments = comments.filter(comment => comment.parent_id === parentId);

    if (filteredComments.length === 0) return '';

    return filteredComments.map(comment => `
        <div class="comment" data-comment-id="${comment.id}" style="margin-left: ${depth * 20}px;">
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
                <!-- <button class="reply-comment" data-comment-id="${comment.id}">↪️ 답글</button> -->
            </div>
            <div class="replies-container">
                ${renderCommentTree(comments, comment.id, depth + 1)}
            </div>
        </div>
    `).join('');
}

// 사이드바 커뮤니티 렌더링
function renderSidebarCommunities(communities) {
    const communityList = document.getElementById('communityList');
    communityList.innerHTML = communities.map(community => `
        <li onclick="location.href='index.html?community=${community.name}'">
            🏘️ ${community.name}
        </li>
    `).join('');
}

// ========================================
// 3. 이벤트 핸들러
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

        // 점수 업데이트 (낙관적 업데이트)
        const voteCount = btn.parentElement.querySelector('.vote-count');
        const currentScore = parseInt(voteCount.textContent);
        voteCount.textContent = currentScore + (action === 'upvote' ? 1 : -1);
    } catch (error) {
        alert('투표에 실패했습니다.');
    }
}

// 댓글 작성 핸들러
async function handleCommentSubmit() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    try {
        await createComment(state.postId, { content });
        input.value = '';
        
        // 댓글 목록 새로고침
        const comments = await fetchComments(state.postId);
        renderComments(comments);
    } catch (error) {
        alert('댓글 작성에 실패했습니다.');
    }
}

// 댓글 삭제 핸들러
async function handleDeleteComment(e) {
    const btn = e.target.closest('.delete-comment');
    const commentId = btn.dataset.commentId;

    if (!confirm('이 댓글을 삭제하시겠습니까?')) return;

    try {
        await deleteComment(commentId);
        // UI에서 즉시 제거
        const commentEl = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
        if (commentEl) commentEl.remove();
    } catch (error) {
        alert('댓글 삭제에 실패했습니다.');
    }
}

// ========================================
// 4. 유틸리티
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

// URL 파라미터 파싱
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ========================================
// 5. 초기화
// ========================================

async function init() {
    const postId = getPostIdFromUrl();
    if (!postId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'index.html';
        return;
    }

    state.postId = postId;

    try {
        // 병렬로 데이터 로드
        const [post, comments, communities] = await Promise.all([
            fetchPost(postId),
            fetchComments(postId),
            fetchCommunities()
        ]);

        state.post = post;
        state.comments = comments;

        renderPostDetail(post);
        renderComments(comments);
        renderSidebarCommunities(communities);

        // 이벤트 리스너 등록
        document.getElementById('submitCommentBtn').addEventListener('click', handleCommentSubmit);
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // 인증 초기화
        initAuth();

    } catch (error) {
        console.error('초기화 실패:', error);
        alert('페이지를 불러오는데 실패했습니다.');
    }
}

document.addEventListener('DOMContentLoaded', init);