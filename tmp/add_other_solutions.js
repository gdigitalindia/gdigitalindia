const mongoose = require('mongoose');

async function main() {
  const uri = 'mongodb://127.0.0.1:27017/gdi-db';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;

    // 1. Create "Other Solution" category
    console.log('Creating "Other Solution" category...');
    await db.collection('servicecategories').updateOne(
      { name: 'Other Solution' },
      {
        $set: {
          name: 'Other Solution',
          slug: 'other-solution',
          title: 'Other IT Solutions & Software',
          description: '<p>Beyond digital marketing and websites, G Digital India provides a comprehensive range of custom IT solutions and management software tailored for diverse industries. From IVR systems to AI-powered calling, from loan management to manufacturing job work — we build technology that simplifies your business operations.</p>',
          image: '',
          contentBlocks: [],
          order: 5,
          metaTitle: 'Custom IT Solutions & Business Software | G Digital India',
          metaDescription: 'Explore our range of custom IT solutions including IVR, AI Calling, Loan Management, Insurance Software, and more.',
          metaKeywords: 'IVR solution, AI calling, loan management software, dry cleaning software, exhibition management, insurance management, manufacturing software',
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    console.log('"Other Solution" category created!');

    // 2. Upsert all 7 subcategories with rich content
    const subcategories = [
      {
        title: 'IVR Solution',
        slug: 'ivr-solution',
        short: 'IVR',
        category: 'Other Solution',
        descriptionHeading: 'Smart IVR Systems for Seamless Customer Communication',
        description: '<p>Transform your customer communication with our intelligent IVR (Interactive Voice Response) solutions. Our IVR systems are designed to handle high call volumes, route calls efficiently, and provide instant self-service options to your callers — reducing wait times and boosting customer satisfaction.</p><p>Whether you need a simple auto-attendant or a multi-level IVR with CRM integration, G Digital India builds customized voice response systems that work 24/7, ensuring no call goes unanswered and every customer interaction is smooth and professional.</p>',
        highlight: 'Reduce call handling time by up to 60% with intelligent call routing.',
        tags: ['Auto-Attendant', 'Call Routing', 'CRM Integration', 'Multi-Language Support', 'Call Analytics', '24/7 Availability'],
        image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80',
        contentBlocks: [
          {
            title: 'Why Your Business Needs an IVR System',
            text: '<p>In today\'s fast-paced business environment, customers expect instant responses. An IVR system ensures that every incoming call is handled professionally — greeting callers, providing menu options, and routing them to the right department without human intervention.</p><ul><li><strong>24/7 Availability:</strong> Your IVR never sleeps. Customers can reach you anytime, even after business hours.</li><li><strong>Reduced Operational Costs:</strong> Automate repetitive queries and free up your team for complex tasks.</li><li><strong>Professional Image:</strong> A well-designed IVR gives your business a corporate, trustworthy feel.</li><li><strong>Scalability:</strong> Handle 10 calls or 10,000 calls simultaneously without additional staff.</li></ul>',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80'
          },
          {
            title: 'Our IVR Features & Capabilities',
            text: '<p>G Digital India builds feature-rich IVR solutions tailored to your business workflow:</p><ul><li><strong>Multi-Level Menu:</strong> Create complex call flows with nested menus for different departments.</li><li><strong>CRM Integration:</strong> Sync caller data with your CRM for personalized greetings and faster resolution.</li><li><strong>Call Recording & Analytics:</strong> Record all calls and get detailed reports on call patterns, peak hours, and agent performance.</li><li><strong>SMS & WhatsApp Integration:</strong> Send automated follow-up messages after calls.</li><li><strong>Multi-Language Support:</strong> Serve customers in Hindi, English, and regional languages.</li></ul>',
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80'
          }
        ],
        faqs: [
          { q: 'How long does it take to set up an IVR system?', a: 'A basic IVR can be set up within 2-3 business days. Complex multi-level systems with CRM integration typically take 1-2 weeks depending on your requirements.' },
          { q: 'Can the IVR integrate with my existing phone system?', a: 'Yes, our IVR solutions are compatible with most PBX systems, SIP trunks, and cloud telephony providers. We handle the complete integration.' },
          { q: 'Do you provide call analytics and reporting?', a: 'Absolutely. You get a detailed dashboard showing call volume, peak hours, average handling time, caller demographics, and agent performance metrics.' }
        ],
        order: 1,
        metaTitle: 'IVR Solution Provider in Jaipur | G Digital India',
        metaDescription: 'Get intelligent IVR systems with auto-attendant, call routing, CRM integration, and 24/7 availability. Reduce costs and improve customer experience.',
        createdAt: new Date()
      },
      {
        title: 'AI Calling Solution',
        slug: 'ai-calling-solution',
        short: 'AI Calling',
        category: 'Other Solution',
        descriptionHeading: 'AI-Powered Automated Calling for Smart Business Outreach',
        description: '<p>Revolutionize your outreach with G Digital India\'s AI Calling Solutions. Our AI-driven calling systems use natural language processing and machine learning to conduct human-like conversations at scale — perfect for lead qualification, appointment reminders, feedback collection, and sales follow-ups.</p><p>Imagine making thousands of personalized calls simultaneously, with an AI agent that understands context, responds naturally, and captures data automatically. That\'s the power of our AI calling platform.</p>',
        highlight: 'Make 10,000+ personalized calls per day with AI agents that sound human.',
        tags: ['Natural Language AI', 'Auto-Dialer', 'Lead Qualification', 'Appointment Reminders', 'Feedback Collection', 'CRM Sync'],
        image: 'https://images.unsplash.com/photo-1531746790095-e5e7e3ee2384?w=800&q=80',
        contentBlocks: [
          {
            title: 'How AI Calling Transforms Your Business',
            text: '<p>Traditional calling campaigns are expensive and time-consuming. AI calling changes the game:</p><ul><li><strong>Scale Without Limits:</strong> Make thousands of calls simultaneously — no need for large call center teams.</li><li><strong>Consistent Quality:</strong> Every call follows your script perfectly. No bad days, no missed points.</li><li><strong>Smart Lead Scoring:</strong> AI analyzes responses in real-time and scores leads automatically, sending hot leads directly to your sales team.</li><li><strong>Multi-Language Support:</strong> Our AI agents can converse in Hindi, English, and other Indian languages naturally.</li><li><strong>Cost Reduction:</strong> Cut your outbound calling costs by up to 80% compared to manual calling.</li></ul>',
            image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80'
          },
          {
            title: 'Use Cases for AI Calling',
            text: '<p>Our AI calling platform is versatile and works across industries:</p><ul><li><strong>Sales Follow-ups:</strong> Automatically follow up with leads who filled forms or showed interest.</li><li><strong>Appointment Reminders:</strong> Reduce no-shows by 40% with automated reminder calls.</li><li><strong>Payment Reminders:</strong> Politely remind customers about upcoming or overdue payments.</li><li><strong>Customer Feedback:</strong> Collect NPS scores and feedback at scale after every interaction.</li><li><strong>Event Invitations:</strong> Invite hundreds of people to your events with personalized calls.</li></ul>',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80'
          }
        ],
        faqs: [
          { q: 'Does the AI sound robotic?', a: 'Not at all. Our AI uses advanced text-to-speech with natural intonation. Most callers cannot distinguish it from a human agent. We also offer custom voice cloning options.' },
          { q: 'Can I customize the calling script?', a: 'Yes, you have full control over the conversation flow, scripts, and responses. Our team helps you design optimal conversation trees for maximum conversion.' },
          { q: 'What happens when the AI cannot answer a question?', a: 'The AI gracefully transfers the call to a human agent or captures the query for follow-up. You can configure fallback rules based on your needs.' }
        ],
        order: 2,
        metaTitle: 'AI Calling Solution & Auto-Dialer | G Digital India',
        metaDescription: 'AI-powered automated calling for lead qualification, appointment reminders, and sales outreach. Make 10,000+ personalized calls daily.',
        createdAt: new Date()
      },
      {
        title: 'Loan Management Software',
        slug: 'loan-management-software',
        short: 'Loan Management',
        category: 'Other Solution',
        descriptionHeading: 'Complete Loan Management Software for NBFCs & Micro-Finance',
        description: '<p>Manage your entire loan lifecycle digitally with G Digital India\'s comprehensive Loan Management Software. From loan application and KYC verification to EMI collection, interest calculation, and reporting — our software automates every step of the lending process.</p><p>Built for NBFCs, micro-finance institutions, gold loan companies, and private lenders, our platform ensures compliance, reduces manual errors, and gives you real-time visibility into your loan portfolio.</p>',
        highlight: 'End-to-end loan lifecycle automation — from application to closure.',
        tags: ['Loan Origination', 'EMI Calculator', 'KYC Verification', 'Payment Tracking', 'Interest Calculation', 'Compliance Reports', 'Borrower Portal'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
        contentBlocks: [
          {
            title: 'Features of Our Loan Management System',
            text: '<p>Our loan management software covers the complete lending workflow:</p><ul><li><strong>Loan Origination:</strong> Digital application forms, document upload, and automated eligibility checks.</li><li><strong>KYC & Verification:</strong> Aadhaar, PAN, and bank statement verification integrated directly.</li><li><strong>Flexible Interest Models:</strong> Support for flat rate, reducing balance, daily interest, and custom schemes.</li><li><strong>EMI Collection:</strong> Auto-generated EMI schedules, payment reminders via SMS/WhatsApp, and online payment links.</li><li><strong>Overdue & NPA Management:</strong> Automatic flagging of overdue accounts with escalation workflows.</li><li><strong>Reports & Compliance:</strong> Generate RBI-compliant reports, portfolio summaries, and profitability analysis.</li></ul>',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'
          },
          {
            title: 'Who Is This Software For?',
            text: '<p>Our loan management platform is designed for:</p><ul><li><strong>NBFCs:</strong> Non-banking financial companies managing personal, business, or vehicle loans.</li><li><strong>Micro-Finance Institutions:</strong> Group lending, JLG models, and rural credit management.</li><li><strong>Gold Loan Companies:</strong> Gold valuation, pledge tracking, and auction management.</li><li><strong>Private Lenders:</strong> Individual lenders managing multiple borrowers and loan types.</li><li><strong>Cooperative Banks:</strong> Member management, savings, and lending modules.</li></ul>',
            image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&q=80'
          }
        ],
        faqs: [
          { q: 'Is the software RBI compliant?', a: 'Yes, our loan management software generates all required compliance reports and follows RBI guidelines for NBFCs and micro-finance institutions.' },
          { q: 'Can borrowers make online payments?', a: 'Yes, we integrate payment gateways so borrowers can pay EMIs online. They also get a self-service portal to view their loan details, download statements, and make payments.' },
          { q: 'Do you provide mobile app access?', a: 'Yes, field agents get a mobile app for on-ground verification, collection tracking, and loan disbursement approvals.' }
        ],
        order: 3,
        metaTitle: 'Loan Management Software for NBFCs | G Digital India',
        metaDescription: 'Complete loan management software for NBFCs, micro-finance, and private lenders. EMI tracking, KYC verification, and compliance reports.',
        createdAt: new Date()
      },
      {
        title: 'Dry Cleaning Management',
        slug: 'dry-cleaning-management',
        short: 'Dry Cleaning',
        category: 'Other Solution',
        descriptionHeading: 'Smart Dry Cleaning & Laundry Management Software',
        description: '<p>Streamline your dry cleaning and laundry business with our intelligent management software. From order booking and garment tracking to billing, delivery scheduling, and customer management — everything is automated and accessible from a single dashboard.</p><p>Whether you run a single outlet or a multi-branch chain, our software helps you manage operations efficiently, reduce turnaround time, and deliver a premium customer experience.</p>',
        highlight: 'Track every garment from pickup to delivery with barcode/QR-based tagging.',
        tags: ['Order Management', 'Garment Tracking', 'Barcode/QR Tags', 'Route Optimization', 'Customer App', 'Multi-Branch Support', 'Invoice & Billing'],
        image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80',
        contentBlocks: [
          {
            title: 'How Our Software Simplifies Dry Cleaning Operations',
            text: '<p>Running a dry cleaning business involves juggling hundreds of orders daily. Our software brings order to the chaos:</p><ul><li><strong>Digital Order Booking:</strong> Book orders via counter, phone, or customer app with automatic price calculation.</li><li><strong>Garment Tagging:</strong> Assign unique barcode or QR tags to each garment for accurate tracking and zero mix-ups.</li><li><strong>Process Tracking:</strong> Track garments through every stage — received, washing, ironing, quality check, ready for delivery.</li><li><strong>Pickup & Delivery:</strong> Schedule pickups and deliveries with route optimization for your drivers.</li><li><strong>Customer Notifications:</strong> Automatic SMS/WhatsApp updates when garments are ready.</li></ul>',
            image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80'
          },
          {
            title: 'Business Growth Features',
            text: '<p>Beyond operations, our software helps you grow your dry cleaning business:</p><ul><li><strong>Customer Loyalty Programs:</strong> Points, prepaid wallets, and membership plans to retain customers.</li><li><strong>Multi-Branch Dashboard:</strong> Manage multiple outlets from a single admin panel with branch-wise reporting.</li><li><strong>Expense & Revenue Tracking:</strong> Track daily expenses, revenue, and profit margins per branch.</li><li><strong>Marketing Automation:</strong> Send promotional offers and seasonal discounts to your customer base.</li><li><strong>Customer App:</strong> A branded mobile app where customers can place orders, track status, and make payments.</li></ul>',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80'
          }
        ],
        faqs: [
          { q: 'Can I manage multiple branches from one system?', a: 'Yes, our software supports multi-branch operations. You get a centralized dashboard with branch-wise reports, inventory tracking, and staff management.' },
          { q: 'Do customers get a mobile app?', a: 'Yes, we provide a branded customer app where they can place orders, track garment status in real-time, view history, and make online payments.' },
          { q: 'How does garment tracking work?', a: 'Each garment gets a unique barcode or QR code tag at intake. Staff scan tags at every processing stage, giving you and the customer real-time visibility.' }
        ],
        order: 4,
        metaTitle: 'Dry Cleaning & Laundry Management Software | G Digital India',
        metaDescription: 'Smart dry cleaning management software with garment tracking, customer app, multi-branch support, and automated billing.',
        createdAt: new Date()
      },
      {
        title: 'Exhibition Management',
        slug: 'exhibition-management',
        short: 'Exhibition',
        category: 'Other Solution',
        descriptionHeading: 'End-to-End Exhibition & Event Management Software',
        description: '<p>Plan, organize, and execute exhibitions and trade shows flawlessly with G Digital India\'s Exhibition Management Software. Our platform handles everything — from exhibitor registration and stall allocation to visitor management, lead capture, and post-event analytics.</p><p>Designed for event organizers, trade bodies, and corporate event teams, our software ensures every exhibition runs smoothly, exhibitors get maximum ROI, and visitors have a seamless experience.</p>',
        highlight: 'Manage exhibitors, visitors, stalls, and leads — all from one platform.',
        tags: ['Exhibitor Portal', 'Stall Allocation', 'Visitor Registration', 'Lead Capture', 'Floor Plan Designer', 'Badge Printing', 'Post-Event Analytics'],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        contentBlocks: [
          {
            title: 'Complete Exhibition Lifecycle Management',
            text: '<p>Our software covers the entire exhibition lifecycle:</p><ul><li><strong>Exhibitor Registration:</strong> Online portal for exhibitors to register, choose stall sizes, and make payments.</li><li><strong>Stall Allocation:</strong> Visual floor plan designer for easy stall mapping and allocation.</li><li><strong>Visitor Registration:</strong> QR-code based registration for fast entry and badge printing.</li><li><strong>Lead Capture:</strong> Exhibitors can scan visitor badges to capture leads digitally — no more paper forms.</li><li><strong>Real-Time Dashboard:</strong> Live stats on registrations, footfall, and exhibitor engagement.</li></ul>',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80'
          },
          {
            title: 'Post-Event Analytics & ROI Tracking',
            text: '<p>The event doesn\'t end when the doors close. Our analytics module helps you measure success:</p><ul><li><strong>Visitor Analytics:</strong> Demographics, peak hours, session popularity, and engagement metrics.</li><li><strong>Exhibitor ROI Reports:</strong> Lead count, booth traffic, and follow-up conversion rates per exhibitor.</li><li><strong>Feedback Collection:</strong> Automated surveys sent to visitors and exhibitors post-event.</li><li><strong>Revenue Reports:</strong> Complete financial overview — stall sales, sponsorships, and ticket revenue.</li><li><strong>Historical Data:</strong> Compare performance across multiple editions of the same exhibition.</li></ul>',
            image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80'
          }
        ],
        faqs: [
          { q: 'Can exhibitors register and pay online?', a: 'Yes, exhibitors get a dedicated portal to register, choose stall types and sizes, upload documents, and make online payments securely.' },
          { q: 'How does visitor badge printing work?', a: 'Visitors register online or on-site using a kiosk. The system generates a unique QR-coded badge instantly for fast entry and exhibitor lead scanning.' },
          { q: 'Can I manage multiple exhibitions?', a: 'Yes, you can manage multiple exhibitions simultaneously. Each event gets its own dashboard, exhibitor list, floor plan, and analytics.' }
        ],
        order: 5,
        metaTitle: 'Exhibition & Trade Show Management Software | G Digital India',
        metaDescription: 'Complete exhibition management with exhibitor registration, stall allocation, visitor badges, lead capture, and post-event analytics.',
        createdAt: new Date()
      },
      {
        title: 'Insurance Management Solution',
        slug: 'insurance-management-solution',
        short: 'Insurance',
        category: 'Other Solution',
        descriptionHeading: 'Comprehensive Insurance Management & Policy Tracking Software',
        description: '<p>Digitize your insurance operations with G Digital India\'s Insurance Management Solution. Our platform streamlines the entire insurance workflow — from policy issuance and premium collection to claims processing, agent management, and regulatory compliance reporting.</p><p>Built for insurance companies, brokers, and agents, our software reduces paperwork, accelerates claim settlements, and gives you complete visibility into your policy portfolio.</p>',
        highlight: 'Automate policy lifecycle from issuance to renewal with zero paperwork.',
        tags: ['Policy Management', 'Premium Collection', 'Claims Processing', 'Agent Portal', 'Commission Tracking', 'Compliance Reports', 'Customer Portal'],
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
        contentBlocks: [
          {
            title: 'Features That Power Your Insurance Business',
            text: '<p>Our insurance management platform is feature-rich and customizable:</p><ul><li><strong>Policy Issuance:</strong> Create and issue policies digitally with automated document generation.</li><li><strong>Premium Management:</strong> Track premium payments, send reminders, and manage installment plans.</li><li><strong>Claims Processing:</strong> Digital claim submission, document verification, and automated approval workflows.</li><li><strong>Agent Management:</strong> Onboard agents, assign territories, track performance, and calculate commissions automatically.</li><li><strong>Customer Self-Service Portal:</strong> Policyholders can view policies, download documents, raise claims, and make payments online.</li></ul>',
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80'
          },
          {
            title: 'Analytics & Compliance',
            text: '<p>Stay ahead with data-driven insights and regulatory compliance:</p><ul><li><strong>Portfolio Analytics:</strong> Real-time dashboards showing policy mix, premium income, claim ratios, and agent performance.</li><li><strong>Renewal Tracking:</strong> Automated renewal reminders with easy one-click renewal process.</li><li><strong>Regulatory Reports:</strong> Generate IRDAI-compliant reports and submissions with a single click.</li><li><strong>Fraud Detection:</strong> AI-powered anomaly detection to flag suspicious claims early.</li><li><strong>Document Management:</strong> Centralized digital repository for all policy documents, ID proofs, and claim files.</li></ul>',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'
          }
        ],
        faqs: [
          { q: 'Which types of insurance does the software support?', a: 'Our software supports all types — life insurance, health insurance, motor insurance, property insurance, and general insurance. The system is fully customizable for any insurance product.' },
          { q: 'Can agents access the system on mobile?', a: 'Yes, agents get a dedicated mobile app for on-field policy sales, customer onboarding, document collection, and premium collection with real-time sync.' },
          { q: 'Is the software IRDAI compliant?', a: 'Yes, our software generates all mandatory IRDAI reports and follows regulatory guidelines for data storage, customer communication, and claims processing.' }
        ],
        order: 6,
        metaTitle: 'Insurance Management Software & Policy Tracker | G Digital India',
        metaDescription: 'Digitize insurance operations with policy management, claims processing, agent portals, and IRDAI-compliant reporting.',
        createdAt: new Date()
      },
      {
        title: 'Manufacturing Job Work Management',
        slug: 'manufacturing-job-work-management',
        short: 'Manufacturing',
        category: 'Other Solution',
        descriptionHeading: 'Smart Manufacturing & Job Work Management Software',
        description: '<p>Optimize your manufacturing and job work operations with G Digital India\'s comprehensive management software. Our platform handles the complete production workflow — from raw material procurement and job order creation to work-in-progress tracking, quality control, and finished goods dispatch.</p><p>Designed for manufacturers, job work units, and fabrication shops, our software eliminates manual tracking, reduces wastage, and ensures on-time delivery of every order.</p>',
        highlight: 'Track every job order from raw material to finished product in real-time.',
        tags: ['Job Order Tracking', 'Raw Material Management', 'Production Planning', 'Quality Control', 'Inventory Management', 'Dispatch & Delivery', 'Worker Performance'],
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
        contentBlocks: [
          {
            title: 'Streamline Your Manufacturing Operations',
            text: '<p>Managing manufacturing job work involves coordinating multiple moving parts. Our software brings everything together:</p><ul><li><strong>Job Order Management:</strong> Create, assign, and track job orders with deadlines, specifications, and priority levels.</li><li><strong>Raw Material Tracking:</strong> Manage inventory, track consumption per job, and set reorder alerts.</li><li><strong>Production Planning:</strong> Visual production calendar showing machine allocation, worker assignments, and delivery timelines.</li><li><strong>Work-in-Progress (WIP):</strong> Real-time tracking of each job through production stages — cutting, machining, assembly, finishing.</li><li><strong>Quality Control:</strong> QC checklists, rejection tracking, and rework management at every production stage.</li></ul>',
            image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80'
          },
          {
            title: 'Beyond Production — Complete Business Management',
            text: '<p>Our software goes beyond the shop floor:</p><ul><li><strong>Quotation & Billing:</strong> Generate professional quotations, convert to job orders, and create GST invoices automatically.</li><li><strong>Worker & Labour Management:</strong> Track worker attendance, piece-rate wages, overtime, and performance metrics.</li><li><strong>Dispatch & Challan:</strong> Generate delivery challans, track dispatch status, and get delivery confirmation.</li><li><strong>Cost Analysis:</strong> Job-wise costing showing material cost, labour cost, overheads, and profit margins.</li><li><strong>Multi-Unit Support:</strong> Manage multiple manufacturing units or outsourced job work from a single dashboard.</li></ul>',
            image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80'
          }
        ],
        faqs: [
          { q: 'Can I track jobs assigned to outside vendors?', a: 'Yes, our software supports outsourced job work tracking. You can assign jobs to external vendors, track their progress, manage payments, and monitor quality.' },
          { q: 'Does it support GST billing?', a: 'Yes, the software generates GST-compliant invoices, delivery challans, purchase orders, and quotations. All tax calculations are automated.' },
          { q: 'Can workers update job status from the shop floor?', a: 'Yes, workers can use a simple mobile interface or shop floor kiosks to scan job cards and update production status in real-time.' }
        ],
        order: 7,
        metaTitle: 'Manufacturing Job Work Management Software | G Digital India',
        metaDescription: 'Complete manufacturing and job work management with order tracking, raw material management, quality control, and GST billing.',
        createdAt: new Date()
      }
    ];

    console.log('Upserting 7 subcategories under "Other Solution"...');
    for (const sub of subcategories) {
      await db.collection('services').updateOne(
        { slug: sub.slug },
        { $set: sub },
        { upsert: true }
      );
      console.log(`  ✓ ${sub.title}`);
    }

    console.log('\nAll done! Verifying...');
    const cat = await db.collection('servicecategories').findOne({ name: 'Other Solution' });
    console.log('Category:', cat?.name);
    const svcs = await db.collection('services').find({ category: 'Other Solution' }).toArray();
    console.log('Services:', svcs.map(s => s.title));

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
