// const { MongoClient } = require('mongodb');

// async function checkConnection() {
//   const client = new MongoClient(process.env.MONGO_URI);
  
//   try {
//     await client.connect();
//     console.log('✅ Successfully connected to MongoDB');
    
//     // Verify database access
//     const db = client.db('document_verification_db');
//     await db.command({ ping: 1 });
//     console.log('✅ Database ping successful');
    
//     // List collections
//     const collections = await db.listCollections().toArray();
//     console.log('📁 Collections:', collections.map(c => c.name));
    
//     return true;
//   } catch (err) {
//     console.error('❌ Connection failed:', err);
//     return false;
//   } finally {
//     await client.close();
//   }
// }

// checkConnection();