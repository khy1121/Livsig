import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['주문확인', '배송중', '배송완료', '취소'],
        default: '주문확인'
    },
    date: {
        type: String, // YYYY-MM-DD 형식 유지를 위해 String 사용, 필요시 Date로 변경 가능
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        quantity: Number,
        price: Number
    }]
}, {
    timestamps: true
});

export default mongoose.model('Order', orderSchema);
