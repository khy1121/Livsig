import bcrypt from 'bcryptjs';

// 관리자 사용자 데이터 (메모리 저장)
let adminUsers = [];
let nextAdminId = 1;

// 초기 관리자 계정 생성
export async function initializeAdminUsers() {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin12345';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    adminUsers = [
        {
            id: nextAdminId++,
            username: process.env.ADMIN_USERNAME || 'admin',
            passwordHash: hashedPassword,
            role: 'super_admin', // super_admin, admin
            createdAt: new Date().toISOString(),
            lastLogin: null
        }
    ];
}

// 관리자 계정 조회
export function getAllAdmins() {
    return adminUsers.map(({ passwordHash, ...admin }) => admin);
}

// 관리자 계정 찾기 (username)
export function findAdminByUsername(username) {
    return adminUsers.find(admin => admin.username === username);
}

// 관리자 계정 찾기 (ID)
export function findAdminById(id) {
    return adminUsers.find(admin => admin.id === id);
}

// 비밀번호 검증
export async function verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
}

// 관리자 계정 추가
export async function createAdmin(username, password, role = 'admin') {
    // 중복 체크
    if (findAdminByUsername(username)) {
        throw new Error('이미 존재하는 사용자명입니다');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = {
        id: nextAdminId++,
        username,
        passwordHash,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };

    adminUsers.push(newAdmin);
    const { passwordHash: _, ...adminWithoutPassword } = newAdmin;
    return adminWithoutPassword;
}

// 관리자 계정 수정
export async function updateAdmin(id, updates) {
    const adminIndex = adminUsers.findIndex(admin => admin.id === id);
    if (adminIndex === -1) {
        throw new Error('관리자를 찾을 수 없습니다');
    }

    const admin = adminUsers[adminIndex];

    // 비밀번호 변경 시 해싱
    if (updates.password) {
        updates.passwordHash = await bcrypt.hash(updates.password, 10);
        delete updates.password;
    }

    adminUsers[adminIndex] = {
        ...admin,
        ...updates,
        id: admin.id, // ID는 변경 불가
        createdAt: admin.createdAt // 생성일은 변경 불가
    };

    const { passwordHash, ...adminWithoutPassword } = adminUsers[adminIndex];
    return adminWithoutPassword;
}

// 관리자 계정 삭제
export function deleteAdmin(id) {
    const adminIndex = adminUsers.findIndex(admin => admin.id === id);
    if (adminIndex === -1) {
        throw new Error('관리자를 찾을 수 없습니다');
    }

    // super_admin은 삭제 불가
    if (adminUsers[adminIndex].role === 'super_admin' && adminUsers.filter(a => a.role === 'super_admin').length === 1) {
        throw new Error('마지막 슈퍼관리자는 삭제할 수 없습니다');
    }

    adminUsers.splice(adminIndex, 1);
    return true;
}

// 마지막 로그인 시간 업데이트
export function updateLastLogin(id) {
    const admin = findAdminById(id);
    if (admin) {
        admin.lastLogin = new Date().toISOString();
    }
}
