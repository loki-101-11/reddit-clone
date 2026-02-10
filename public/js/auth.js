// 인증 JavaScript
// 작성일: 2026-02-10

const API_BASE = '/api';

// 토큰 저장
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

// 토큰 가져오기
function getToken() {
    return localStorage.getItem('authToken');
}

// 토큰 삭제
function removeToken() {
    localStorage.removeItem('authToken');
}

// 로그인 상태 확인
function isAuthenticated() {
    return !!getToken();
}

// API 요청 헤더 설정
function getAuthHeaders() {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// 회원가입
async function register(username, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '회원가입 실패');
        }

        // 토큰 저장
        saveToken(data.token);

        return data;
    } catch (error) {
        console.error('회원가입 에러:', error);
        throw error;
    }
}

// 로그인
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '로그인 실패');
        }

        // 토큰 저장
        saveToken(data.token);

        return data;
    } catch (error) {
        console.error('로그인 에러:', error);
        throw error;
    }
}

// 로그아웃
async function logout() {
    try {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            removeToken();
            window.location.reload();
        }
    } catch (error) {
        console.error('로그아웃 에러:', error);
        // 에러 발생해도 로컬 토큰 삭제
        removeToken();
        window.location.reload();
    }
}

// 현재 사용자 정보 조회
async function getCurrentUser() {
    try {
        const token = getToken();
        if (!token) return null;

        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('인증 정보를 가져올 수 없습니다.');
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('사용자 정보 조회 에러:', error);
        return null;
    }
}

// 로그인/회원가입 모달 표시
function showAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const title = document.getElementById('authModalTitle');

    if (!modal) return;

    modal.style.display = 'flex';
    
    if (mode === 'login') {
        title.textContent = '로그인';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        title.textContent = '회원가입';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// 로그인/회원가입 모달 숨기기
function hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 로그인 폼 처리
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const data = await login(username, password);

            // 로그인 성공 시 UI 업데이트
            updateAuthUI(data.user);
            hideAuthModal();

            // 알림 표시
            showNotification('로그인되었습니다!', 'success');
            
            // 페이지 새로고침하여 상태 반영
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
}

// 회원가입 폼 처리
function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            showNotification('비밀번호가 일치하지 않습니다.', 'error');
            return;
        }

        try {
            const data = await register(username, password);

            // 회원가입 성공 시 UI 업데이트
            updateAuthUI(data.user);
            hideAuthModal();

            // 알림 표시
            showNotification('회원가입이 완료되었습니다!', 'success');
            
            // 페이지 새로고침하여 상태 반영
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
}

// 인증 UI 업데이트
function updateAuthUI(user) {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const logoutButton = document.getElementById('logoutButton');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (user) {
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        if (usernameDisplay) {
            usernameDisplay.href = `/profile.html?username=${user.username}`;
            usernameDisplay.textContent = `u/${user.username}`;
            usernameDisplay.style.display = 'inline-block';
        }
    } else {
        if (loginButton) loginButton.style.display = 'block';
        if (registerButton) registerButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (usernameDisplay) usernameDisplay.style.display = 'none';
    }
}

// 알림 표시
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// 페이지 로드 시 초기화
function initAuth() {
    // 버튼 이벤트 리스너
    const loginBtn = document.getElementById('loginButton');
    const registerBtn = document.getElementById('registerButton');
    const closeAuthBtn = document.getElementById('closeAuthModalBtn');
    const switchReg = document.getElementById('switchToRegister');
    const switchLogin = document.getElementById('switchToLogin');

    if (loginBtn) loginBtn.onclick = () => showAuthModal('login');
    if (registerBtn) registerBtn.onclick = () => showAuthModal('register');
    if (closeAuthBtn) closeAuthBtn.onclick = hideAuthModal;
    if (switchReg) switchReg.onclick = (e) => { e.preventDefault(); showAuthModal('register'); };
    if (switchLogin) switchLogin.onclick = (e) => { e.preventDefault(); showAuthModal('login'); };

    // 폼 설정
    setupLoginForm();
    setupRegisterForm();

    // 로그아웃 버튼 설정
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.onclick = logout;
    }

    // 인증 상태 확인
    if (isAuthenticated()) {
        getCurrentUser().then(user => {
            updateAuthUI(user);
        });
    } else {
        updateAuthUI(null);
    }
}

// 초기화 호출
document.addEventListener('DOMContentLoaded', initAuth);

// 모듈로 내보내기 (require 지원 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        register,
        login,
        logout,
        getCurrentUser,
        isAuthenticated,
        getToken,
        saveToken,
        removeToken,
        getAuthHeaders
    };
}