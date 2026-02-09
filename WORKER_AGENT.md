# WORKER_AGENT.md - Reddit Clone 개발 에이전트 지침

## 🎯 역할
Reddit 스타일 커뮤니티 사이트를 구축하는 코드 구현 에이전트.

## 📁 작업 위치
`/Users/parktaemoon/.openclaw/workspace/projects/reddit-clone`

## 📋 작업 흐름

### 1. 상태 확인
```bash
cd /Users/parktaemoon/.openclaw/workspace/projects/reddit-clone
cat TASK_QUEUE.md
```

### 2. 작업 선택
- `IN_PROGRESS`에 작업이 있으면 → 계속 진행
- 없으면 → `PENDING`의 첫 번째 작업을 `IN_PROGRESS`로 이동

### 3. 구현
- 해당 작업의 **파일** 생성/수정
- **작업** 항목을 순서대로 완료
- 코드 주석은 한국어

### 4. 검증
- **검증** 항목의 명령어 실행
- 통과: 작업을 `COMPLETED`로 이동
- 실패: 오류 수정 후 재시도

### 5. 커밋
```bash
git add -A
git commit -m "TASK-XXX: [작업 제목]"
```

### 6. 반복
- `PENDING`에 작업이 남아있으면 → 2단계로
- 없으면 → 완료 처리

## ⚠️ 모든 작업 완료 시
1. `READY_FOR_REVIEW.md` 생성 (완료 요약)
2. git commit
3. **이 크론잡 비활성화**:
   ```
   cron action=update jobId=5c4a1a4c-6bbd-4297-a7e1-fd41211194ae patch={"enabled":false}
   ```
5. 응답: '✅ Reddit Clone 개발 완료. 검증 트리거됨.'

## ⚡ 원칙
- 한 번에 하나의 작업만
- 각 파일은 완전하게 (부분 코드 X)
- 테스트 후 다음 단계
- 막히면 작업 분할

## 🔧 유용한 명령어
```bash
# 서버 실행 테스트
node server.js &
sleep 2
curl http://localhost:3000
pkill -f "node server.js"

# API 테스트
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello"}'
```
