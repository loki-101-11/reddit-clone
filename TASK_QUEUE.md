# TASK_QUEUE.md - Reddit Clone 개발 작업

## 📋 작업 큐

### ✅ COMPLETED
#### TASK-001: 프로젝트 초기화
- **완료 날짜**: 2026-02-10
- **작업 내용**: `npm init`, `express`, `better-sqlite3` 설치, `.gitignore` 생성

#### TASK-002: Express 서버 기본 설정
- **완료 날짜**: 2026-02-10
- **작업 내용**: `server.js` 작성 및 기본 라우팅 설정 완료

#### TASK-003: 데이터베이스 스키마 설정
- **완료 날짜**: 2026-02-10
- **작업 내용**:
  1. posts 테이블 (id, title, content, author, score, community, created_at)
  2. comments 테이블 (id, post_id, parent_id, content, author, score, created_at)
  3. communities 테이블 (id, name, description, created_at)
  4. init.js로 DB 초기화 함수
- **검증**: `node db/init.js` 실행 후 reddit.db 파일 생성 (4개 초기 커뮤니티 포함)

#### TASK-004: API 라우트 - 게시글 CRUD
- **완료 날짜**: 2026-02-10
- **작업 내용**:
  1. GET /api/posts - 전체 조회
  2. GET /api/posts/:id - 단일 조회
  3. POST /api/posts - 생성
  4. PUT /api/posts/:id - 수정
  5. DELETE /api/posts/:id - 삭제
- **검증**: curl로 각 엔드포인트 테스트 완료 (Port 3001)

#### TASK-005: API 라우트 - 투표
- **완료 날짜**: 2026-02-10
- **작업 내용**:
  1. POST /api/posts/:id/upvote - 게시글 업보트
  2. POST /api/posts/:id/downvote - 게시글 다운보트
  3. score 업데이트 로직 구현
- **검증**: curl로 투표 후 점수 변경 확인 완료
  - 업보트: score +1
  - 다운보트: score -1
  - 게시글 존재하지 않을 때 404 응답

#### TASK-006: API 라우트 - 댓글
- **완료 날짜**: 2026-02-10
- **작업 내용**:
  1. GET /api/posts/:id/comments - 댓글 조회
  2. POST /api/posts/:id/comments - 댓글 작성
  3. DELETE /api/comments/:id - 댓글 삭제
  4. 대댓글 지원 (parent_id)
- **검증**: curl로 댓글 CRUD 테스트 완료
  - 댓글 작성 및 조회 정상 작동
  - 대댓글 생성 및 계층 구조 유지
  - 대댓글이 있는 댓글 삭제 방지 (유효성 검사)

#### TASK-007: API 라우트 - 커뮤니티
- **완료 날짜**: 2026-02-10
- **작업 내용**:
  1. GET /api/communities - 목록
  2. POST /api/communities - 생성
  3. GET /api/communities/:name/posts - 커뮤니티별 게시글
- **검증**: curl로 커뮤니티 API 테스트 완료
  - 커뮤니티 목록 조회 확인 (기본 4개)
  - 커뮤니티별 게시글 조회 확인

---

### ✅ COMPLETED
#### TASK-008: 프론트엔드 - HTML 구조
- **완료 날짜**: 2026-02-10
- **파일**: `public/index.html`
- **작업**:
  1. 기본 HTML5 구조
  2. 헤더 (로고, 검색바)
  3. 사이드바 (커뮤니티 목록)
  4. 메인 피드 영역
  5. 게시글 작성 모달
- **검증**: 브라우저에서 구조 확인
- **상세 내용**:
  - 헤더: 로고, 검색바, 게시글 작성 버튼
  - 사이드바: 커뮤니티 목록 (동적 로드)
  - 메인 피드: 게시글 컨테이너 (동적 로드)
  - 모달: 게시글 작성 폼 (제목, 내용, 커뮤니티 선택)

#### TASK-009: 프론트엔드 - CSS 스타일링
- **완료 날짜**: 2026-02-10
- **파일**: `public/css/style.css`
- **작업**:
  1. 다크 테마 색상 변수
  2. 레이아웃 (그리드/플렉스)
  3. 게시글 카드 스타일
  4. 투표 버튼 스타일
  5. 반응형 미디어 쿼리
- **검증**: 브라우저에서 스타일 확인
- **상세 내용**:
  - 다크 테마: 배경색, 텍스트색, 인터랙션 색상
  - 레이아웃: 헤더, 사이드바, 메인 피드 그리드 구조
  - 게시글 카드: 호버 효과, 스크롤바 스타일
  - 투표 버튼: 업보트/다운보트 상태 스타일
  - 반응형: 모바일(768px), 태블릿(480px) 대응

### ✅ COMPLETED
#### TASK-010: 프론트엔드 - JavaScript 로직
- **완료 날짜**: 2026-02-10
- **파일**: `public/js/app.js`
- **작업**:
  1. 게시글 목록 fetch 및 렌더링
  2. 게시글 작성 폼 처리
  3. 투표 버튼 클릭 핸들러
  4. 댓글 표시/작성
  5. 커뮤니티 필터링
- **검증**: 모든 인터랙션 동작 확인
- **상세 내용**:
  - API 함수: 게시글 CRUD, 투표, 댓글 CRUD, 커뮤니티 목록
  - UI 렌더링: 커뮤니티 목록, 게시글 카드, 댓글 트리
  - 이벤트 핸들러: 투표, 댓글 토글/작성/삭제
  - 유틸리티: HTML 이스케이프, 날짜 포맷팅
  - 초기화: 페이지 로드 시 데이터 로드 및 이벤트 등록

### ✅ COMPLETED
#### TASK-011: 게시글 상세 페이지
- **완료 날짜**: 2026-02-10
- **파일**: `public/post.html`, `public/js/post.js`
- **작업**:
  1. 단일 게시글 표시
  2. 댓글 트리 렌더링
  3. 댓글 작성 폼
  4. 대댓글 UI
- **검증**: 게시글 클릭 → 상세 페이지 이동 확인
- **상세 내용**:
  - `public/post.html`: 게시글 상세 구조, 댓글 섹션, 뒤로가기 버튼
  - `public/js/post.js`: 게시글 상세 API 호출, 댓글 CRUD, 재귀적 댓글 트리 렌더링

### ✅ COMPLETED
#### TASK-012: 최종 통합 및 정리
- **완료 날짜**: 2026-02-10
- **파일**: 전체
- **작업**:
  1. 모든 기능 통합 테스트
  2. 에러 핸들링 추가 (모든 API 라우트에 try-catch 구현)
  3. README.md 작성 (기술 스택, 기능 목록, API 문서 포함)
  4. 샘플 데이터 추가 (seed.js 실행)
- **검증**:
  - 서버 실행 확인 (`npm start`)
  - API 엔드포인트 테스트 (게시글 CRUD, 투표, 댓글, 커뮤니티)
  - 프론트엔드 UI 동작 확인
  - 에러 핸들링 테스트

---

## 📊 진행 상태
- 총 작업: 13개
- 완료: 9개
- 진행 중: 0개
- 대기: 4개

---

### ✅ COMPLETED
#### TASK-013: 사용자 인증 및 권한 관리
- **완료 날짜**: 2026-02-10
- **파일**: `routes/auth.js`, `db/schema.sql`, `public/js/auth.js`
- **작업**:
  1. 사용자 회원가입/로그인 API 구현
  2. JWT 토큰 발급 및 검증
  3. 게시글/댓글 작성자 권한 검사
  4. 로그인 상태 유지 (localStorage)
- **검증**: 회원가입, 로그인, 로그아웃, 권한 검사 테스트

#### TASK-014: 검색 기능 구현
- **파일**: `routes/search.js`, `public/js/search.js`
- **작업**:
  1. 게시글 제목/내용 검색 API
  2. 댓글 검색 API
  3. 검색 결과 UI 렌더링
- **검증**: 검색어 입력 및 결과 표시 테스트

#### TASK-015: 알림 시스템
- **파일**: `routes/notifications.js`, `db/schema.sql`
- **작업**:
  1. 댓글 알림 (답글이 달리면 알림)
  2. 좋아요 알림 (게시글이 업보트되면 알림)
  3. 알림 목록 UI
- **검증**: 알림 생성 및 표시 테스트

#### TASK-016: 게시글 인덱싱 및 검색 최적화
- **파일**: `db/index.js`, `routes/search.js`
- **작업**:
  1. SQLite FTS5 (Full-Text Search) 활성화
  2. 게시글/댓글 텍스트 인덱싱
  3. 검색 성능 최적화
- **검증**: 대량 데이터 검색 성능 테스트

#### TASK-017: 배포 자동화
- **파일**: `Dockerfile`, `docker-compose.yml`, `.github/workflows/deploy.yml`
- **작업**:
  1. Docker 이미지 빌드
  2. GitHub Actions CI/CD 설정
  3. 자동 배포 파이프라인 구축
- **검증**: Docker 빌드 및 배포 테스트