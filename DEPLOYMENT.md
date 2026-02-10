# 배포 가이드

## Docker 배포

### 1. Docker 이미지 빌드

```bash
docker build -t reddit-clone .
```

### 2. Docker Compose로 실행

```bash
docker-compose up -d
```

### 3. 서버 상태 확인

```bash
docker-compose ps
docker-compose logs -f
```

### 4. 데이터베이스 백업

```bash
docker exec reddit-clone cp /app/reddit.db /app/reddit.db.backup
docker cp reddit-clone:/app/reddit.db.backup ./backup/
```

### 5. 서버 중지

```bash
docker-compose down
```

## GitHub Actions CI/CD

### 1. Secrets 설정

GitHub 리포지토리 Settings → Secrets and variables → Actions에서 다음 secrets 추가:

- `DEPLOY_HOST`: 배포 서버 주소 (예: `example.com`)
- `DEPLOY_USER`: SSH 사용자명 (예: `ubuntu`)
- `DEPLOY_SSH_KEY`: SSH 개인키

### 2. 배포 트리거

- `main` 브랜치에 push → 자동 배포
- `develop` 브랜치에 push → 빌드 및 테스트만 수행

### 3. 배포 확인

GitHub Actions 탭에서 배포 로그 확인

## 환경 변수

- `NODE_ENV`: 환경 (production/development)
- `PORT`: 서버 포트 (기본: 3000)

## 보안 고려사항

1. `.env` 파일은 `.gitignore`에 포함되어 있어 커밋되지 않음
2. SSH 키는 GitHub Secrets에 안전하게 저장
3. Docker 이미지는 최소 권한으로 실행
4. 데이터베이스 파일은 Docker volume에 저장