const mongoose = require('mongoose');
const dotenv = require('dotenv');
const School = require('./models/School');

dotenv.config();

const seedSchools = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const count = await School.countDocuments();
        if (count > 0) {
            console.log('Schools already exist.');
            process.exit(0);
        }

        const schools = [
            {
                schoolName: 'Delhi Public School, RK Puram',
                schoolCode: 'DPS001',
                address: 'Sector 12, RK Puram, New Delhi',
                principalName: 'Dr. Anita Singh',
                contactEmail: 'contact@dpsrkp.net',
                contactPhone: '011-26171267'
            },
            {
                schoolName: 'Kendriya Vidyalaya, IIT Bombay',
                schoolCode: 'KVIIT001',
                address: 'IIT Area, Powai, Mumbai',
                principalName: 'Mr. Ramesh Kumar',
                contactEmail: 'kv_iitb@yahoo.co.in',
                contactPhone: '022-25728876'
            },
            {
                schoolName: 'St. Xavier\'s High School',
                schoolCode: 'STX001',
                address: 'Navrangpura, Ahmedabad',
                principalName: 'Fr. Charles',
                contactEmail: 'admin@stxaviers.edu',
                contactPhone: '079-26442478'
            }
        ];

        await School.insertMany(schools);
        console.log('Successfully seeded Indian schools!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding schools:', err);
        process.exit(1);
    }
};

seedSchools();
