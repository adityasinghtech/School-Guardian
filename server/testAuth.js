const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AuthService = require('./services/authService');
const User = require('./models/User');

let mongoServer;

const startTest = async () => {
    try {
        console.log('Starting MongoDB Memory Server...');
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log('Connected to In-Memory DB.');

        // Test Register
        console.log('\\n--- Testing Registration ---');
        const userData = {
            name: 'Test Parent',
            email: 'parent@test.com',
            password: 'password123',
            role: 'Parent'
        };
        const registerResponse = await AuthService.register(userData);
        console.log('Registration Successful:', registerResponse.email === 'parent@test.com' && !!registerResponse.token);

        // Test Duplicate Register
        try {
            await AuthService.register(userData);
            console.log('Duplicate Registration FAILED: Should have thrown an error');
        } catch (err) {
            console.log('Duplicate Registration Caught:', err.message);
        }

        // Test Login
        console.log('\\n--- Testing Login ---');
        const loginResponse = await AuthService.login('parent@test.com', 'password123');
        console.log('Login Successful:', loginResponse.email === 'parent@test.com' && !!loginResponse.token);
        
        // Test Wrong Password
        try {
            await AuthService.login('parent@test.com', 'wrongpassword');
            console.log('Wrong Password Login FAILED: Should have thrown an error');
        } catch (err) {
            console.log('Wrong Password Caught:', err.message);
        }

        // Test Get Profile
        console.log('\\n--- Testing Get Profile ---');
        const profileResponse = await AuthService.getProfile(loginResponse._id);
        console.log('Get Profile Successful:', profileResponse.name === 'Test Parent' && !profileResponse.password);
        
        // Test Inactive User Login
        console.log('\\n--- Testing Inactive Login ---');
        const user = await User.findOne({ email: 'parent@test.com' });
        user.isActive = false;
        await user.save();

        try {
            await AuthService.login('parent@test.com', 'password123');
            console.log('Inactive Login FAILED: Should have thrown an error');
        } catch (err) {
            console.log('Inactive Login Caught:', err.message);
        }

        console.log('\\nAll tests completed successfully.');
    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    }
};

// Set env var for JWT secret
process.env.JWT_SECRET = 'testsecret';

startTest();
