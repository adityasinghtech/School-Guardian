const School = require('../models/School');
const User = require('../models/User');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/apiResponse');
const generateToken = require('../utils/generateJWT');

// Generate readable school code like DPS-5624
const generateSchoolCode = (name) => {
    // Extract first 3 or 4 letters, uppercase them
    const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'SCH';
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digits
    return `${prefix}-${randomNum}`;
};

exports.registerSchool = asyncHandler(async (req, res, next) => {
    const { schoolName, address, contactEmail, contactPhone, principalName, adminEmail, adminPassword } = req.body;

    // Check if school already exists with same email
    const existingSchool = await School.findOne({ contactEmail });
    if (existingSchool) {
        return next(new ErrorResponse('A school with this email already exists', 400));
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
        return next(new ErrorResponse('A user with the admin email already exists', 400));
    }

    // Generate unique school code
    let schoolCode = generateSchoolCode(schoolName);
    let codeExists = await School.findOne({ schoolCode });
    while (codeExists) {
        schoolCode = generateSchoolCode(schoolName);
        codeExists = await School.findOne({ schoolCode });
    }

    // Create the School
    const school = await School.create({
        schoolName,
        schoolCode,
        address,
        contactEmail,
        contactPhone,
        principalName,
    });

    // Create the Admin User
    const adminUser = await User.create({
        name: principalName,
        email: adminEmail,
        password: adminPassword,
        role: 'Admin',
        schoolId: school._id,
    });

    // Update school createdBy
    school.createdBy = adminUser._id;
    await school.save();

    res.status(201).json({
        success: true,
        message: 'School registered successfully',
        data: {
            school,
            user: {
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
                schoolId: adminUser.schoolId,
                token: generateToken(adminUser._id),
            }
        }
    });
});

exports.getSchools = asyncHandler(async (req, res, next) => {
    const schools = await School.find({}).select('schoolName schoolCode');
    
    const data = schools.map(s => ({
        id: s._id,
        schoolName: s.schoolName,
        schoolCode: s.schoolCode
    }));

    res.status(200).json({
        success: true,
        data: data
    });
});
