const mongoose = require('mongoose');
const Package = require('./models/Package').default;

const uri = "mongodb://localhost:27017/my-next-app"; // Default local URI

async function seed() {
  await mongoose.connect(uri);
  
  const seoPkg = {
    title: 'SEO Packages',
    slug: 'seo-packages',
    category: 'SEO',
    description: 'SEO Packages That Drive More Traffic, Leads, and Sales From Search',
    plans: [
      {
        name: 'Startup Plan',
        priceMonthly: '8000',
        priceYearly: '80000',
        features: [
          'No. of Keywords - Up to 10',
          'Keywords Guarantee in Top 10-25%',
          'Keywords Research',
          'Initial Review & Analysis',
          'Competitors Analysis',
          'On-Page Optimization',
          'Link Building',
          'Content Marketing',
          'Local Search Optimization',
          'Monthly Reporting'
        ]
      },
      {
        name: 'Growth Plan',
        priceMonthly: '15000',
        priceYearly: '150000',
        isPopular: true,
        features: [
          'No. of Keywords - Up to 20',
          'Keywords Guarantee in Top 10-40%',
          'Keywords Research',
          'Initial Review & Analysis',
          'Competitors Analysis',
          'On-Page Optimization',
          'Schema & Structure Data Markup',
          'Link Building Weekly',
          'Content Marketing',
          'Local Search Optimization',
          'Social Media Marketing',
          'Guest Posting',
          'Press Release',
          'Monthly Reporting'
        ]
      },
      {
        name: 'Premium Plan',
        priceMonthly: '26000',
        priceYearly: '260000',
        features: [
          'No. of Keywords - Up to 40',
          'Keywords Guarantee in Top 10-50%',
          'Keywords Research',
          'Initial Review & Analysis',
          'Competitors Analysis',
          'On-Page Optimization',
          'Schema & Structure Data Markup',
          'Link Building',
          'Content Marketing',
          'Local Search Optimization',
          'Social Media Marketing',
          'Video Marketing',
          'Guest Posting',
          'Press Release',
          'Monthly 2 Reporting'
        ]
      }
    ]
  };

  await Package.findOneAndUpdate({ slug: 'seo-packages' }, seoPkg, { upsert: true });
  console.log('Seeded SEO Packages');
  process.exit();
}

seed();
