// seed-election-management.js
// Run with: node appData/seed-election-management.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb://gdigitalindia2_db_user:NCdIHHmCP8eNyC9j@ac-rcmtkhm-shard-00-00.r1lhqir.mongodb.net:27017,ac-rcmtkhm-shard-00-01.r1lhqir.mongodb.net:27017,ac-rcmtkhm-shard-00-02.r1lhqir.mongodb.net:27017/gdi-db?ssl=true&authSource=admin&retryWrites=true&w=majority";

const electionService = {
  title: "Election Management Solution",
  slug: "election-management-solution",
  short: "Election Management",
  category: "IT Solutions & Software",
  industry: "",
  descriptionHeading: "Smart Election Management Solutions – चुनाव की तैयारी, हमारे साथ!",
  description: `<p>G Digital India provides a comprehensive <strong>Election Management Solution</strong> powered by advanced mobile technology and digital tools. Our platform helps candidates, political parties, and campaign managers streamline their entire election campaign — from voter management to publicity materials.</p>
<p>We offer a <strong>Voter App with Mobile Thermal Printer Support</strong> that allows you to search voters, print voter slips, manage alphabetical voter lists, and run bulk communication campaigns — all from your smartphone.</p>`,
  highlight: "Complete digital election campaign management with voter slip printing, bulk messaging, OBD campaigns, and election publicity solutions.",
  tags: [
    "Election Management",
    "Voter App",
    "Voter Slip Printer",
    "Digital Voter List",
    "OBD Campaigns",
    "Election Publicity",
    "Bulk WhatsApp",
    "Voice Call Campaign"
  ],
  image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80",
  contentBlocks: [
    {
      title: "Election Management Tools",
      text: `<p>Our election management tools are designed to give you a complete edge during elections:</p>
<ul>
  <li><strong>Voter Searching App</strong> – Instantly search any voter from your mobile</li>
  <li><strong>Voter Slip Printer</strong> – Print voter slips wirelessly using mobile thermal printers</li>
  <li><strong>Digital Voter List</strong> – Alphabetical and house-wise voter list management</li>
  <li><strong>House Wise Voter Slip</strong> – Organize slips booth-by-booth efficiently</li>
  <li><strong>Printed Voter Slips</strong> – High-quality printed materials for distribution</li>
  <li><strong>Dummy Voting Machine</strong> – Practice EVM demonstration for awareness</li>
  <li><strong>Booth Bags</strong> – Branded booth management kits</li>
  <li><strong>Pop Up Campaigns</strong> – On-ground popup campaign management</li>
  <li><strong>OBD Campaigns</strong> – Automated outbound dialing voter outreach</li>
  <li><strong>Meta Campaigns</strong> – Facebook and Instagram election advertising</li>
</ul>`,
      image: ""
    },
    {
      title: "Election Publicity Solution",
      text: `<p>Make your election campaign visible and impactful with our full range of Election Publicity Materials:</p>
<ul>
  <li><strong>T-Shirts</strong> – Custom branded campaign t-shirts</li>
  <li><strong>Wall Clock</strong> – Branded wall clocks for voter homes</li>
  <li><strong>Flags</strong> – Campaign flags and banners</li>
  <li><strong>Caps</strong> – Branded election campaign caps</li>
  <li><strong>Patka</strong> – Traditional campaign scarves</li>
  <li><strong>Jhallar (Lari)</strong> – Decorative campaign bunting strings</li>
  <li><strong>Pocket Batch</strong> – ID badges and pocket cards</li>
  <li><strong>Key Chain</strong> – Branded keychain giveaways</li>
  <li><strong>Dairy</strong> – Branded diaries for voter distribution</li>
  <li><strong>Pen</strong> – Branded pens for mass distribution</li>
</ul>`,
      image: ""
    },
    {
      title: "Voter App – Mobile Thermal Printer Support",
      text: `<p>Our dedicated Voter App is the heart of our election management solution. Features include:</p>
<ul>
  <li><strong>Search (Khoje)</strong> – Find any voter quickly</li>
  <li><strong>Advance Search</strong> – Filter voters by ward, booth, age, gender</li>
  <li><strong>EVM Ballot Paper</strong> – Digital ballot preparation tools</li>
  <li><strong>List (Suchi)</strong> – Full alphabetical voter list</li>
  <li><strong>Language (Bhasha)</strong> – Multi-language support</li>
  <li><strong>Bulk Message</strong> – Send SMS to thousands of voters</li>
  <li><strong>Bulk WhatsApp</strong> – Mass WhatsApp campaign</li>
  <li><strong>Voice Call</strong> – Automated voice call campaigns</li>
</ul>`,
      image: ""
    }
  ],
  faqs: [
    {
      q: "What is the Election Management Solution by G Digital India?",
      a: "It is a comprehensive digital platform that helps candidates and political parties manage their election campaigns efficiently — including voter management, voter slip printing, bulk messaging, OBD calls, and election publicity materials."
    },
    {
      q: "How does the Voter App work?",
      a: "The Voter App connects with a mobile thermal printer via Bluetooth. You can search for voters, print voter slips on-the-spot, view alphabetical or house-wise voter lists, and communicate with voters through bulk SMS, WhatsApp, and voice calls."
    },
    {
      q: "What types of election publicity materials do you provide?",
      a: "We provide T-shirts, wall clocks, flags, caps, patka, jhallar (lari), pocket badges, key chains, diaries, and pens — all custom branded with your campaign details."
    },
    {
      q: "Do you support Meta (Facebook/Instagram) advertising for elections?",
      a: "Yes! We run targeted Meta Campaigns on Facebook and Instagram to reach voters in your constituency with personalized political ads and messaging."
    },
    {
      q: "What is an OBD Campaign?",
      a: "OBD (Outbound Dialing) Campaign is an automated voice call system that delivers your pre-recorded campaign message to thousands of voters simultaneously — an extremely effective and low-cost outreach tool."
    },
    {
      q: "How can I get started with your Election Management Solution?",
      a: "Simply call us at +91 9116175151 or fill out the enquiry form. Our team will schedule a demo and create a customized election campaign plan for you."
    }
  ],
  order: 9,
  metaTitle: "Election Management Solution | Voter App & Election Publicity | G Digital India",
  metaDescription: "Complete Election Management Solution by G Digital India – Voter App, voter slip printing, digital voter list, OBD campaigns, bulk WhatsApp, and election publicity materials. Call +91 9116175151",
  metaKeywords: "election management solution, voter app, voter slip printer, digital voter list, OBD campaign, election publicity, bulk WhatsApp election, election t-shirts Jaipur"
};

async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('gdi-db');
    const collection = db.collection('services');

    // Check if already exists
    const existing = await collection.findOne({ slug: 'election-management-solution' });
    if (existing) {
      console.log('Service already exists. Updating...');
      await collection.updateOne(
        { slug: 'election-management-solution' },
        { $set: electionService }
      );
      console.log('Service updated successfully!');
    } else {
      await collection.insertOne({
        ...electionService,
        createdAt: new Date()
      });
      console.log('Election Management Solution service added successfully!');
    }

    console.log('Done! The service will appear in the navbar under "IT Solutions & Software".');
    console.log('Service URL will be: /election-management-solution');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

main();
