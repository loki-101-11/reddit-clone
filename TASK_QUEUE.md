# TASK_QUEUE.md - Reddit Clone 개발 작업

## 📋 작업 큐

### ✅ COMPLETED
#### TASK-001: 프로젝트 초기화
- **완료 날짜**: 2026-02-10
- **작업 내용**: `npm init`, `express`, `better-sqlite3` 설치, `.gitignore` 생성

#### TASK-002: Express 서버 기본 설정
- **완료 날짜**: 2026-02-10
- **작업 내용**: `server.js` 작성 및 기본 라우팅 설정 완료

---

### 🔄 IN_PROGRESS
#### TASK-003: 데이터베이스 스키마 설정
- **파일**: `db/schema.sql`, `db/init.js`
- **작업**:
  1. posts 테이블 (id, title, content, author, score, community, created_at)
  2. comments 테이블 (id, post_id, parent_id, content, author, score, created_at)
  3. communities 테이블 (id, name, description, created_at)
  4. init.js로 DB 초기화 함수
- **검증**: `node db/init.js` 실행 후 reddit.db 파일 생성

---

### 📝 PENDING

#### TASK-003: 데이터베이스 스키마 설정
- **파일**: `db/schema.sql`, `db/init.js`
- **작업**:
  1. posts 테이블 (id, title, content, author, score, community, created_at)
  2. comments 테이블 (id, post_id, parent_id, content, author, score, created_at)
  3. communities 테이블 (id, name, description, created_at)
  4. init.js로 DB 초기화 함수
- **검증**: `node db/init.js` 실행 후 reddit.db 파일 생성

#### TASK-004: API 라우트 - 게시글 CRUD
- **파일**: `routes/posts.js`
- **작업**:
  1. GET /api/posts - 전체 조회
  2. GET /api/posts/:id - 단일 조회
  3. POST /api/posts - 생성
  4. PUT /api/posts/:id - 수정
  5. DELETE /api/posts/:id - 삭제
- **검증**: curl로 각 엔드포인트 테스트

#### TASK-005: API 라우트 - 투표
- **파일**: `routes/votes.js`
- **작업**:
  1. POST /api/posts/:id/upvote
  2. POST /api/posts/:id/downvote
  3. score 업데이트 로직
- **검증**: curl로 투표 후 점수 변경 확인

#### TASK-006: API 라우트 - 댓글
- **파일**: `routes/comments.js`
- **작업**:
  1. GET /api/posts/:id/comments - 댓글 조회
  2. POST /api/posts/:id/comments - 댓글 작성
  3. DELETE /api/comments/:id - 댓글 삭제
  4. 대댓글 지원 (parent_id)
- **검증**: curl로 댓글 CRUD 테스트

#### TASK-007: API 라우트 - 커뮤니티
- **파일**: `routes/communities.js`
- **작업**:
  1. GET /api/communities - 목록
  2. POST /api/communities - 생성
  3. GET /api/communities/:name/posts - 커뮤니티별 게시글
- **검증**: curl로 커뮤니티 API 테스트

#### TASK-008: 프론트엔드 - HTML 구조
- **파일**: `public/index.html`
- **작업**:
  1. 기본 HTML5 구조
  2. 헤더 (로고, 검색바)
  3. 사이드바 (커뮤니티 목록)
  4. 메인 피드 영역
  5. 게시글 작성 모달
- **검증**: 브라우저에서 구조 확인

#### TASK-009: 프론트엔드 - CSS 스타일링
- **파일**: `public/css/style.css`
- **작업**:
  1. 다크 테마 색상 변수
  2. 레이아웃 (그리드/플렉스)
  3. 게시글 카드 스타일
  4. 투표 버튼 스타일
  5. 반응형 미디어 쿼리
- **검증**: 브라우저에서 스타일 확인

#### TASK-010: 프론트엔드 - JavaScript 로직
- **파일**: `public/js/app.js`
- **작업**:
  1. 게시글 목록 fetch 및 렌더링
  2. 게시글 작성 폼 처리
  3. 투표 버튼 클릭 핸들러
  4. 댓글 표시/작성
  5. 커뮤니티 필터링
- **검증**: 모든 인터랙션 동작 확인

#### TASK-011: 게시글 상세 페이지
- **파일**: `public/post.html`, `public/js/post.js`
- **작업**:
  1. 단일 게시글 표시
  2. 댓글 트리 렌더링
  3. 댓글 작성 폼
  4. 대댓글 UI
- **검증**: 게시글 클릭 → 상세 페이지 이동 확인

#### TASK-012: 최종 통합 및 정리
- **파일**: 전체
- **작업**:
  1. 모든 기능 통합 테스트
  2. 에러 핸들링 추가
  3. README.md 작성
  4. 샘플 데이터 추가
- **검증**: `npm start` 후 전체 플로우 테스트

---

## 📊 진행 상태
- 총 작업: 12개
- 완료: 0개
- 진행 중: 0개
- 대기: 12개
