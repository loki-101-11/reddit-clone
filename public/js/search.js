// 검색 기능 JavaScript
// 작성일: 2026-02-10

/**
 * 검색어 입력 이벤트 리스너
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchButton) {
        // 검색 버튼 클릭
        searchButton.addEventListener('click', performSearch);

        // 엔터키 입력
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // 실시간 검색 (선택 사항)
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (searchInput.value.trim().length >= 2) {
                    performSearch();
                } else if (searchInput.value.trim().length === 0) {
                    searchResults.innerHTML = '';
                }
            }, 300);
        });

        // 검색 결과 닫기 버튼
        const closeSearchResults = () => {
            searchResults.innerHTML = '';
        };

        // ESC 키로 검색 결과 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearchResults();
            }
        });
    }

    /**
     * 검색 실행
     */
    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        try {
            // 검색어 표시
            searchResults.innerHTML = `
                <div class="search-header">
                    <h3>검색 결과: "${escapeHtml(query)}"</h3>
                    <span class="search-count">로딩 중...</span>
                </div>
            `;

            // 통합 검색 API 호출
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success) {
                renderSearchResults(data.results, data.count);
            } else {
                searchResults.innerHTML = `
                    <div class="search-error">
                        <p>검색 중 오류가 발생했습니다.</p>
                    </div>
                `;
            }

        } catch (error) {
            console.error('검색 오류:', error);
            searchResults.innerHTML = `
                <div class="search-error">
                    <p>검색 중 오류가 발생했습니다.</p>
                </div>
            `;
        }
    }

    /**
     * 검색 결과 렌더링
     */
    function renderSearchResults(results, count) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    <p>검색 결과가 없습니다.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="search-header">
                <h3>검색 결과: "${escapeHtml(searchInput.value)}"</h3>
                <span class="search-count">${count}개의 결과</span>
            </div>
        `;

        results.forEach(item => {
            if (item.type === 'post') {
                html += `
                    <div class="search-result search-result-post">
                        <div class="search-result-header">
                            <span class="search-result-type">게시글</span>
                            <span class="search-result-community">${escapeHtml(item.community_name || item.community)}</span>
                        </div>
                        <h4 class="search-result-title">
                            <a href="/post.html?id=${item.id}">${escapeHtml(item.title)}</a>
                        </h4>
                        <p class="search-result-content">${escapeHtml(item.content.substring(0, 150))}${item.content.length > 150 ? '...' : ''}</p>
                        <div class="search-result-meta">
                            <span class="search-result-author">작성자: ${escapeHtml(item.author)}</span>
                            <span class="search-result-score">⬆️ ${item.score}</span>
                            <span class="search-result-date">${formatDate(item.created_at)}</span>
                        </div>
                    </div>
                `;
            } else if (item.type === 'comment') {
                html += `
                    <div class="search-result search-result-comment">
                        <div class="search-result-header">
                            <span class="search-result-type">댓글</span>
                            <span class="search-result-community">${escapeHtml(item.post_title || '게시글 없음')}</span>
                        </div>
                        <p class="search-result-content">${escapeHtml(item.title)}</p>
                        <div class="search-result-meta">
                            <span class="search-result-author">작성자: ${escapeHtml(item.author)}</span>
                            <span class="search-result-score">⬆️ ${item.score}</span>
                            <span class="search-result-date">${formatDate(item.created_at)}</span>
                        </div>
                    </div>
                `;
            }
        });

        searchResults.innerHTML = html;
    }

    /**
     * HTML 이스케이프
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 날짜 포맷팅
     */
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
});