import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false // 시스템 로그일 경우 null일 수 있음
    },
    adminUsername: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
            'CREATE_ADMIN', 'UPDATE_ADMIN', 'DELETE_ADMIN',
            'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT',
            'UPDATE_ORDER'
        ]
    },
    target: {
        type: String, // ID나 이름 등 식별자
        default: null
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String,
        default: 'unknown'
    }
}, {
    timestamps: true
});

// 인덱스
activityLogSchema.index({ adminId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
