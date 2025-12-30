import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// 비밀번호 해싱 미들웨어 (저장 전 자동 실행)
// 비밀번호 해싱 미들웨어 (저장 전 자동 실행)
adminSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;

    // 이미 해시된 경우 스킵 (보통 $2로 시작)
    if (this.passwordHash.startsWith('$2')) return;

    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

// 비밀번호 검증 메서드
adminSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model('Admin', adminSchema);
