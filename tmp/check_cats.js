const mongoose = require('mongoose');

async function main() {
  const uri = 'mongodb://127.0.0.1:27017/gdi-db';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    const categories = await db.collection('servicecategories').find({}).toArray();
    console.log('--- ALL CATEGORIES ---');
    console.log(JSON.stringify(categories, null, 2));

    const services = await db.collection('services').find({}).toArray();
    console.log('--- ALL SERVICES ---');
    console.log(services.map(s => ({ title: s.title, category: s.category, slug: s.slug })));

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
