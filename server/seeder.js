const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const School = require('./models/School');
const Issue = require('./models/Issue');
const Repair = require('./models/Repair');
const Notification = require('./models/Notification');
const ActivityLog = require('./models/ActivityLog');
const Comment = require('./models/Comment');

dotenv.config();

const indianNames = ['Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Vihaan Kumar', 'Arjun Gupta', 'Sai Krishna', 'Ananya Desai', 'Diya Reddy', 'Isha Iyer', 'Riya Kapoor', 'Neha Joshi', 'Kavya Nair', 'Rahul Verma', 'Sneha Menon', 'Vikram Rathore', 'Pooja Chawla', 'Rohan Mehta', 'Priya Bhatia', 'Amit Tiwari', 'Kiran Das', 'Ramesh Yadav', 'Suresh Pillai', 'Manoj Jain', 'Sunil Agarwal', 'Rajesh Kulkarni', 'Sanjay Saxena', 'Rakesh Dubey', 'Vijay Chauhan', 'Sandeep Pandey', 'Ajay Mishra'];
const indianSchools = [
    { schoolName: 'Delhi Public School', schoolCode: 'DPS001', address: 'Mathura Road, New Delhi', principalName: 'Dr. R.K. Sharma', contactEmail: 'info@dpsmathuraroad.com', contactPhone: '011-2436-1122' },
    { schoolName: 'Kendriya Vidyalaya', schoolCode: 'KV002', address: 'JNU Campus, New Delhi', principalName: 'Mrs. S. Khanna', contactEmail: 'jnu@kvs.gov.in', contactPhone: '011-2674-1234' },
    { schoolName: 'St. Xavier’s High School', schoolCode: 'SXH003', address: 'Fort, Mumbai', principalName: 'Fr. Thomas', contactEmail: 'contact@xaviers.edu', contactPhone: '022-2262-0661' },
    { schoolName: 'Bishop Cotton Boys\' School', schoolCode: 'BCB004', address: 'Residency Road, Bangalore', principalName: 'Prof. John', contactEmail: 'admin@bishopcotton.com', contactPhone: '080-2221-3608' },
    { schoolName: 'La Martiniere College', schoolCode: 'LMC005', address: 'La Martiniere Road, Lucknow', principalName: 'Mr. C. McFarland', contactEmail: 'info@lamartiniere.edu', contactPhone: '0522-222-1234' }
];

const categories = ['Furniture', 'Electricity', 'Water Supply', 'Toilet', 'Sanitation', 'Roof', 'Classroom', 'Playground', 'Boundary Wall', 'Computer Lab', 'Science Lab', 'Library', 'Sports', 'Other'];
const priorities = ['Critical', 'High', 'Medium', 'Low'];

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log('MONGO_URI not found. Skipping seeder script execution.');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Seeding');

        // Clear existing data
        await User.deleteMany();
        await School.deleteMany();
        await Issue.deleteMany();
        await Repair.deleteMany();
        await Notification.deleteMany();
        await ActivityLog.deleteMany();
        await Comment.deleteMany();
        console.log('Cleared existing data');

        // 1. Create Schools (5)
        const createdSchools = await School.insertMany(indianSchools);
        console.log('Created 5 Schools');

        // 2. Create Admin
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@schoolguardian.com',
            password: 'password123',
            role: 'Admin',
            isActive: true
        });

        // 3. Create Users (20) & Repair Staff (10) (Total 30)
        const usersToCreate = [];
        for (let i = 0; i < 30; i++) {
            const role = i < 10 ? 'Teacher' : (i < 20 ? 'Parent' : 'Teacher'); // We don't have a explicit Repair Staff role. Let's make some Teachers act as staff since requirements said 'Parent, Teacher, Admin'. Wait, prompt asked for 10 Repair Staff. Let's assume 'Teacher' can be assigned repairs, or we add 'Staff' to User enum if not present. Our User schema currently has enum: ['Parent', 'Teacher', 'Admin']. Let's stick to the schema and just use 'Teacher' or 'Admin' as staff. We will assign 'Teacher' as staff.
            usersToCreate.push({
                name: indianNames[i],
                email: `user${i+1}@example.com`,
                password: 'password123',
                role: role,
                schoolId: createdSchools[i % 5]._id,
                isActive: true
            });
        }
        const createdUsers = await User.insertMany(usersToCreate);
        console.log('Created 30 Users (Parents & Teachers acting as Staff)');

        // 4. Create Issues (50)
        const issuesToCreate = [];
        for (let i = 0; i < 50; i++) {
            const statusOptions = ['Pending', 'Accepted', 'Assigned', 'In Progress', 'Completed', 'Verified'];
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            
            issuesToCreate.push({
                title: `Issue regarding ${categories[i % categories.length]} maintenance`,
                description: `We are facing issues with ${categories[i % categories.length]} in the school premises. Kindly resolve this at the earliest to ensure student safety.`,
                category: categories[i % categories.length],
                priority: priorities[i % priorities.length],
                location: `Block ${String.fromCharCode(65 + (i % 4))}, Room ${101 + i}`,
                status: status,
                school: createdSchools[i % 5]._id,
                reportedBy: createdUsers[i % 20]._id, // 0-19 are Parents/Teachers
                images: [`https://res.cloudinary.com/demo/image/upload/sample.jpg`]
            });
        }
        const createdIssues = await Issue.insertMany(issuesToCreate);
        console.log('Created 50 Issues');

        // 5. Create Repairs (10)
        const repairsToCreate = [];
        const inProgressIssues = createdIssues.filter(i => ['Assigned', 'In Progress', 'Completed', 'Verified'].includes(i.status));
        
        for (let i = 0; i < Math.min(10, inProgressIssues.length); i++) {
            const issue = inProgressIssues[i];
            const staff = createdUsers[20 + i]; // 20-29 are used as staff
            
            // Assign in issue as well
            await Issue.findByIdAndUpdate(issue._id, { assignedTo: staff._id });

            repairsToCreate.push({
                issue: issue._id,
                assignedStaff: staff._id,
                repairStatus: issue.status === 'Verified' ? 'Completed' : (issue.status === 'Completed' ? 'Completed' : issue.status),
                remarks: 'Working on it',
                completionDate: issue.status === 'Completed' || issue.status === 'Verified' ? new Date() : null,
                verifiedBy: issue.status === 'Verified' ? admin._id : null
            });
        }
        await Repair.insertMany(repairsToCreate);
        console.log('Created 10 Repairs');

        // 6. Create Notifications (100)
        const notificationsToCreate = [];
        for (let i = 0; i < 100; i++) {
            notificationsToCreate.push({
                user: createdUsers[Math.floor(Math.random() * 20)]._id,
                title: 'Status Update',
                message: 'Your issue status has been updated.',
                type: 'Info',
                isRead: Math.random() > 0.5,
                issueId: createdIssues[Math.floor(Math.random() * 50)]._id
            });
        }
        await Notification.insertMany(notificationsToCreate);
        console.log('Created 100 Notifications');

        // 7. Create Activity Logs (200)
        const activityLogsToCreate = [];
        const actions = ['Issue Created', 'Status Changed', 'Staff Assigned', 'Repair Completed'];
        for (let i = 0; i < 200; i++) {
            activityLogsToCreate.push({
                user: admin._id, // Assume admin did actions for simplicity
                action: actions[i % 4],
                module: 'Repair',
                issueId: createdIssues[i % 50]._id,
                newValue: 'In Progress',
                remarks: 'Automated log from seeder'
            });
        }
        await ActivityLog.insertMany(activityLogsToCreate);
        console.log('Created 200 Activity Logs');

        console.log('Database Seeding Completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeder Error:', error);
        process.exit(1);
    }
};

seedData();
