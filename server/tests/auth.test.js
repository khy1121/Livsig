import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { connectDatabase } from '../config/database.js';
import authRoutes from '../routes/auth.js';
import Admin from '../models/Admin.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { validateLogin } from '../middleware/validators.js';

// App Setup for Testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false
}));
app.use('/api/auth', validateLogin, authRoutes); // Apply middleware manually for test app

// Test Data
const TEST_ADMIN = {
    username: 'testadmin',
    password: 'password123'
};

beforeAll(async () => {
    // Connect to Test DB (Using a separate DB name or URI if possible, adhering to .env or default)
    // For safety, let's assume MONGODB_URI in environment is used (be careful not to wipe prod data if local)
    // Ideally, use a test-specific URI.

    // WARNING: In a real scenario, use process.env.MONGODB_TEST_URI
    if (!process.env.MONGODB_URI) {
        console.warn("MONGODB_URI not found, tests might fail or use default localhost");
    }
    await connectDatabase();
});

afterAll(async () => {
    // Cleanup
    await Admin.deleteOne({ username: TEST_ADMIN.username });
    await mongoose.connection.close();
});

describe('Auth API Checks', () => {

    beforeEach(async () => {
        // Create a test admin before tests if not exists
        const hashedPassword = await bcrypt.hash(TEST_ADMIN.password, 10);
        await Admin.findOneAndUpdate(
            { username: TEST_ADMIN.username },
            { username: TEST_ADMIN.username, passwordHash: hashedPassword, role: 'admin' },
            { upsert: true, new: true }
        );
    });

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(TEST_ADMIN);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toHaveProperty('username', TEST_ADMIN.username);
    });

    it('should fail login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: TEST_ADMIN.username,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });

    it('should fail login with non-existent user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'nouser',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });

    it('should validate input (empty fields)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: '',
                password: ''
            });

        expect(res.statusCode).toEqual(400); // Validation Error
        expect(res.body.success).toBe(false);
    });
});
