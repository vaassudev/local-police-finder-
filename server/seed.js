const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Station = require('./models/Station');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const seedData = async () => {
  try {
    await User.deleteMany();
    await Station.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@police.gov',
      phone: '9999999999',
      password: hashedPassword,
      role: 'admin'
    });

    await Station.create([
      {
        station_id: 'STN-101',
        name: 'Central HQ Police Station',
        address: '1st Avenue, Connaught Place, New Delhi',
        latitude: 28.6328,
        longitude: 77.2197,
        phone: '011-23381000',
        officer_name: 'Inspector Vikram Singh'
      },
      {
        station_id: 'STN-102',
        name: 'South District Station',
        address: 'Hauz Khas Village Road, New Delhi',
        latitude: 28.5555,
        longitude: 77.1983,
        phone: '011-26510000',
        officer_name: 'Inspector Neha Sharma'
      }
    ]);

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data', error);
    process.exit(1);
  }
};

seedData();
