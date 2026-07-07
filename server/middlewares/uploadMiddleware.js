const multer = require('multer');
const fs = require('fs');
const path = require('path');

let storage;

if (process.env.CLOUDINARY_URL) {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('cloudinary').v2;
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'school-guardian',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
    });
    console.log('Using Cloudinary for image storage');
} else {
    // Fallback to local disk storage if no Cloudinary URL
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    console.log('Using local disk storage for images (No Cloudinary URL found)');
}

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});
module.exports = upload;