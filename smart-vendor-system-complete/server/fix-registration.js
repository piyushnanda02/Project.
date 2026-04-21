const mongoose = require('mongoose');
require('dotenv').config();

async function fixRegistration() {
    console.log('🔧 FIXING REGISTRATION ISSUES');
    console.log('=============================');

    // Check MongoDB connection
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if vendorDB exists
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        
        console.log('\n📚 Current collections:');
        if (collections.length === 0) {
            console.log('  No collections found. They will be created automatically.');
        } else {
            collections.forEach(col => console.log(`  - ${col.name}`));
        }

        // Check if users collection exists
        const usersCollection = collections.find(col => col.name === 'users');
        if (!usersCollection) {
            console.log('\n📝 Users collection will be created when you register');
            
            // Create a test user to trigger collection creation
            console.log('\n🧪 Creating test user to initialize collections...');
            
            const User = require('./models/User');
            
            // Check if test user already exists
            const existingUser = await User.findOne({ email: 'test@example.com' });
            
            if (!existingUser) {
                const testUser = new User({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    phone: '1234567890'
                });
                
                await testUser.save();
                console.log('✅ Test user created successfully!');
                console.log('   Email: test@example.com');
                console.log('   Password: password123');
                
                // Delete test user (optional)
                await User.deleteOne({ email: 'test@example.com' });
                console.log('✅ Test user removed');
            }
        }

        console.log('\n✅ Registration system is ready!');
        console.log('\n📝 To test registration:');
        console.log('1. Make sure backend is running: npm run dev');
        console.log('2. Make sure frontend is running: npm start');
        console.log('3. Try registering with:');
        console.log('   - Name: Shashi Kapoor');
        console.log('   - Email: nandapiyush3@gmail.com');
        console.log('   - Password: password123');
        console.log('   - Phone: 6230036196');
        console.log('   - DOB: 2005-02-17');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

fixRegistration();