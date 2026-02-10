# Reddit Clone

Node.js, Express, SQLite3를 사용한 Reddit 클론 프로젝트입니다.
기본적인 게시판 기능(게시글 작성/조회/수정/삭제, 댓글/대댓글, 투표, 커뮤니티 분류)을 제공합니다.

## 🚀 시작하기

### 1. 설치
```bash
npm install
```

### 2. 데이터베이스 초기화
```bash
# 데이터베이스 생성 및 초기 커뮤니티 데이터 추가
node db/init.js

# 샘플 데이터 추가 (선택사항)
node seed.js
```

### 3. 서버 실행
```bash
npm start
```
서버는 `http://localhost:3000`에서 실행됩니다.

## 🛠️ 기술 스택
- **Backend**: Node.js, Express
- **Database**: SQLite3 (better-sqlite3)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## 📋 기능 목록

### 게시글 (Posts)
- 전체 게시글 조회
- 커뮤니티별 게시글 조회
- 게시글 상세 조회
- 게시글 작성
- 게시글 수정/삭제 (API 구현됨, UI 미구현)

### 댓글 (Comments)
- 게시글에 댓글 작성
- 대댓글 (무한 깊이 지원)
- 댓글 삭제

### 투표 (Voting)
- 게시글 업보트/다운보트
- 실시간 점수 반영 (낙관적 업데이트)

### 커뮤니티 (Communities)
- 커뮤니티 목록 조회
- 커뮤니티별 필터링

## 📂 프로젝트 구조
```
reddit-clone/
├── db/                 # 데이터베이스 관련 파일
│   ├── init.js         # DB 초기화 스크립트
│   ├── schema.sql      # DB 스키마
│   ├── seed.js         # 샘플 데이터 스크립트
│   └── seed-functions.js # 샘플 데이터 함수
├── public/             # 프론트엔드 정적 파일
│   ├── css/            # 스타일시트
│   ├── js/             # 클라이언트 스크립트
│   ├── index.html      # 메인 페이지
│   └── post.html       # 게시글 상세 페이지
├── routes/             # API 라우트
│   ├── api.js          # API 엔드포인트 정의
│   └── index.js        # 메인 라우터
├── server.js           # Express 서버 진입점
├── package.json        # 프로젝트 설정
└── README.md           # 프로젝트 문서
```

## 📝 API 문서

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | 전체 게시글 목록 조회 |
| GET | `/api/posts/:id` | 게시글 상세 조회 |
| POST | `/api/posts` | 새 게시글 작성 |
| PUT | `/api/posts/:id` | 게시글 수정 |
| DELETE | `/api/posts/:id` | 게시글 삭제 |
| POST | `/api/posts/:id/upvote` | 게시글 업보트 |
| POST | `/api/posts/:id/downvote` | 게시글 다운보트 |
| GET | `/api/posts/:id/comments` | 게시글 댓글 조회 |
| POST | `/api/posts/:id/comments` | 댓글 작성 |
| DELETE | `/api/comments/:id` | 댓글 삭제 |
| GET | `/api/communities` | 커뮤니티 목록 조회 |
| GET | `/api/communities/:name/posts` | 커뮤니티별 게시글 조회 |

## 🤝 기여
이 프로젝트는 교육용으로 제작되었습니다. 버그 리포트나 기능 제안은 환영합니다.

## 📄 라이선스
MIT License