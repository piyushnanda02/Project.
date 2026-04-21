const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
    console.log('🔍 Checking Database Connection...');
    console.log('MongoDB URI:', process.env.MONGO_URI);

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');
        
        // List all databases
        const adminDb = mongoose.connection.db.admin();
        const dbs = await adminDb.listDatabases();
        console.log('\n📊 Available Databases:');
        dbs.databases.forEach(db => {
            console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });

        // Check if vendorDB exists
        const dbExists = dbs.databases.some(db => db.name === 'vendorDB');
        if (dbExists) {
            console.log('\n✅ vendorDB database exists');
            
            // Check collections
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('\n📚 Collections in vendorDB:');
            collections.forEach(col => {
                console.log(`  - ${col.name}`);
            });
        } else {
            console.log('\n⚠️  vendorDB database will be created when you add data');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database check complete!');
        
    } catch (error) {
        console.error('❌ Database Connection Failed:', error.message);
    }
}

checkDatabase();