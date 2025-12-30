import Admin from '../models/Admin.model.js';
import Product from '../models/Product.model.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
    try {
        // 관리자 계정 생성
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const defaultPassword = process.env.ADMIN_PASSWORD || 'admin12345';
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);

            await Admin.create({
                username: process.env.ADMIN_USERNAME || 'admin',
                passwordHash: hashedPassword,
                role: 'super_admin'
            });
            console.log('✅ Default admin created');
        }

        // 샘플 상품 생성
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany([
                {
                    name: '프리미엄 파자마 세트',
                    category: 'pajamas',
                    price: 89000,
                    stock: 15,
                    description: '고급 면 소재의 편안한 파자마',
                    isNewProduct: true,
                    imageUrl: '/uploads/products/pajamas1.jpg'
                },
                {
                    name: '호텔식 슬리퍼',
                    category: 'slippers',
                    price: 35000,
                    stock: 20,
                    description: '부드러운 호텔식 슬리퍼',
                    isBest: true,
                    imageUrl: '/uploads/products/slippers1.jpg'
                },
                {
                    name: '린넨 앞치마',
                    category: 'aprons',
                    price: 45000,
                    stock: 30,
                    description: '내추럴한 감성의 린넨 앞치마',
                    imageUrl: '/uploads/products/apron1.jpg'
                }
            ]);
            console.log('✅ Sample products created');
        }
    } catch (error) {
        console.error('Seed error:', error);
    }
}
