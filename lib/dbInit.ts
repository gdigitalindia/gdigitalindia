import mongoose from "mongoose";
import ServiceCategory from "@/models/ServiceCategory";
import Service from "@/models/Service";

export async function syncWebsiteServices() {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    // Check if migration has already run to prevent overwriting user edits/deletions
    const migrationCollection = db.collection("migrations");
    const migration = await migrationCollection.findOne({ name: "website-services-v2" });
    
    if (migration) {
      // Migration has already run. Do not overwrite database state.
      return;
    }

    console.log("Running website services migration...");

    // 1. Delete "Website Designing" and "Website Development" categories if they exist
    await ServiceCategory.deleteMany({
      name: { $in: ["Website Designing", "Website Development"] }
    });

    // 2. Ensure the main "Website" category exists
    await ServiceCategory.findOneAndUpdate(
      { name: "Website" },
      {
        $set: {
          name: "Website",
          slug: "website",
          title: "Website Services",
          description: "<p>Custom website designing, professional website development, e-commerce stores, and Shopify development designed for maximum user engagement and conversion.</p>",
          order: 0,
          metaTitle: "Website Designing & Development Services",
          metaDescription: "Professional web design and development services."
        }
      },
      { upsert: true }
    );

    // 3. Update any existing services that were associated with old categories to "Website"
    await Service.updateMany(
      { category: { $in: ["Website Designing", "Website Development", "website"] } },
      { $set: { category: "Website" } }
    );

    // 4. Upsert the 4 subcategories under the "Website" category
    const subcategories = [
      {
        title: "Website Designing",
        slug: "website-designing",
        short: "Designing",
        category: "Website",
        description: "<p>Creative UI/UX design, custom landing pages, and responsive layout designs that represent your brand beautifully and load fast.</p>",
        descriptionHeading: "UI/UX & Web Layout Design",
        highlight: "Visual excellence paired with functional user flows.",
        tags: ["UI/UX Design", "Figma Wireframes", "Landing Pages", "Responsive Design"],
        image: "https://images.unsplash.com/photo-1541462608141-2ff580ee0e9e?w=800&q=80",
        order: 1
      },
      {
        title: "Website Development",
        slug: "website-development",
        short: "Development",
        category: "Website",
        description: "<p>High-performance website development using React, Next.js, and modern tech stacks that are secure, SEO-optimized, and lightning fast.</p>",
        descriptionHeading: "Next-Gen Custom Development",
        highlight: "Clean code, fast loading speeds, and robust performance.",
        tags: ["React/Next.js", "WordPress", "Custom Coding", "Speed Optimization"],
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        order: 2
      },
      {
        title: "E-Commerce Website Development",
        slug: "ecommerce-website-development",
        short: "E-Commerce",
        category: "Website",
        description: "<p>Full-featured online e-commerce stores with payment gateway integration, product inventory management, and smooth checkout experiences.</p>",
        descriptionHeading: "Scalable Online Storefronts",
        highlight: "Optimized checkout funnels designed to increase average order value.",
        tags: ["WooCommerce", "Payment Gateways", "Inventory Sync", "Security (SSL)"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        order: 3
      },
      {
        title: "Shopify Website Development",
        slug: "shopify-website-development",
        short: "Shopify",
        category: "Website",
        description: "<p>Premium Shopify stores customized for your brand, optimized for conversions, and setup with apps for marketing and sales scaling.</p>",
        descriptionHeading: "Shopify D2C Brand Setup",
        highlight: "Launch your online brand within days on the world's most popular platform.",
        tags: ["Shopify Store Setup", "Custom Themes", "App Integrations", "Domain Mapping"],
        image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80",
        order: 4
      }
    ];

    for (const sub of subcategories) {
      await Service.findOneAndUpdate(
        { slug: sub.slug },
        {
          $set: {
            title: sub.title,
            short: sub.short,
            category: sub.category,
            description: sub.description,
            descriptionHeading: sub.descriptionHeading,
            highlight: sub.highlight,
            tags: sub.tags,
            image: sub.image,
            order: sub.order
          }
        },
        { upsert: true }
      );
    }

    // Record the migration
    await migrationCollection.insertOne({
      name: "website-services-v2",
      executedAt: new Date()
    });

    console.log("Website services and categories successfully synced.");
  } catch (error) {
    console.error("Error syncing website services:", error);
  }
}

export async function syncOtherSolutions() {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    const migrationCollection = db.collection("migrations");
    const migration = await migrationCollection.findOne({ name: "other-solutions-v1" });
    if (migration) return;

    console.log("Running Other Solution migration...");

    // 1. Create "Other Solution" category
    await ServiceCategory.findOneAndUpdate(
      { name: "Other Solution" },
      {
        $set: {
          name: "Other Solution",
          slug: "other-solution",
          title: "Other IT Solutions & Software",
          description: "<p>Beyond digital marketing and websites, G Digital India provides a comprehensive range of custom IT solutions and management software tailored for diverse industries. From IVR systems to AI-powered calling, from loan management to manufacturing job work — we build technology that simplifies your business operations.</p>",
          order: 5,
          metaTitle: "Custom IT Solutions & Business Software | G Digital India",
          metaDescription: "Explore our range of custom IT solutions including IVR, AI Calling, Loan Management, Insurance Software, and more."
        }
      },
      { upsert: true }
    );

    // 2. Upsert 7 subcategories
    const subs = [
      {
        title: "IVR Solution", slug: "ivr-solution", short: "IVR", category: "Other Solution",
        descriptionHeading: "Smart IVR Systems for Seamless Customer Communication",
        description: "<p>Transform your customer communication with our intelligent IVR (Interactive Voice Response) solutions. Our IVR systems are designed to handle high call volumes, route calls efficiently, and provide instant self-service options to your callers — reducing wait times and boosting customer satisfaction.</p><p>Whether you need a simple auto-attendant or a multi-level IVR with CRM integration, G Digital India builds customized voice response systems that work 24/7, ensuring no call goes unanswered and every customer interaction is smooth and professional.</p>",
        highlight: "Reduce call handling time by up to 60% with intelligent call routing.",
        tags: ["Auto-Attendant", "Call Routing", "CRM Integration", "Multi-Language Support", "Call Analytics", "24/7 Availability"],
        image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80",
        contentBlocks: [
          { title: "Why Your Business Needs an IVR System", text: "<p>In today's fast-paced business environment, customers expect instant responses. An IVR system ensures that every incoming call is handled professionally — greeting callers, providing menu options, and routing them to the right department without human intervention.</p><ul><li><strong>24/7 Availability:</strong> Your IVR never sleeps.</li><li><strong>Reduced Operational Costs:</strong> Automate repetitive queries.</li><li><strong>Professional Image:</strong> A well-designed IVR gives your business a corporate feel.</li><li><strong>Scalability:</strong> Handle 10 or 10,000 calls simultaneously.</li></ul>", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" },
          { title: "Our IVR Features & Capabilities", text: "<p>G Digital India builds feature-rich IVR solutions:</p><ul><li><strong>Multi-Level Menu:</strong> Complex call flows with nested menus.</li><li><strong>CRM Integration:</strong> Sync caller data for personalized greetings.</li><li><strong>Call Recording & Analytics:</strong> Detailed reports on call patterns.</li><li><strong>SMS & WhatsApp Integration:</strong> Automated follow-up messages.</li><li><strong>Multi-Language Support:</strong> Hindi, English, and regional languages.</li></ul>", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80" }
        ],
        faqs: [
          { q: "How long does it take to set up an IVR system?", a: "A basic IVR can be set up within 2-3 business days. Complex systems with CRM integration take 1-2 weeks." },
          { q: "Can the IVR integrate with my existing phone system?", a: "Yes, our IVR solutions are compatible with most PBX systems, SIP trunks, and cloud telephony providers." },
          { q: "Do you provide call analytics?", a: "Yes, you get a detailed dashboard showing call volume, peak hours, average handling time, and agent performance." }
        ],
        order: 1, metaTitle: "IVR Solution Provider in Jaipur | G Digital India", metaDescription: "Get intelligent IVR systems with auto-attendant, call routing, CRM integration, and 24/7 availability."
      },
      {
        title: "AI Calling Solution", slug: "ai-calling-solution", short: "AI Calling", category: "Other Solution",
        descriptionHeading: "AI-Powered Automated Calling for Smart Business Outreach",
        description: "<p>Revolutionize your outreach with G Digital India's AI Calling Solutions. Our AI-driven calling systems use natural language processing and machine learning to conduct human-like conversations at scale — perfect for lead qualification, appointment reminders, feedback collection, and sales follow-ups.</p><p>Imagine making thousands of personalized calls simultaneously, with an AI agent that understands context, responds naturally, and captures data automatically.</p>",
        highlight: "Make 10,000+ personalized calls per day with AI agents that sound human.",
        tags: ["Natural Language AI", "Auto-Dialer", "Lead Qualification", "Appointment Reminders", "Feedback Collection", "CRM Sync"],
        image: "https://images.unsplash.com/photo-1531746790095-e5e7e3ee2384?w=800&q=80",
        contentBlocks: [
          { title: "How AI Calling Transforms Your Business", text: "<p>Traditional calling campaigns are expensive and time-consuming. AI calling changes the game:</p><ul><li><strong>Scale Without Limits:</strong> Make thousands of calls simultaneously.</li><li><strong>Consistent Quality:</strong> Every call follows your script perfectly.</li><li><strong>Smart Lead Scoring:</strong> AI scores leads automatically.</li><li><strong>Multi-Language Support:</strong> Hindi, English, and other languages.</li><li><strong>Cost Reduction:</strong> Cut outbound calling costs by up to 80%.</li></ul>", image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80" },
          { title: "Use Cases for AI Calling", text: "<p>Our AI calling platform works across industries:</p><ul><li><strong>Sales Follow-ups:</strong> Auto follow up with interested leads.</li><li><strong>Appointment Reminders:</strong> Reduce no-shows by 40%.</li><li><strong>Payment Reminders:</strong> Politely remind about payments.</li><li><strong>Customer Feedback:</strong> Collect NPS scores at scale.</li><li><strong>Event Invitations:</strong> Personalized calls for events.</li></ul>", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80" }
        ],
        faqs: [
          { q: "Does the AI sound robotic?", a: "Not at all. Our AI uses advanced text-to-speech with natural intonation. Most callers cannot distinguish it from a human agent." },
          { q: "Can I customize the calling script?", a: "Yes, you have full control over the conversation flow, scripts, and responses." },
          { q: "What happens when the AI cannot answer a question?", a: "The AI gracefully transfers the call to a human agent or captures the query for follow-up." }
        ],
        order: 2, metaTitle: "AI Calling Solution & Auto-Dialer | G Digital India", metaDescription: "AI-powered automated calling for lead qualification, appointment reminders, and sales outreach."
      },
      {
        title: "Loan Management Software", slug: "loan-management-software", short: "Loan Management", category: "Other Solution",
        descriptionHeading: "Complete Loan Management Software for NBFCs & Micro-Finance",
        description: "<p>Manage your entire loan lifecycle digitally with G Digital India's comprehensive Loan Management Software. From loan application and KYC verification to EMI collection, interest calculation, and reporting — our software automates every step of the lending process.</p><p>Built for NBFCs, micro-finance institutions, gold loan companies, and private lenders, our platform ensures compliance, reduces manual errors, and gives you real-time visibility into your loan portfolio.</p>",
        highlight: "End-to-end loan lifecycle automation — from application to closure.",
        tags: ["Loan Origination", "EMI Calculator", "KYC Verification", "Payment Tracking", "Interest Calculation", "Compliance Reports", "Borrower Portal"],
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
        contentBlocks: [
          { title: "Features of Our Loan Management System", text: "<p>Our loan management software covers the complete lending workflow:</p><ul><li><strong>Loan Origination:</strong> Digital application forms and automated eligibility checks.</li><li><strong>KYC & Verification:</strong> Aadhaar, PAN verification integrated.</li><li><strong>Flexible Interest Models:</strong> Flat rate, reducing balance, daily interest.</li><li><strong>EMI Collection:</strong> Auto-generated schedules and payment reminders.</li><li><strong>Overdue & NPA Management:</strong> Automatic flagging with escalation workflows.</li><li><strong>Reports & Compliance:</strong> RBI-compliant reports and portfolio summaries.</li></ul>", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" },
          { title: "Who Is This Software For?", text: "<p>Designed for:</p><ul><li><strong>NBFCs:</strong> Personal, business, or vehicle loans.</li><li><strong>Micro-Finance Institutions:</strong> Group lending and rural credit.</li><li><strong>Gold Loan Companies:</strong> Valuation, pledge tracking, auctions.</li><li><strong>Private Lenders:</strong> Multiple borrowers and loan types.</li><li><strong>Cooperative Banks:</strong> Member management and lending.</li></ul>", image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&q=80" }
        ],
        faqs: [
          { q: "Is the software RBI compliant?", a: "Yes, our software generates all required compliance reports and follows RBI guidelines for NBFCs." },
          { q: "Can borrowers make online payments?", a: "Yes, we integrate payment gateways so borrowers can pay EMIs online with a self-service portal." },
          { q: "Do you provide mobile app access?", a: "Yes, field agents get a mobile app for on-ground verification and collection tracking." }
        ],
        order: 3, metaTitle: "Loan Management Software for NBFCs | G Digital India", metaDescription: "Complete loan management software for NBFCs, micro-finance, and private lenders."
      },
      {
        title: "Dry Cleaning Management", slug: "dry-cleaning-management", short: "Dry Cleaning", category: "Other Solution",
        descriptionHeading: "Smart Dry Cleaning & Laundry Management Software",
        description: "<p>Streamline your dry cleaning and laundry business with our intelligent management software. From order booking and garment tracking to billing, delivery scheduling, and customer management — everything is automated and accessible from a single dashboard.</p><p>Whether you run a single outlet or a multi-branch chain, our software helps you manage operations efficiently, reduce turnaround time, and deliver a premium customer experience.</p>",
        highlight: "Track every garment from pickup to delivery with barcode/QR-based tagging.",
        tags: ["Order Management", "Garment Tracking", "Barcode/QR Tags", "Route Optimization", "Customer App", "Multi-Branch Support", "Invoice & Billing"],
        image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80",
        contentBlocks: [
          { title: "How Our Software Simplifies Dry Cleaning Operations", text: "<p>Our software brings order to the chaos:</p><ul><li><strong>Digital Order Booking:</strong> Via counter, phone, or customer app.</li><li><strong>Garment Tagging:</strong> Unique barcode or QR tags for zero mix-ups.</li><li><strong>Process Tracking:</strong> Received → washing → ironing → quality check → ready.</li><li><strong>Pickup & Delivery:</strong> Route optimization for drivers.</li><li><strong>Customer Notifications:</strong> Automatic SMS/WhatsApp updates.</li></ul>", image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80" },
          { title: "Business Growth Features", text: "<p>Beyond operations, grow your business:</p><ul><li><strong>Customer Loyalty Programs:</strong> Points, wallets, memberships.</li><li><strong>Multi-Branch Dashboard:</strong> Manage all outlets from one panel.</li><li><strong>Expense & Revenue Tracking:</strong> Daily P&L per branch.</li><li><strong>Marketing Automation:</strong> Promotional offers to customers.</li><li><strong>Customer App:</strong> Branded app for orders and payments.</li></ul>", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80" }
        ],
        faqs: [
          { q: "Can I manage multiple branches?", a: "Yes, our software supports multi-branch operations with centralized dashboard and branch-wise reports." },
          { q: "Do customers get a mobile app?", a: "Yes, a branded customer app for orders, tracking, history, and payments." },
          { q: "How does garment tracking work?", a: "Each garment gets a unique barcode/QR tag. Staff scan at every processing stage for real-time visibility." }
        ],
        order: 4, metaTitle: "Dry Cleaning & Laundry Management Software | G Digital India", metaDescription: "Smart dry cleaning software with garment tracking, customer app, multi-branch support."
      },
      {
        title: "Exhibition Management", slug: "exhibition-management", short: "Exhibition", category: "Other Solution",
        descriptionHeading: "End-to-End Exhibition & Event Management Software",
        description: "<p>Plan, organize, and execute exhibitions and trade shows flawlessly with G Digital India's Exhibition Management Software. Our platform handles everything — from exhibitor registration and stall allocation to visitor management, lead capture, and post-event analytics.</p><p>Designed for event organizers, trade bodies, and corporate event teams, our software ensures every exhibition runs smoothly, exhibitors get maximum ROI, and visitors have a seamless experience.</p>",
        highlight: "Manage exhibitors, visitors, stalls, and leads — all from one platform.",
        tags: ["Exhibitor Portal", "Stall Allocation", "Visitor Registration", "Lead Capture", "Floor Plan Designer", "Badge Printing", "Post-Event Analytics"],
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        contentBlocks: [
          { title: "Complete Exhibition Lifecycle Management", text: "<p>Our software covers the entire lifecycle:</p><ul><li><strong>Exhibitor Registration:</strong> Online portal for registration and payments.</li><li><strong>Stall Allocation:</strong> Visual floor plan designer.</li><li><strong>Visitor Registration:</strong> QR-code based fast entry.</li><li><strong>Lead Capture:</strong> Digital badge scanning for exhibitors.</li><li><strong>Real-Time Dashboard:</strong> Live stats on registrations and footfall.</li></ul>", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80" },
          { title: "Post-Event Analytics & ROI Tracking", text: "<p>Measure success after the event:</p><ul><li><strong>Visitor Analytics:</strong> Demographics, peak hours, engagement.</li><li><strong>Exhibitor ROI Reports:</strong> Lead count, booth traffic, conversions.</li><li><strong>Feedback Collection:</strong> Automated post-event surveys.</li><li><strong>Revenue Reports:</strong> Stall sales, sponsorships, tickets.</li><li><strong>Historical Data:</strong> Compare across editions.</li></ul>", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80" }
        ],
        faqs: [
          { q: "Can exhibitors register and pay online?", a: "Yes, exhibitors get a dedicated portal to register, choose stalls, upload documents, and pay securely." },
          { q: "How does visitor badge printing work?", a: "Visitors register online/on-site. The system generates a unique QR-coded badge instantly." },
          { q: "Can I manage multiple exhibitions?", a: "Yes, each event gets its own dashboard, exhibitor list, floor plan, and analytics." }
        ],
        order: 5, metaTitle: "Exhibition Management Software | G Digital India", metaDescription: "Complete exhibition management with exhibitor registration, stall allocation, and post-event analytics."
      },
      {
        title: "Insurance Management Solution", slug: "insurance-management-solution", short: "Insurance", category: "Other Solution",
        descriptionHeading: "Comprehensive Insurance Management & Policy Tracking Software",
        description: "<p>Digitize your insurance operations with G Digital India's Insurance Management Solution. Our platform streamlines the entire insurance workflow — from policy issuance and premium collection to claims processing, agent management, and regulatory compliance reporting.</p><p>Built for insurance companies, brokers, and agents, our software reduces paperwork, accelerates claim settlements, and gives you complete visibility into your policy portfolio.</p>",
        highlight: "Automate policy lifecycle from issuance to renewal with zero paperwork.",
        tags: ["Policy Management", "Premium Collection", "Claims Processing", "Agent Portal", "Commission Tracking", "Compliance Reports", "Customer Portal"],
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
        contentBlocks: [
          { title: "Features That Power Your Insurance Business", text: "<p>Feature-rich and customizable:</p><ul><li><strong>Policy Issuance:</strong> Digital creation with automated documents.</li><li><strong>Premium Management:</strong> Track payments, reminders, installments.</li><li><strong>Claims Processing:</strong> Digital submission and approval workflows.</li><li><strong>Agent Management:</strong> Onboarding, territories, commissions.</li><li><strong>Customer Portal:</strong> View policies, raise claims, make payments.</li></ul>", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80" },
          { title: "Analytics & Compliance", text: "<p>Data-driven insights and compliance:</p><ul><li><strong>Portfolio Analytics:</strong> Policy mix, premium income, claim ratios.</li><li><strong>Renewal Tracking:</strong> Automated reminders with one-click renewal.</li><li><strong>Regulatory Reports:</strong> IRDAI-compliant reports.</li><li><strong>Fraud Detection:</strong> AI-powered anomaly detection.</li><li><strong>Document Management:</strong> Centralized digital repository.</li></ul>", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" }
        ],
        faqs: [
          { q: "Which types of insurance does it support?", a: "All types — life, health, motor, property, and general insurance. Fully customizable for any product." },
          { q: "Can agents access on mobile?", a: "Yes, agents get a dedicated mobile app for on-field sales, onboarding, and premium collection." },
          { q: "Is the software IRDAI compliant?", a: "Yes, it generates mandatory IRDAI reports and follows regulatory guidelines." }
        ],
        order: 6, metaTitle: "Insurance Management Software | G Digital India", metaDescription: "Digitize insurance operations with policy management, claims processing, and IRDAI-compliant reporting."
      },
      {
        title: "Manufacturing Job Work Management", slug: "manufacturing-job-work-management", short: "Manufacturing", category: "Other Solution",
        descriptionHeading: "Smart Manufacturing & Job Work Management Software",
        description: "<p>Optimize your manufacturing and job work operations with G Digital India's comprehensive management software. Our platform handles the complete production workflow — from raw material procurement and job order creation to work-in-progress tracking, quality control, and finished goods dispatch.</p><p>Designed for manufacturers, job work units, and fabrication shops, our software eliminates manual tracking, reduces wastage, and ensures on-time delivery of every order.</p>",
        highlight: "Track every job order from raw material to finished product in real-time.",
        tags: ["Job Order Tracking", "Raw Material Management", "Production Planning", "Quality Control", "Inventory Management", "Dispatch & Delivery", "Worker Performance"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        contentBlocks: [
          { title: "Streamline Your Manufacturing Operations", text: "<p>Our software brings everything together:</p><ul><li><strong>Job Order Management:</strong> Create, assign, track with deadlines.</li><li><strong>Raw Material Tracking:</strong> Inventory, consumption, reorder alerts.</li><li><strong>Production Planning:</strong> Visual calendar with machine allocation.</li><li><strong>Work-in-Progress:</strong> Real-time tracking through stages.</li><li><strong>Quality Control:</strong> QC checklists and rejection tracking.</li></ul>", image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80" },
          { title: "Beyond Production — Complete Business Management", text: "<p>Goes beyond the shop floor:</p><ul><li><strong>Quotation & Billing:</strong> Professional quotes and GST invoices.</li><li><strong>Worker Management:</strong> Attendance, piece-rate wages, performance.</li><li><strong>Dispatch & Challan:</strong> Delivery challans and tracking.</li><li><strong>Cost Analysis:</strong> Job-wise material, labour, and profit analysis.</li><li><strong>Multi-Unit Support:</strong> Manage multiple units from one dashboard.</li></ul>", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80" }
        ],
        faqs: [
          { q: "Can I track outsourced job work?", a: "Yes, assign jobs to external vendors, track progress, manage payments, and monitor quality." },
          { q: "Does it support GST billing?", a: "Yes, GST-compliant invoices, challans, POs, and quotations with automated tax calculations." },
          { q: "Can workers update status from shop floor?", a: "Yes, workers use mobile or kiosks to scan job cards and update status in real-time." }
        ],
        order: 7, metaTitle: "Manufacturing Job Work Management Software | G Digital India", metaDescription: "Complete manufacturing and job work management with order tracking, quality control, and GST billing."
      }
    ];

    for (const sub of subs) {
      await Service.findOneAndUpdate(
        { slug: sub.slug },
        { $set: sub },
        { upsert: true }
      );
    }

    await migrationCollection.insertOne({ name: "other-solutions-v1", executedAt: new Date() });
    console.log("Other Solution services successfully synced.");
  } catch (error) {
    console.error("Error syncing other solutions:", error);
  }
}
