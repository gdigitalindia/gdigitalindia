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
      text: `<p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.8; margin-bottom: 25px;">Our election management tools are designed to give you a complete edge during elections:</p>
<div class="gdi-cards-grid">
  <div class="gdi-feature-card theme-cyan">
    <div class="gdi-icon-circle"><i class="fa-solid fa-mobile-screen-button"></i></div>
    <h4 class="gdi-card-title">Voter Searching App</h4>
    <p class="gdi-card-desc">Instantly search any voter by name, EPIC, or mobile number</p>
  </div>
  <div class="gdi-feature-card theme-orange">
    <div class="gdi-icon-circle"><i class="fa-solid fa-print"></i></div>
    <h4 class="gdi-card-title">Voter Slip Printer</h4>
    <p class="gdi-card-desc">Print voter slips wirelessly using portable mobile thermal printers</p>
  </div>
  <div class="gdi-feature-card theme-emerald">
    <div class="gdi-icon-circle"><i class="fa-solid fa-clipboard-list"></i></div>
    <h4 class="gdi-card-title">Digital Voter List</h4>
    <p class="gdi-card-desc">Alphabetical and house-wise voter list management at your fingertips</p>
  </div>
  <div class="gdi-feature-card theme-amber">
    <div class="gdi-icon-circle"><i class="fa-solid fa-house-chimney-user"></i></div>
    <h4 class="gdi-card-title">House Wise Voter Slip</h4>
    <p class="gdi-card-desc">Organize and distribute voter slips booth-by-booth efficiently</p>
  </div>
  <div class="gdi-feature-card theme-purple">
    <div class="gdi-icon-circle"><i class="fa-solid fa-file-invoice"></i></div>
    <h4 class="gdi-card-title">Printed Voter Slips</h4>
    <p class="gdi-card-desc">High-quality printed voter slip materials ready for door-to-door distribution</p>
  </div>
  <div class="gdi-feature-card theme-rose">
    <div class="gdi-icon-circle"><i class="fa-solid fa-check-to-slot"></i></div>
    <h4 class="gdi-card-title">Dummy Voting Machine</h4>
    <p class="gdi-card-desc">Hands-on EVM demonstration setup for voter awareness and mock polls</p>
  </div>
  <div class="gdi-feature-card theme-blue">
    <div class="gdi-icon-circle"><i class="fa-solid fa-briefcase"></i></div>
    <h4 class="gdi-card-title">Booth Bags</h4>
    <p class="gdi-card-desc">Complete branded booth management kits for polling agents</p>
  </div>
  <div class="gdi-feature-card theme-pink">
    <div class="gdi-icon-circle"><i class="fa-solid fa-bullhorn"></i></div>
    <h4 class="gdi-card-title">Pop Up Campaigns</h4>
    <p class="gdi-card-desc">On-ground flash campaigns and street publicity drives</p>
  </div>
  <div class="gdi-feature-card theme-indigo">
    <div class="gdi-icon-circle"><i class="fa-solid fa-phone-volume"></i></div>
    <h4 class="gdi-card-title">OBD Campaigns</h4>
    <p class="gdi-card-desc">Automated outbound voice call broadcasts delivering candidate speeches</p>
  </div>
  <div class="gdi-feature-card theme-lime">
    <div class="gdi-icon-circle"><i class="fa-brands fa-meta"></i></div>
    <h4 class="gdi-card-title">Meta Campaigns</h4>
    <p class="gdi-card-desc">Geo-targeted Facebook and Instagram advertising across constituency</p>
  </div>
</div>`,
      image: ""
    },
    {
      title: "Election Publicity Solution",
      text: `<p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.8; margin-bottom: 25px;">Make your election campaign visible and impactful with our full range of Election Publicity Materials:</p>
<div class="gdi-cards-grid">
  <div class="gdi-feature-card theme-orange">
    <div class="gdi-icon-circle"><i class="fa-solid fa-shirt"></i></div>
    <h4 class="gdi-card-title">T-Shirts</h4>
    <p class="gdi-card-desc">Custom branded election campaign t-shirts for party workers</p>
  </div>
  <div class="gdi-feature-card theme-cyan">
    <div class="gdi-icon-circle"><i class="fa-solid fa-clock"></i></div>
    <h4 class="gdi-card-title">Wall Clock</h4>
    <p class="gdi-card-desc">Branded election wall clocks for voter homes and meeting halls</p>
  </div>
  <div class="gdi-feature-card theme-rose">
    <div class="gdi-icon-circle"><i class="fa-solid fa-flag"></i></div>
    <h4 class="gdi-card-title">Flags & Banners</h4>
    <p class="gdi-card-desc">High-visibility party flags, cloth banners, and vehicle flags</p>
  </div>
  <div class="gdi-feature-card theme-emerald">
    <div class="gdi-icon-circle"><i class="fa-solid fa-hat-cowboy-side"></i></div>
    <h4 class="gdi-card-title">Campaign Caps</h4>
    <p class="gdi-card-desc">Branded election campaign caps & sun visors for mass rallies</p>
  </div>
  <div class="gdi-feature-card theme-amber">
    <div class="gdi-icon-circle"><i class="fa-solid fa-ribbon"></i></div>
    <h4 class="gdi-card-title">Patka / Scarves</h4>
    <p class="gdi-card-desc">Traditional party scarves, stoles, and ceremonial election patkas</p>
  </div>
  <div class="gdi-feature-card theme-purple">
    <div class="gdi-icon-circle"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
    <h4 class="gdi-card-title">Jhallar (Lari)</h4>
    <p class="gdi-card-desc">Decorative campaign bunting strings for street and stage decorations</p>
  </div>
  <div class="gdi-feature-card theme-blue">
    <div class="gdi-icon-circle"><i class="fa-solid fa-id-badge"></i></div>
    <h4 class="gdi-card-title">Pocket Badge</h4>
    <p class="gdi-card-desc">Custom ID badges, photo badges, and pocket cards for party cadre</p>
  </div>
  <div class="gdi-feature-card theme-pink">
    <div class="gdi-icon-circle"><i class="fa-solid fa-key"></i></div>
    <h4 class="gdi-card-title">Key Chain</h4>
    <p class="gdi-card-desc">Custom branded acrylic and metallic keychain giveaways</p>
  </div>
  <div class="gdi-feature-card theme-indigo">
    <div class="gdi-icon-circle"><i class="fa-solid fa-book-bookmark"></i></div>
    <h4 class="gdi-card-title">Diary & Planners</h4>
    <p class="gdi-card-desc">Branded executive notebooks and diaries for key leaders</p>
  </div>
  <div class="gdi-feature-card theme-lime">
    <div class="gdi-icon-circle"><i class="fa-solid fa-pen-fancy"></i></div>
    <h4 class="gdi-card-title">Custom Pens</h4>
    <p class="gdi-card-desc">Printed promotional pens for widespread distribution</p>
  </div>
</div>`,
      image: ""
    },
    {
      title: "Voter App – Mobile Thermal Printer Support",
      text: `<p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.8; margin-bottom: 25px;">Our dedicated Voter App is the heart of our election management solution. Key features include:</p>
<div class="gdi-cards-grid">
  <div class="gdi-feature-card theme-orange">
    <div class="gdi-icon-circle"><i class="fa-solid fa-magnifying-glass"></i></div>
    <h4 class="gdi-card-title">Search (Khoje)</h4>
    <p class="gdi-card-desc">Find any voter within seconds by name, father name, or EPIC ID</p>
  </div>
  <div class="gdi-feature-card theme-cyan">
    <div class="gdi-icon-circle"><i class="fa-solid fa-sliders"></i></div>
    <h4 class="gdi-card-title">Advance Search</h4>
    <p class="gdi-card-desc">Filter voters dynamically by ward, booth number, age range, or gender</p>
  </div>
  <div class="gdi-feature-card theme-emerald">
    <div class="gdi-icon-circle"><i class="fa-solid fa-square-check"></i></div>
    <h4 class="gdi-card-title">EVM Ballot Paper</h4>
    <p class="gdi-card-desc">Digital ballot preparation and candidate serial display preview</p>
  </div>
  <div class="gdi-feature-card theme-amber">
    <div class="gdi-icon-circle"><i class="fa-solid fa-list-ol"></i></div>
    <h4 class="gdi-card-title">List (Suchi)</h4>
    <p class="gdi-card-desc">Full alphabetical, family-wise, and booth-wise voter lists</p>
  </div>
  <div class="gdi-feature-card theme-purple">
    <div class="gdi-icon-circle"><i class="fa-solid fa-language"></i></div>
    <h4 class="gdi-card-title">Language (Bhasha)</h4>
    <p class="gdi-card-desc">Easy one-tap switching between Hindi and English interface</p>
  </div>
  <div class="gdi-feature-card theme-rose">
    <div class="gdi-icon-circle"><i class="fa-solid fa-comment-sms"></i></div>
    <h4 class="gdi-card-title">Bulk Message</h4>
    <p class="gdi-card-desc">Directly broadcast instant SMS updates and appeal messages to voters</p>
  </div>
  <div class="gdi-feature-card theme-lime">
    <div class="gdi-icon-circle"><i class="fa-brands fa-whatsapp"></i></div>
    <h4 class="gdi-card-title">Bulk WhatsApp</h4>
    <p class="gdi-card-desc">Mass WhatsApp voter campaigns with flyers, video clips, and PDFs</p>
  </div>
  <div class="gdi-feature-card theme-blue">
    <div class="gdi-icon-circle"><i class="fa-solid fa-headset"></i></div>
    <h4 class="gdi-card-title">Voice Call</h4>
    <p class="gdi-card-desc">Automated outbound voice call broadcasts in candidate's voice</p>
  </div>
</div>`,
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
      console.log('Service updated successfully with modern card grid design!');
    } else {
      await collection.insertOne({
        ...electionService,
        createdAt: new Date()
      });
      console.log('Election Management Solution service added successfully!');
    }

    console.log('Done! The service will appear with modern card layout.');
    console.log('Service URL: /election-management-solution');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

main();
