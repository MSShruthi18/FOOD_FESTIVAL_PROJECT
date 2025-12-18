const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodFestival';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Get all stalls
    const stalls = await db.collection('stalls').find().toArray();
    console.log(`\n📊 Found ${stalls.length} stalls:`);
    stalls.forEach(s => console.log(`   - ${s.name}: ${s._id}`));
    
    // Get all dishes
    const dishes = await db.collection('dishes').find().toArray();
    console.log(`\n🍽️  Found ${dishes.length} dishes\n`);
    
    // Update each dish with a valid stallId
    for (let i = 0; i < dishes.length; i++) {
      const stallIndex = i % stalls.length; // Distribute dishes across stalls
      const newStallId = stalls[stallIndex]._id;
      
      await db.collection('dishes').updateOne(
        { _id: dishes[i]._id },
        { $set: { stallId: newStallId } }
      );
      
      console.log(`✓ ${dishes[i].name} → ${stalls[stallIndex].name}`);
    }
    
    console.log('\n✅ All dishes updated successfully!');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });