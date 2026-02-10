# Reddit Clone Dockerfile
# 다중 단계 빌드를 사용하여 최적화된 이미지 생성

# 1단계: 빌드 단계 (의존성 설치)
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 복사
COPY package*.json ./

# 의존성 설치 (캐시 활용)
RUN npm ci --only=production

# 2단계: 런타임 단계
FROM node:20-alpine

WORKDIR /app

# 빌드 단계에서 설치된 의존성 복사
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# 비보안 포트 노출 (3000)
EXPOSE 3000

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000

# 애플리케이션 시작
CMD ["node", "server.js"]