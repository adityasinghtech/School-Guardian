const dotenv = require('dotenv');
dotenv.config();

const validateEnv = () => {
    const required = ['MONGO_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    required.forEach((key) => {
        if (!process.env[key]) {
            console.error(`FATAL ERROR: ${key} is not defined in environment variables.`);
            process.exit(1);
        }
    });
};

module.exports = validateEnv;