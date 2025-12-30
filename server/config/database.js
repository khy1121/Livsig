import mongoose from 'mongoose';

export async function connectDatabase() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('Errors: MONGODB_URI is not defined in .env');
            return;
        }

        // Mongoose 6+ options (useNewUrlParser etc are deprecated/default now)
        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't exit process in dev mode to allow debugging, just log error
        console.log('Continuing without database connection...');
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});
