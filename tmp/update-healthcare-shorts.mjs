import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://gdigitalindia2_db_user:NCdIHHmCP8eNyC9j@ac-rcmtkhm-shard-00-00.r1lhqir.mongodb.net:27017,ac-rcmtkhm-shard-00-01.r1lhqir.mongodb.net:27017,ac-rcmtkhm-shard-00-02.r1lhqir.mongodb.net:27017/gdi-db?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const industriesCol = db.collection('industries');
    const reelsCol = db.collection('reels');

    const reels = await reelsCol.find({}).toArray();
    console.log('Found reels:', reels.length);

    const healthcare = await industriesCol.findOne({ slug: 'healthcare' });
    console.log('Found healthcare industry:', healthcare ? healthcare.title : 'Not found');

    const defaultShorts = [
      { title: "Doctor Video Consultation & Medical Advice", url: "https://www.youtube.com/shorts/3l8v_kK4hW4" },
      { title: "Patient Awareness & Clinical Insights", url: "https://www.youtube.com/shorts/J1_G2mR0-iA" },
      { title: "Modern Hospital Infrastructure & Patient Care", url: "https://www.youtube.com/shorts/5e_0HkP8X5c" },
      { title: "Healthcare Digital Growth & Clinic Branding", url: "https://www.youtube.com/shorts/aqz-KE-bpKQ" }
    ];

    const result = await industriesCol.updateOne(
      { slug: 'healthcare' },
      {
        $set: {
          shortsTitle: "Trending Healthcare YouTube Shorts & Video Campaigns",
          youtubeShorts: defaultShorts
        }
      }
    );

    console.log('Update result:', result);

    const updated = await industriesCol.findOne({ slug: 'healthcare' });
    console.log('Updated healthcare youtubeShorts:', updated.youtubeShorts);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
