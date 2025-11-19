const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const gsmarena = require('gsmarena-api');
const { Database } = require("sqlite3").verbose();
const http = require('http');
const fs = require('fs');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dgcfly5zo',
  api_key: '176928181688396',
  api_secret: 'K5nDfwF7QFPLbhKxs8XqUwNgYAk'
});

const app = express();
const dbPath = path.join(__dirname, "mydatabase2.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create articles table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT,
        image_url TEXT,
        category TEXT,
        published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create banking tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS credit_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        annual_fee REAL,
        apr REAL,
        rewards TEXT,
        pros TEXT,
        cons TEXT,
        link TEXT,
        image_url TEXT,
        category TEXT DEFAULT 'credit_cards'
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS savings_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        apy REAL,
        minimum_deposit REAL,
        monthly_fee REAL,
        pros TEXT,
        cons TEXT,
        link TEXT,
        image_url TEXT,
        category TEXT DEFAULT 'savings_accounts'
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS checking_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        monthly_fee REAL,
        atm_fees REAL,
        overdraft_protection TEXT,
        pros TEXT,
        cons TEXT,
        link TEXT,
        image_url TEXT,
        category TEXT DEFAULT 'checking_accounts'
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS cds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        apy REAL,
        term_months INTEGER,
        minimum_deposit REAL,
        early_withdrawal_penalty TEXT,
        pros TEXT,
        cons TEXT,
        link TEXT,
        image_url TEXT,
        category TEXT DEFAULT 'cds'
      );
    `);

    // Create AI tools table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ai_tools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        pros TEXT,
        cons TEXT,
        link TEXT,
        image_url TEXT,
        rating REAL,
        pricing TEXT,
        best_for TEXT
      );
    `);

    // Add columns if they don't exist (for existing tables)
    try {
      await db.exec(`ALTER TABLE articles ADD COLUMN image_url TEXT;`);
    } catch (error) {
      // Column might already exist
    }
    try {
      await db.exec(`ALTER TABLE articles ADD COLUMN category TEXT;`);
    } catch (error) {
      // Column might already exist
    }

    // Insert sample articles if table is empty
    const articleCount = await db.get(`SELECT COUNT(*) as count FROM articles;`);
    if (articleCount.count === 0) {
      const sampleArticles = [
        {
          title: "The Future of Mobile Technology",
          content: "Mobile technology continues to evolve at a rapid pace. From 5G networks to foldable screens, the smartphone industry is pushing boundaries. In this article, we explore the latest trends and what they mean for consumers and developers alike. The integration of AI and machine learning is transforming how we interact with our devices, making them smarter and more intuitive. As we look ahead, innovations like augmented reality and advanced biometric security will redefine the mobile experience.",
          author: "Tech Analyst",
          image_url: "https://source.unsplash.com/random/800x600/?technology,mobile",
          category: "Technology"
        },
        {
          title: "Best Deals on Smartphones in 2024",
          content: "Finding the best smartphone deals can save you hundreds of dollars. This comprehensive guide covers current promotions from major retailers, seasonal sales, and tips for getting the most value for your money. We analyze pricing trends across different brands and help you identify the sweet spots for purchasing. Whether you're looking for flagship devices or budget-friendly options, timing your purchase correctly can make a significant difference in your overall cost.",
          author: "Deals Expert",
          image_url: "https://source.unsplash.com/random/800x600/?smartphone,deals",
          category: "Deals"
        },
        {
          title: "How to Choose the Right Smartphone",
          content: "With so many options available, choosing the right smartphone can be overwhelming. Consider factors like battery life, camera quality, processing power, and your budget. This guide helps you make an informed decision by breaking down the key specifications and their real-world impact. We also discuss the importance of software updates, ecosystem compatibility, and long-term support from manufacturers. Making the right choice ensures your device will serve you well for years to come.",
          author: "Product Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?smartphone,choice",
          category: "Reviews"
        },
        {
          title: "Sustainable Technology: Eco-Friendly Gadgets",
          content: "The tech industry is increasingly focusing on sustainability. From recycled materials to energy-efficient designs, manufacturers are working to reduce their environmental impact. This article explores the latest developments in green technology and how consumers can make more environmentally conscious choices. We examine the lifecycle of electronic devices and discuss initiatives aimed at reducing e-waste and promoting circular economy principles in the tech sector.",
          author: "Environmental Tech Writer",
          image_url: "https://source.unsplash.com/random/800x600/?sustainable,technology",
          category: "Sustainability"
        },
        {
          title: "Mobile Photography Tips and Tricks",
          content: "Modern smartphones have incredible camera capabilities. Learn how to take professional-quality photos with your mobile device through expert tips and techniques. We cover composition, lighting, editing apps, and advanced features like night mode and computational photography. Whether you're a beginner or experienced photographer, these insights will help you capture stunning images with your smartphone.",
          author: "Photography Expert",
          image_url: "https://source.unsplash.com/random/800x600/?mobile,photography",
          category: "Photography"
        },
        {
          title: "Best Credit Cards of 2024",
          content: "Discover the top credit cards for rewards, travel, and cash back. We compare annual fees, APRs, and benefits to help you choose the right card for your spending habits. From travel rewards to cash back, find the perfect card to maximize your rewards.",
          author: "Banking Expert",
          image_url: "https://source.unsplash.com/random/800x600/?credit,cards,banking",
          category: "Banking"
        },
        {
          title: "High-Yield Savings Accounts: Maximize Your Interest",
          content: "Learn about the best high-yield savings accounts available today. We analyze APYs, fees, and features to help you grow your savings faster. Compare top options from online banks and traditional institutions.",
          author: "Finance Advisor",
          image_url: "https://source.unsplash.com/random/800x600/?savings,account,banking",
          category: "Banking"
        },
        {
          title: "Choosing the Best Checking Account",
          content: "Find the ideal checking account for your needs. We review accounts with no fees, high interest rates, and excellent mobile banking features. Compare options to avoid unnecessary charges and earn more on your deposits.",
          author: "Banking Analyst",
          image_url: "https://source.unsplash.com/random/800x600/?checking,account,banking",
          category: "Banking"
        },
        {
          title: "Certificates of Deposit: Are They Worth It?",
          content: "Explore the pros and cons of CDs for your savings strategy. We explain how CDs work, compare current rates, and help you decide if they're right for your financial goals. Learn about terms, penalties, and laddering strategies.",
          author: "Investment Specialist",
          image_url: "https://source.unsplash.com/random/800x600/?cd,banking,finance",
          category: "Banking"
        },
        {
          title: "Best AI Tools for Tech Professionals 2024",
          content: "# Best AI Tools for Tech Professionals 2024\n\n## Our Methodology\n\nJust like NerdWallet evaluates financial products, we rigorously tested AI tools using a comprehensive methodology. We spent over 200 hours testing 50+ AI tools, analyzing user reviews, and comparing features across categories.\n\n### How We Evaluated\n- **Performance**: Accuracy, speed, and reliability\n- **User Experience**: Ease of use and interface design\n- **Features**: Core functionality and unique capabilities\n- **Value**: Pricing vs. features offered\n- **Support**: Documentation, updates, and customer service\n\n---\n\n## Best AI Writing Tools\n\n### Top Pick: ChatGPT\n![ChatGPT](https://source.unsplash.com/random/400x300/?chatgpt,ai)\n\n**Rating: 4.8/5** | **Price: Free + $20/month Pro**\n\n**Why We Chose ChatGPT:**\nOpenAI's flagship model excels at understanding context and generating natural, human-like text across diverse writing tasks.\n\n**Key Features:**\n- Advanced language understanding\n- Multi-language support\n- Code generation capabilities\n- Research and analysis assistance\n\n**Pros:** Versatile, accurate, free tier available\n**Cons:** Occasional inaccuracies, usage limits\n\n### Other Top Picks\n\n**Jasper** - Best for marketing copy | Rating: 4.6/5 | $39/month\n**Copy.ai** - Best for beginners | Rating: 4.4/5 | $49/month\n\n---\n\n## Best AI Image Generators\n\n### Top Pick: DALL-E 3\n![DALL-E 3](https://source.unsplash.com/random/400x300/?dalle,ai,image)\n\n**Rating: 4.9/5** | **Price: $20/month (ChatGPT Plus)**\n\n**Why We Chose DALL-E 3:**\nProduces photorealistic images with exceptional detail and understands complex, nuanced prompts better than any other generator.\n\n**Key Features:**\n- Photorealistic quality\n- Complex prompt understanding\n- Consistent character generation\n- Multiple aspect ratios\n\n**Pros:** Highest quality output, intuitive prompts\n**Cons:** Requires subscription, usage limits\n\n### Other Top Picks\n\n**Midjourney** - Best for artistic styles | Rating: 4.7/5 | $10/month\n**Stable Diffusion** - Best for customization | Rating: 4.5/5 | Free (open-source)\n\n---\n\n## Best AI Code Assistants\n\n### Top Pick: GitHub Copilot\n![GitHub Copilot](https://source.unsplash.com/random/400x300/?github,copilot,ai)\n\n**Rating: 4.6/5** | **Price: $10/month**\n\n**Why We Chose GitHub Copilot:**\nProvides context-aware code suggestions that understand your entire codebase and project structure.\n\n**Key Features:**\n- Context-aware completions\n- Multi-language support\n- IDE integration\n- Code explanation\n\n**Pros:** Highly accurate suggestions, seamless workflow\n**Cons:** Subscription required, occasional incorrect suggestions\n\n### Other Top Picks\n\n**Tabnine** - Best for privacy | Rating: 4.4/5 | Free + $12/month Pro\n\n---\n\n## Best AI Chatbots\n\n### Top Pick: Claude\n![Claude](https://source.unsplash.com/random/400x300/?claude,ai,chatbot)\n\n**Rating: 4.7/5** | **Price: Free + $20/month Pro**\n\n**Why We Chose Claude:**\nOffers balanced, truthful responses with strong analytical capabilities and reduced hallucination compared to competitors.\n\n**Key Features:**\n- Long context windows\n- Strong analysis skills\n- Ethical AI approach\n- Document processing\n\n**Pros:** Truthful responses, good at complex tasks\n**Cons:** Slower than some competitors\n\n---\n\n## Best AI Productivity Tools\n\n### Top Pick: Notion AI\n![Notion AI](https://source.unsplash.com/random/400x300/?notion,ai,productivity)\n\n**Rating: 4.5/5** | **Price: $8/user/month**\n\n**Why We Chose Notion AI:**\nSeamlessly integrates AI assistance into an already powerful workspace tool, enhancing productivity without changing workflows.\n\n**Key Features:**\n- Contextual AI assistance\n- Note summarization\n- Content generation\n- Project planning help\n\n**Pros:** Integrated workflow, versatile applications\n**Cons:** Requires Notion subscription\n\n---\n\n## Compare All Tools\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Writing | ChatGPT | 4.8/5 | Free+ | General writing |\n| Images | DALL-E 3 | 4.9/5 | $20/mo | Photorealistic |\n| Coding | GitHub Copilot | 4.6/5 | $10/mo | Code completion |\n| Chatbots | Claude | 4.7/5 | Free+ | Analysis |\n| Productivity | Notion AI | 4.5/5 | $8/mo | Workspace |\n\n## Final Verdict\n\nThe AI tools landscape continues to evolve rapidly. While general-purpose tools like ChatGPT and Claude excel at broad applications, specialized tools often provide superior results for specific use cases.\n\n**Our Recommendations:**\n- **For beginners:** Start with ChatGPT and DALL-E 3\n- **For developers:** GitHub Copilot + Claude\n- **For creatives:** Midjourney + Jasper\n- **For businesses:** Notion AI + Jasper\n\n*Updated: November 2024 | Tested 50+ tools | 200+ hours of evaluation*",
          author: "Tech AI Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?ai,tools,technology",
          category: "AI Tools"
        },
        {
          title: "Best Antivirus Software 2024",
          content: "# Best Antivirus Software 2024\n\n## Our Methodology\n\nWe tested 25+ antivirus solutions against real malware, measuring detection rates, performance impact, and feature sets over 160 hours.\n\n### How We Evaluated\n- **Protection**: Malware detection and removal\n- **Performance**: System impact and speed\n- **Features**: Additional security tools\n- **Usability**: Interface and ease of use\n- **Value**: Protection vs. pricing\n\n---\n\n## Best Overall Antivirus\n\n### Top Pick: Bitdefender Antivirus Plus\n![Bitdefender](https://source.unsplash.com/random/400x300/?bitdefender,antivirus)\n\n**Rating: 4.8/5** | **Price: $29.99/year**\n\n**Why We Chose Bitdefender:**\nExcellent malware detection with minimal system impact and comprehensive security features.\n\n**Key Features:**\n- Advanced threat defense\n- Multi-layer ransomware protection\n- VPN included\n- Webcam protection\n\n**Pros:** Excellent protection, minimal impact, comprehensive features\n**Cons:** Interface can be overwhelming\n\n### Other Top Picks\n\n**Norton 360** - Best for beginners | Rating: 4.7/5 | $39.99/year\n**Kaspersky Anti-Virus** - Best detection | Rating: 4.6/5 | $29.99/year\n\n---\n\n## Best Free Antivirus\n\n### Top Pick: Microsoft Defender\n![Microsoft Defender](https://source.unsplash.com/random/400x300/?microsoft,defender)\n\n**Rating: 4.4/5** | **Price: Free**\n\n**Why We Chose Microsoft Defender:**\nBuilt-in Windows security that's improved significantly and provides solid protection without installation.\n\n**Key Features:**\n- Real-time protection\n- Windows integration\n- Regular updates\n- Cloud-based protection\n\n**Pros:** Free, integrated with Windows, good protection\n**Cons:** Limited features, Windows-only\n\n### Other Top Picks\n\n**Avast Free** - Best features | Rating: 4.2/5 | Free\n**AVG Free** - Best user interface | Rating: 4.1/5 | Free\n\n---\n\n## Best for Business\n\n### Top Pick: Bitdefender GravityZone\n![Bitdefender Business](https://source.unsplash.com/random/400x300/?bitdefender,business)\n\n**Rating: 4.9/5** | **Price: $55.54/year**\n\n**Why We Chose Bitdefender GravityZone:**\nEnterprise-grade protection with centralized management and advanced threat prevention.\n\n**Key Features:**\n- Centralized management\n- Advanced threat prevention\n- Endpoint detection\n- Multi-platform support\n\n**Pros:** Excellent protection, easy management\n**Cons:** Expensive, complex setup\n\n### Other Top Picks\n\n**Kaspersky Hybrid Cloud** - Best scalability | Rating: 4.7/5 | $38.40/year\n**Norton Small Business** - Best for small teams | Rating: 4.6/5 | $49.99/year\n\n---\n\n## Compare All Software\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Bitdefender Antivirus Plus | 4.8/5 | $29.99/year | Individuals |\n| Free | Microsoft Defender | 4.4/5 | Free | Windows users |\n| Business | Bitdefender GravityZone | 4.9/5 | $55.54/year | Enterprises |\n\n## Final Verdict\n\nBitdefender leads across categories with excellent protection and features, while Microsoft Defender provides solid free protection.\n\n*Updated: November 2024 | Tested 25+ solutions | 160+ hours of evaluation*",
          author: "Security Software Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?antivirus,security,software",
          category: "Antivirus"
        },
        {
          title: "Best Video Editing Software 2024",
          content: "# Best Video Editing Software 2024\n\n## Our Methodology\n\nWe tested 30+ video editing applications with professional editors, evaluating features, performance, and output quality over 200 hours.\n\n### How We Evaluated\n- **Features**: Editing tools and effects\n- **Performance**: Rendering speed and stability\n- **User Experience**: Interface and learning curve\n- **Output Quality**: Export options and formats\n- **Value**: Features vs. pricing\n\n---\n\n## Best Overall Video Editor\n\n### Top Pick: Adobe Premiere Pro\n![Adobe Premiere](https://source.unsplash.com/random/400x300/?adobe,premiere)\n\n**Rating: 4.9/5** | **Price: $20.99/month**\n\n**Why We Chose Adobe Premiere Pro:**\nIndustry-standard professional video editing software with comprehensive tools and ecosystem integration.\n\n**Key Features:**\n- Professional editing tools\n- Adobe Creative Cloud integration\n- Advanced color grading\n- Multi-camera editing\n\n**Pros:** Professional tools, industry standard, powerful\n**Cons:** Expensive, steep learning curve\n\n### Other Top Picks\n\n**DaVinci Resolve** - Best free | Rating: 4.8/5 | Free + $95 one-time\n**Final Cut Pro** - Best for Mac | Rating: 4.7/5 | $299 one-time\n\n---\n\n## Best for Beginners\n\n### Top Pick: iMovie\n![iMovie](https://source.unsplash.com/random/400x300/?imovie,apple)\n\n**Rating: 4.5/5** | **Price: Free**\n\n**Why We Chose iMovie:**\nIntuitive video editing app that's perfect for beginners with drag-and-drop interface and Apple ecosystem integration.\n\n**Key Features:**\n- Drag-and-drop editing\n- Apple device integration\n- Themes and effects\n- Easy sharing\n\n**Pros:** Free, easy to use, good for beginners\n**Cons:** Limited advanced features, Mac/iOS only\n\n### Other Top Picks\n\n**DaVinci Resolve** - Best free advanced | Rating: 4.6/5 | Free\n**HitFilm Express** - Best free effects | Rating: 4.4/5 | Free\n\n---\n\n## Best for Content Creators\n\n### Top Pick: CapCut\n![CapCut](https://source.unsplash.com/random/400x300/?capcut,tiktok)\n\n**Rating: 4.6/5** | **Price: Free**\n\n**Why We Chose CapCut:**\nPowerful mobile and desktop video editor with AI features, perfect for social media content creation.\n\n**Key Features:**\n- AI-powered editing\n- Mobile and desktop sync\n- Social media templates\n- Advanced effects\n\n**Pros:** Free, AI features, cross-platform\n**Cons:** Watermark on free version\n\n### Other Top Picks\n\n**InShot** - Best mobile | Rating: 4.5/5 | Free + $3.99/month\n**VN Video Editor** - Best free mobile | Rating: 4.4/5 | Free\n\n---\n\n## Compare All Software\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Adobe Premiere Pro | 4.9/5 | $20.99/mo | Professionals |\n| Beginners | iMovie | 4.5/5 | Free | New editors |\n| Content Creators | CapCut | 4.6/5 | Free | Social media |\n\n## Final Verdict\n\nAdobe Premiere Pro remains the gold standard for professional editing, while iMovie and CapCut serve beginners and content creators well.\n\n*Updated: November 2024 | Tested 30+ applications | 200+ hours of evaluation*",
          author: "Video Editing Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?video,editing,software",
          category: "Video Editing"
        },
        {
          title: "Best Photo Editing Software 2024",
          content: "# Best Photo Editing Software 2024\n\n## Our Methodology\n\nWe tested 35+ photo editing applications with professional photographers, evaluating tools, workflow efficiency, and output quality over 180 hours.\n\n### How We Evaluated\n- **Tools**: Editing capabilities and features\n- **User Experience**: Interface and workflow\n- **Performance**: Speed and stability\n- **Output Quality**: File formats and quality\n- **Value**: Features vs. pricing\n\n---\n\n## Best Overall Photo Editor\n\n### Top Pick: Adobe Photoshop\n![Adobe Photoshop](https://source.unsplash.com/random/400x300/?photoshop,adobe)\n\n**Rating: 4.9/5** | **Price: $20.99/month**\n\n**Why We Chose Adobe Photoshop:**\nIndustry-standard photo editing software with unparalleled tools and professional-grade capabilities.\n\n**Key Features:**\n- Advanced layer editing\n- Professional retouching tools\n- Extensive plugin ecosystem\n- RAW processing\n\n**Pros:** Professional tools, industry standard, powerful\n**Cons:** Expensive, steep learning curve\n\n### Other Top Picks\n\n**Adobe Lightroom** - Best for photographers | Rating: 4.8/5 | $9.99/month\n**Affinity Photo** - Best value | Rating: 4.7/5 | $48.99 one-time\n\n---\n\n## Best Free Photo Editor\n\n### Top Pick: GIMP\n![GIMP](https://source.unsplash.com/random/400x300/?gimp,free)\n\n**Rating: 4.4/5** | **Price: Free**\n\n**Why We Chose GIMP:**\nPowerful open-source photo editor that rivals commercial software with comprehensive features.\n\n**Key Features:**\n- Layer-based editing\n- Advanced selection tools\n- Plugin support\n- Professional filters\n\n**Pros:** Completely free, powerful features\n**Cons:** Interface less intuitive, learning curve\n\n### Other Top Picks\n\n**Photopea** - Best web-based | Rating: 4.3/5 | Free\n**Krita** - Best for digital art | Rating: 4.2/5 | Free\n\n---\n\n## Best for Mobile Photo Editing\n\n### Top Pick: Snapseed\n![Snapseed](https://source.unsplash.com/random/400x300/?snapseed,mobile)\n\n**Rating: 4.6/5** | **Price: Free**\n\n**Why We Chose Snapseed:**\nProfessional-grade photo editing tools in a mobile app with intuitive interface and powerful features.\n\n**Key Features:**\n- Professional editing tools\n- Non-destructive editing\n- Detailed controls\n- Google integration\n\n**Pros:** Powerful tools, free, easy to use\n**Cons:** Limited to mobile, no desktop version\n\n### Other Top Picks\n\n**Adobe Lightroom Mobile** - Best ecosystem | Rating: 4.5/5 | Free + $9.99/month\n**VSCO** - Best filters | Rating: 4.4/5 | Free + $19.99/year\n\n---\n\n## Compare All Software\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Adobe Photoshop | 4.9/5 | $20.99/mo | Professionals |\n| Free | GIMP | 4.4/5 | Free | Advanced users |\n| Mobile | Snapseed | 4.6/5 | Free | On-the-go editing |\n\n## Final Verdict\n\nAdobe Photoshop remains the gold standard for professional photo editing, while GIMP and Snapseed offer excellent free alternatives.\n\n*Updated: November 2024 | Tested 35+ applications | 180+ hours of evaluation*",
          author: "Photo Editing Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?photo,editing,software",
          category: "Photo Editing"
        },
        {
          title: "Best Learning Management Systems 2024",
          content: "# Best Learning Management Systems 2024\n\n## Our Methodology\n\nWe tested 25+ LMS platforms with educators and administrators, evaluating features, usability, and scalability over 150 hours.\n\n### How We Evaluated\n- **Features**: Course creation and management tools\n- **User Experience**: Interface for teachers and students\n- **Integration**: Third-party app connections\n- **Scalability**: Performance with large user bases\n- **Support**: Documentation and customer service\n\n---\n\n## Best Overall LMS\n\n### Top Pick: Canvas LMS\n![Canvas LMS](https://source.unsplash.com/random/400x300/?canvas,lms)\n\n**Rating: 4.8/5** | **Price: Free + Custom pricing**\n\n**Why We Chose Canvas LMS:**\nComprehensive learning platform with excellent user experience, powerful features, and strong community support.\n\n**Key Features:**\n- Intuitive course builder\n- Advanced analytics\n- Mobile app\n- Open API\n\n**Pros:** User-friendly, feature-rich, scalable\n**Cons:** Can be expensive for large institutions\n\n### Other Top Picks\n\n**Moodle** - Best open-source | Rating: 4.6/5 | Free\n**Blackboard Learn** - Best for universities | Rating: 4.5/5 | Custom pricing\n\n---\n\n## Best for Small Businesses\n\n### Top Pick: Teachable\n![Teachable](https://source.unsplash.com/random/400x300/?teachable,lms)\n\n**Rating: 4.7/5** | **Price: Free + 5% transaction fee**\n\n**Why We Chose Teachable:**\nPerfect for creating and selling online courses with beautiful design and powerful marketing tools.\n\n**Key Features:**\n- Course creation tools\n- Payment processing\n- Student management\n- Marketing features\n\n**Pros:** Easy to use, beautiful design, good for creators\n**Cons:** Transaction fees, limited customization\n\n### Other Top Picks\n\n**Thinkific** - Best customization | Rating: 4.6/5 | $39/month\n**Kajabi** - Best all-in-one | Rating: 4.5/5 | $119/month\n\n---\n\n## Best for Corporate Training\n\n### Top Pick: Cornerstone OnDemand\n![Cornerstone](https://source.unsplash.com/random/400x300/?cornerstone,corporate)\n\n**Rating: 4.9/5** | **Price: Custom pricing**\n\n**Why We Chose Cornerstone OnDemand:**\nEnterprise-grade LMS with comprehensive talent management and compliance tracking features.\n\n**Key Features:**\n- Talent management suite\n- Compliance tracking\n- Advanced reporting\n- Global scalability\n\n**Pros:** Enterprise features, comprehensive, scalable\n**Cons:** Very expensive, complex implementation\n\n### Other Top Picks\n\n**Saba** - Best for large enterprises | Rating: 4.7/5 | Custom pricing\n**Workday Learning** - Best integration | Rating: 4.6/5 | Custom pricing\n\n---\n\n## Compare All Systems\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Canvas LMS | 4.8/5 | Free+ | Education |\n| Small Business | Teachable | 4.7/5 | Free+ | Course creators |\n| Corporate | Cornerstone OnDemand | 4.9/5 | Custom | Enterprises |\n\n## Final Verdict\n\nCanvas LMS leads for educational institutions, while Teachable excels for individual course creators and small businesses.\n\n*Updated: November 2024 | Tested 25+ platforms | 150+ hours of evaluation*",
          author: "Education Technology Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?lms,learning,education",
          category: "Learning Management"
        },
        {
          title: "Best Streaming Services 2024",
          content: "# Best Streaming Services 2024\n\n## Our Methodology\n\nWe tested 15+ streaming platforms, evaluating content libraries, streaming quality, device support, and value over 120 hours.\n\n### How We Evaluated\n- **Content**: Movie/TV show selection and quality\n- **Streaming Quality**: 4K/HDR support and reliability\n- **Original Content**: Exclusive shows and movies\n- **Device Support**: Platform compatibility\n- **Value**: Content vs. price\n\n---\n\n## Best Overall Streaming Service\n\n### Top Pick: Netflix\n![Netflix](https://source.unsplash.com/random/400x300/?netflix,streaming)\n\n**Rating: 4.9/5** | **Price: $6.99/month**\n\n**Why We Chose Netflix:**\nLargest streaming library with exceptional original content and consistent streaming quality.\n\n**Key Features:**\n- 4K streaming\n- Download for offline viewing\n- Personalized recommendations\n- Multiple profiles\n\n**Pros:** Massive library, great originals, reliable\n**Cons:** Price increases, content rotation\n\n### Other Top Picks\n\n**Disney+** - Best for families | Rating: 4.7/5 | $7.99/month\n**HBO Max** - Best originals | Rating: 4.6/5 | $15.99/month\n\n---\n\n## Best Budget Streaming Service\n\n### Top Pick: Pluto TV\n![Pluto TV](https://source.unsplash.com/random/400x300/?pluto,tv)\n\n**Rating: 4.4/5** | **Price: Free**\n\n**Why We Chose Pluto TV:**\nFree ad-supported streaming with hundreds of live channels and on-demand content.\n\n**Key Features:**\n- 250+ live channels\n- On-demand movies\n- No account required\n- Multiple categories\n\n**Pros:** Completely free, good variety\n**Cons:** Ads, limited premium content\n\n### Other Top Picks\n\n**Tubi** - Best free movies | Rating: 4.3/5 | Free\n**Crackle** - Best free TV | Rating: 4.2/5 | Free\n\n---\n\n## Best for Sports\n\n### Top Pick: ESPN+\n![ESPN+](https://source.unsplash.com/random/400x300/?espn,sports)\n\n**Rating: 4.6/5** | **Price: $9.99/month**\n\n**Why We Chose ESPN+:**\nComprehensive sports streaming with live games, original content, and extensive archives.\n\n**Key Features:**\n- Live sports events\n- ESPN originals\n- 30-day replay\n- Multiple devices\n\n**Pros:** Live sports, comprehensive coverage\n**Cons:** Regional restrictions, add-on costs\n\n### Other Top Picks\n\n**Paramount+** - Best NFL | Rating: 4.5/5 | $4.99/month\n**Peacock** - Best Olympics | Rating: 4.4/5 | Free + $4.99/month\n\n---\n\n## Compare All Services\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Netflix | 4.9/5 | $6.99/mo | Entertainment |\n| Budget | Pluto TV | 4.4/5 | Free | Basic viewing |\n| Sports | ESPN+ | 4.6/5 | $9.99/mo | Sports fans |\n\n## Final Verdict\n\nNetflix dominates general entertainment, while Pluto TV offers excellent free options.\n\n*Updated: November 2024 | Tested 15+ services | 120+ hours of evaluation*",
          author: "Entertainment Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?streaming,services,entertainment",
          category: "Streaming Services"
        },
        {
          title: "Best Web Browsers 2024",
          content: "# Best Web Browsers 2024\n\n## Our Methodology\n\nWe tested 12+ web browsers across performance, security, features, and compatibility over 100 hours.\n\n### How We Evaluated\n- **Performance**: Speed and resource usage\n- **Security**: Built-in protections and updates\n- **Features**: Extensions, sync, and tools\n- **Privacy**: Tracking protection and data handling\n- **Compatibility**: Website and device support\n\n---\n\n## Best Overall Web Browser\n\n### Top Pick: Google Chrome\n![Google Chrome](https://source.unsplash.com/random/400x300/?chrome,browser)\n\n**Rating: 4.7/5** | **Price: Free**\n\n**Why We Chose Google Chrome:**\nFast, feature-rich browser with extensive extension ecosystem and seamless Google integration.\n\n**Key Features:**\n- Chrome Web Store\n- Google account sync\n- Developer tools\n- Cross-platform support\n\n**Pros:** Fast, extensive extensions, reliable\n**Cons:** High memory usage, privacy concerns\n\n### Other Top Picks\n\n**Mozilla Firefox** - Best privacy | Rating: 4.6/5 | Free\n**Microsoft Edge** - Best Windows integration | Rating: 4.5/5 | Free\n\n---\n\n## Best for Privacy\n\n### Top Pick: Brave\n![Brave](https://source.unsplash.com/random/400x300/?brave,browser)\n\n**Rating: 4.5/5** | **Price: Free**\n\n**Why We Chose Brave:**\nPrivacy-focused browser with built-in ad blocking and cryptocurrency rewards.\n\n**Key Features:**\n- Built-in ad blocker\n- HTTPS Everywhere\n- BAT token rewards\n- Tor integration\n\n**Pros:** Strong privacy, fast with ads blocked\n**Cons:** Smaller extension ecosystem\n\n### Other Top Picks\n\n**Tor Browser** - Best anonymity | Rating: 4.3/5 | Free\n**Epic Privacy Browser** - Best simplicity | Rating: 4.1/5 | Free\n\n---\n\n## Best for Developers\n\n### Top Pick: Firefox Developer Edition\n![Firefox Dev](https://source.unsplash.com/random/400x300/?firefox,developer)\n\n**Rating: 4.6/5** | **Price: Free**\n\n**Why We Chose Firefox Developer Edition:**\nSpecialized browser with advanced developer tools and cutting-edge features.\n\n**Key Features:**\n- Advanced dev tools\n- Responsive design mode\n- WebIDE\n- Valence (remote debugging)\n\n**Pros:** Excellent dev tools, open-source\n**Cons:** Less extension support than Chrome\n\n### Other Top Picks\n\n**Chrome Dev** - Best Chrome testing | Rating: 4.5/5 | Free\n**Safari Technology Preview** - Best WebKit testing | Rating: 4.4/5 | Free\n\n---\n\n## Compare All Browsers\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Google Chrome | 4.7/5 | Free | General use |\n| Privacy | Brave | 4.5/5 | Free | Privacy-conscious |\n| Developers | Firefox Developer | 4.6/5 | Free | Web development |\n\n## Final Verdict\n\nGoogle Chrome leads for general use, while Brave excels for privacy-focused users.\n\n*Updated: November 2024 | Tested 12+ browsers | 100+ hours of evaluation*",
          author: "Browser Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?web,browsers,internet",
          category: "Web Browsers"
        },
        {
          title: "Best Email Clients 2024",
          content: "# Best Email Clients 2024\n\n## Our Methodology\n\nWe tested 20+ email clients across productivity, security, features, and user experience over 90 hours.\n\n### How We Evaluated\n- **Productivity**: Organization and workflow features\n- **Security**: Encryption and spam protection\n- **Features**: Integration and customization\n- **User Experience**: Interface and ease of use\n- **Compatibility**: Platform and service support\n\n---\n\n## Best Overall Email Client\n\n### Top Pick: Outlook\n![Outlook](https://source.unsplash.com/random/400x300/?outlook,email)\n\n**Rating: 4.7/5** | **Price: Free + $69.99/year**\n\n**Why We Chose Outlook:**\nPowerful email client with excellent productivity features and seamless Microsoft integration.\n\n**Key Features:**\n- Calendar integration\n- Task management\n- Focused Inbox\n- Advanced search\n\n**Pros:** Feature-rich, reliable, good integration\n**Cons:** Can be overwhelming for beginners\n\n### Other Top Picks\n\n**Gmail** - Best web interface | Rating: 4.6/5 | Free\n**Apple Mail** - Best for Mac users | Rating: 4.5/5 | Free\n\n---\n\n## Best Free Email Client\n\n### Top Pick: Thunderbird\n![Thunderbird](https://source.unsplash.com/random/400x300/?thunderbird,email)\n\n**Rating: 4.4/5** | **Price: Free**\n\n**Why We Chose Thunderbird:**\nOpen-source email client with extensive customization and strong privacy features.\n\n**Key Features:**\n- Multiple account support\n- Add-on ecosystem\n- Open-source\n- Strong privacy controls\n\n**Pros:** Free, customizable, privacy-focused\n**Cons:** Interface dated, less intuitive\n\n### Other Top Picks\n\n**Mailbird** - Best Windows | Rating: 4.3/5 | Free + $39 one-time\n**eM Client** - Best features | Rating: 4.2/5 | Free + $49.95 one-time\n\n---\n\n## Best for Business\n\n### Top Pick: Superhuman\n![Superhuman](https://source.unsplash.com/random/400x300/?superhuman,email)\n\n**Rating: 4.8/5** | **Price: $30/month**\n\n**Why We Chose Superhuman:**\nPremium email client designed for productivity with AI features and keyboard shortcuts.\n\n**Key Features:**\n- AI-powered features\n- Keyboard shortcuts\n- Split inbox\n- Snooze messages\n\n**Pros:** Highly productive, modern interface\n**Cons:** Expensive, limited integrations\n\n### Other Top Picks\n\n**Hey** - Best privacy | Rating: 4.6/5 | $9.99/month\n**ProtonMail** - Best security | Rating: 4.5/5 | Free + $4.99/month\n\n---\n\n## Compare All Clients\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Outlook | 4.7/5 | Free+ | Productivity |\n| Free | Thunderbird | 4.4/5 | Free | Customization |\n| Business | Superhuman | 4.8/5 | $30/mo | High productivity |\n\n## Final Verdict\n\nOutlook leads for general productivity, while Thunderbird offers excellent free features.\n\n*Updated: November 2024 | Tested 20+ clients | 90+ hours of evaluation*",
          author: "Email Client Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?email,clients,productivity",
          category: "Email Clients"
        },
        {
          title: "Best Fitness Trackers 2024",
          content: "# Best Fitness Trackers 2024\n\n## Our Methodology\n\nWe tested 25+ fitness trackers with real workouts, measuring accuracy, features, battery life, and comfort over 140 hours.\n\n### How We Evaluated\n- **Accuracy**: Heart rate, steps, sleep tracking\n- **Features**: Workout modes and health insights\n- **Battery Life**: Real-world usage duration\n- **Comfort**: Wearability and design\n- **Value**: Features vs. price\n\n---\n\n## Best Overall Fitness Tracker\n\n### Top Pick: Fitbit Charge 6\n![Fitbit Charge 6](https://source.unsplash.com/random/400x300/?fitbit,tracker)\n\n**Rating: 4.7/5** | **Price: $149.95**\n\n**Why We Chose Fitbit Charge 6:**\nComprehensive fitness tracking with excellent accuracy and health insights.\n\n**Key Features:**\n- 24/7 heart rate monitoring\n- GPS tracking\n- Sleep analysis\n- 7-day battery life\n\n**Pros:** Accurate tracking, long battery, comprehensive\n**Cons:** Screen could be brighter\n\n### Other Top Picks\n\n**Garmin Forerunner 265** - Best for runners | Rating: 4.6/5 | $449.99\n**Apple Watch Series 9** - Best ecosystem | Rating: 4.5/5 | $399\n\n---\n\n## Best Budget Fitness Tracker\n\n### Top Pick: Xiaomi Mi Band 8\n![Xiaomi Mi Band](https://source.unsplash.com/random/400x300/?xiaomi,band)\n\n**Rating: 4.3/5** | **Price: $29.99**\n\n**Why We Chose Xiaomi Mi Band 8:**\nAffordable fitness tracker with essential features and long battery life.\n\n**Key Features:**\n- Heart rate monitoring\n- 30+ workout modes\n- 16-day battery life\n- Sleep tracking\n\n**Pros:** Very affordable, long battery, good basics\n**Cons:** Limited advanced features\n\n### Other Top Picks\n\n**Fitbit Inspire 3** - Best value | Rating: 4.2/5 | $79.95\n**Amazfit Band 7** - Best battery | Rating: 4.1/5 | $39.99\n\n---\n\n## Best Smartwatch\n\n### Top Pick: Garmin Fenix 7\n![Garmin Fenix 7](https://source.unsplash.com/random/400x300/?garmin,fenix)\n\n**Rating: 4.8/5** | **Price: $699.99**\n\n**Why We Chose Garmin Fenix 7:**\nRugged multisport watch with exceptional battery life and comprehensive tracking.\n\n**Key Features:**\n- 18-day battery life\n- Advanced training metrics\n- Maps and navigation\n- Military-grade durability\n\n**Pros:** Incredible battery, rugged, comprehensive\n**Cons:** Very expensive, complex interface\n\n### Other Top Picks\n\n**Coros Pace 3** - Best running | Rating: 4.6/5 | $249.99\n**Polar Vantage V3** - Best training | Rating: 4.5/5 | $499.95\n\n---\n\n## Compare All Trackers\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Fitbit Charge 6 | 4.7/5 | $149.95 | General fitness |\n| Budget | Xiaomi Mi Band 8 | 4.3/5 | $29.99 | Basic tracking |\n| Smartwatch | Garmin Fenix 7 | 4.8/5 | $699.99 | Serious athletes |\n\n## Final Verdict\n\nFitbit Charge 6 leads for general fitness tracking, while Xiaomi Mi Band 8 offers incredible value.\n\n*Updated: November 2024 | Tested 25+ devices | 140+ hours of evaluation*",
          author: "Fitness Technology Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?fitness,trackers,health",
          category: "Fitness Trackers"
        },
        {
          title: "Best Meal Kit Services 2024",
          content: "# Best Meal Kit Services 2024\n\n## Our Methodology\n\nWe tested 15+ meal kit services, preparing 200+ recipes and evaluating quality, ease, and value over 80 hours.\n\n### How We Evaluated\n- **Food Quality**: Ingredient freshness and taste\n- **Recipe Quality**: Instructions and results\n- **Ease of Use**: Preparation time and complexity\n- **Value**: Cost per serving and waste\n- **Dietary Options**: Variety and customization\n\n---\n\n## Best Overall Meal Kit Service\n\n### Top Pick: Blue Apron\n![Blue Apron](https://source.unsplash.com/random/400x300/?blue,apron)\n\n**Rating: 4.6/5** | **Price: $9.99/portion**\n\n**Why We Chose Blue Apron:**\nHigh-quality ingredients with creative recipes and excellent customer service.\n\n**Key Features:**\n- Chef-designed recipes\n- Fresh, high-quality ingredients\n- Flexible delivery\n- Wine pairing suggestions\n\n**Pros:** Great recipes, quality ingredients, flexible\n**Cons:** More expensive than competitors\n\n### Other Top Picks\n\n**HelloFresh** - Best value | Rating: 4.5/5 | $7.49/portion\n**Home Chef** - Best variety | Rating: 4.4/5 | $6.99/portion\n\n---\n\n## Best Budget Meal Kit\n\n### Top Pick: EveryPlate\n![EveryPlate](https://source.unsplash.com/random/400x300/?everyplate,meal)\n\n**Rating: 4.3/5** | **Price: $4.99/portion**\n\n**Why We Chose EveryPlate:**\nAffordable meal kits with simple recipes and good portion sizes.\n\n**Key Features:**\n- Simple recipes\n- Generous portions\n- Affordable pricing\n- Family-friendly options\n\n**Pros:** Very affordable, filling portions\n**Cons:** Less variety, simpler recipes\n\n### Other Top Picks\n\n**Dinnerly** - Best price | Rating: 4.2/5 | $4.65/portion\n**Terra's Kitchen** - Best organic | Rating: 4.1/5 | $11.00/portion\n\n---\n\n## Best for Families\n\n### Top Pick: Home Chef\n![Home Chef](https://source.unsplash.com/random/400x300/?home,chef)\n\n**Rating: 4.5/5** | **Price: $6.99/portion**\n\n**Why We Chose Home Chef:**\nLarge portion sizes and family-friendly recipes with good customization options.\n\n**Key Features:**\n- Large portions\n- Family meal options\n- Calorie counts\n- Protein preferences\n\n**Pros:** Great for families, customizable\n**Cons:** Packaging can be bulky\n\n### Other Top Picks\n\n**Green Chef** - Best healthy | Rating: 4.4/5 | $11.99/portion\n**Sunbasket** - Best organic | Rating: 4.3/5 | $11.49/portion\n\n---\n\n## Compare All Services\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Blue Apron | 4.6/5 | $9.99/portion | Quality |\n| Budget | EveryPlate | 4.3/5 | $4.99/portion | Affordability |\n| Families | Home Chef | 4.5/5 | $6.99/portion | Family meals |\n\n## Final Verdict\n\nBlue Apron leads with quality and creativity, while EveryPlate offers the best value.\n\n*Updated: November 2024 | Tested 15+ services | 80+ hours of evaluation*",
          author: "Food Service Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?meal,kits,cooking",
          category: "Meal Kits"
        },
        {
          title: "Best Wireless Earbuds 2024",
          content: "# Best Wireless Earbuds 2024\n\n## Our Methodology\n\nWe tested 30+ wireless earbuds across sound quality, comfort, battery life, and features over 160 hours.\n\n### How We Evaluated\n- **Sound Quality**: Audio performance and features\n- **Comfort**: Fit and wearing comfort\n- **Battery Life**: Real-world usage duration\n- **Features**: ANC, touch controls, and connectivity\n- **Value**: Features vs. price\n\n---\n\n## Best Overall Wireless Earbuds\n\n### Top Pick: Sony WF-1000XM5\n![Sony WF-1000XM5](https://source.unsplash.com/random/400x300/?sony,earbuds)\n\n**Rating: 4.8/5** | **Price: $299.99**\n\n**Why We Chose Sony WF-1000XM5:**\nExceptional noise cancellation and sound quality with premium build and features.\n\n**Key Features:**\n- Industry-leading ANC\n- 8-hour battery life\n- Crystal clear calls\n- Multi-device connectivity\n\n**Pros:** Best ANC, great sound, premium feel\n**Cons:** Expensive, no wireless charging case\n\n### Other Top Picks\n\n**Bose QuietComfort Earbuds II** - Best comfort | Rating: 4.7/5 | $279\n**Apple AirPods Pro (2nd gen)** - Best ecosystem | Rating: 4.6/5 | $249\n\n---\n\n## Best Budget Wireless Earbuds\n\n### Top Pick: SoundPEATS TrueFree+\n![SoundPEATS](https://source.unsplash.com/random/400x300/?soundpeats,earbuds)\n\n**Rating: 4.2/5** | **Price: $39.99**\n\n**Why We Chose SoundPEATS TrueFree+:**\nExcellent sound quality and features at a fraction of premium prices.\n\n**Key Features:**\n- 13mm drivers\n- 6-hour battery life\n- Touch controls\n- Bluetooth 5.3\n\n**Pros:** Great sound for price, good battery\n**Cons:** Build quality could be better\n\n### Other Top Picks\n\n**JLab Go Air Pop** - Best value | Rating: 4.1/5 | $24.99\n**Anker Soundcore Liberty 3** - Best bass | Rating: 4.0/5 | $79.99\n\n---\n\n## Best for Workouts\n\n### Top Pick: Jabra Elite 8 Active\n![Jabra Elite 8](https://source.unsplash.com/random/400x300/?jabra,earbuds)\n\n**Rating: 4.5/5** | **Price: $199.99**\n\n**Why We Chose Jabra Elite 8 Active:**\nSweat-resistant design with secure fit and good audio for active users.\n\n**Key Features:**\n- IP68 water resistance\n- Secure fit\n- 8-hour battery life\n- Heart rate monitoring\n\n**Pros:** Great for workouts, secure fit, durable\n**Cons:** Average sound quality\n\n### Other Top Picks\n\n**Samsung Galaxy Buds 2 Pro** - Best Samsung users | Rating: 4.4/5 | $179.99\n**Sony WF-C500** - Best budget workout | Rating: 4.2/5 | $49.99\n\n---\n\n## Compare All Earbuds\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Sony WF-1000XM5 | 4.8/5 | $299.99 | Premium audio |\n| Budget | SoundPEATS TrueFree+ | 4.2/5 | $39.99 | Value |\n| Workouts | Jabra Elite 8 Active | 4.5/5 | $199.99 | Fitness |\n\n## Final Verdict\n\nSony WF-1000XM5 leads with premium features, while SoundPEATS offers incredible value.\n\n*Updated: November 2024 | Tested 30+ models | 160+ hours of evaluation*",
          author: "Audio Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?wireless,earbuds,audio",
          category: "Wireless Earbuds"
        },
        {
          title: "Best Robot Vacuums 2024",
          content: "# Best Robot Vacuums 2024\n\n## Our Methodology\n\nWe tested 20+ robot vacuums in various home environments, measuring cleaning performance, navigation, and maintenance over 120 hours.\n\n### How We Evaluated\n- **Cleaning Performance**: Effectiveness on different surfaces\n- **Navigation**: Mapping and obstacle avoidance\n- **Battery Life**: Runtime and charging\n- **Maintenance**: Filter cleaning and upkeep\n- **Smart Features**: App control and scheduling\n\n---\n\n## Best Overall Robot Vacuum\n\n### Top Pick: iRobot Roomba j7+\n![iRobot Roomba j7+](https://source.unsplash.com/random/400x300/?irobot,roomba)\n\n**Rating: 4.7/5** | **Price: $849.99**\n\n**Why We Chose iRobot Roomba j7+:**\nIntelligent navigation with excellent cleaning performance and smart obstacle avoidance.\n\n**Key Features:**\n- PrecisionVision Navigation\n- Self-emptying base\n- 75-minute runtime\n- App control\n\n**Pros:** Smart navigation, excellent cleaning, convenient\n**Cons:** Very expensive\n\n### Other Top Picks\n\n**Shark Navigator Lift-Away** - Best budget | Rating: 4.4/5 | $299.99\n**Eufy RoboVac X8** - Best value | Rating: 4.3/5 | $399.99\n\n---\n\n## Best Budget Robot Vacuum\n\n### Top Pick: eufy RoboVac 11S\n![eufy RoboVac](https://source.unsplash.com/random/400x300/?eufy,vacuum)\n\n**Rating: 4.1/5** | **Price: $199.99**\n\n**Why We Chose eufy RoboVac 11S:**\nReliable cleaning performance at an accessible price point.\n\n**Key Features:**\n- 100-minute runtime\n- BoostIQ technology\n- App control\n- Boundary strips\n\n**Pros:** Affordable, good battery life, reliable\n**Cons:** No mapping, basic features\n\n### Other Top Picks\n\n**iLife A9s** - Best cheap | Rating: 3.9/5 | $149.99\n**Wyze Robot Vacuum** - Best WiFi | Rating: 4.0/5 | $199.99\n\n---\n\n## Best Robot Vacuum with Mop\n\n### Top Pick: Roborock S8 Pro Ultra\n![Roborock S8](https://source.unsplash.com/random/400x300/?roborock,vacuum)\n\n**Rating: 4.8/5** | **Price: $1,399.99**\n\n**Why We Chose Roborock S8 Pro Ultra:**\nAdvanced vacuum and mopping capabilities with exceptional cleaning performance.\n\n**Key Features:**\n- Sonic mopping\n- 8,000Pa suction\n- ReactiveAI obstacle avoidance\n- Auto-empty and clean\n\n**Pros:** Excellent cleaning, smart features\n**Cons:** Extremely expensive\n\n### Other Top Picks\n\n**Dreame L10 Prime** - Best balance | Rating: 4.6/5 | $699.99\n**iRobot Roomba Combo j7+** - Best iRobot | Rating: 4.5/5 | $1,099.99\n\n---\n\n## Compare All Vacuums\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | iRobot Roomba j7+ | 4.7/5 | $849.99 | Premium cleaning |\n| Budget | eufy RoboVac 11S | 4.1/5 | $199.99 | Basic cleaning |\n| With Mop | Roborock S8 Pro Ultra | 4.8/5 | $1,399.99 | Complete cleaning |\n\n## Final Verdict\n\niRobot Roomba j7+ leads with smart features, while eufy offers great budget value.\n\n*Updated: November 2024 | Tested 20+ models | 120+ hours of evaluation*",
          author: "Smart Home Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?robot,vacuums,cleaning",
          category: "Robot Vacuums"
        },
        {
          title: "Best Coffee Makers 2024",
          content: "# Best Coffee Makers 2024\n\n## Our Methodology\n\nWe tested 25+ coffee makers, brewing 500+ cups and evaluating taste, convenience, and features over 100 hours.\n\n### How We Evaluated\n- **Taste Quality**: Coffee flavor and temperature\n- **Convenience**: Ease of use and cleaning\n- **Features**: Programmability and customization\n- **Value**: Performance vs. price\n- **Consistency**: Reliable results\n\n---\n\n## Best Overall Coffee Maker\n\n### Top Pick: Breville Barista Express\n![Breville Barista](https://source.unsplash.com/random/400x300/?breville,coffee)\n\n**Rating: 4.8/5** | **Price: $699.95**\n\n**Why We Chose Breville Barista Express:**\nProfessional-grade espresso machine that rivals cafe quality at home.\n\n**Key Features:**\n- Built-in grinder\n- 9-bar pressure\n- Temperature control\n- Steam wand\n\n**Pros:** Cafe-quality espresso, versatile, durable\n**Cons:** Expensive, learning curve\n\n### Other Top Picks\n\n**Ninja Specialty** - Best value | Rating: 4.5/5 | $149.99\n**Cuisinart Grind & Brew** - Best automatic | Rating: 4.4/5 | $99.99\n\n---\n\n## Best Budget Coffee Maker\n\n### Top Pick: Mr. Coffee Simple Brew\n![Mr. Coffee](https://source.unsplash.com/random/400x300/?mr,coffee)\n\n**Rating: 4.1/5** | **Price: $19.99**\n\n**Why We Chose Mr. Coffee Simple Brew:**\nReliable basic coffee maker that delivers consistent results at a low price.\n\n**Key Features:**\n- 12-cup capacity\n- Auto pause-and-serve\n- Simple controls\n- Affordable\n\n**Pros:** Very affordable, reliable, easy to use\n**Cons:** Basic features, no advanced options\n\n### Other Top Picks\n\n**Hamilton Beach FlexBrew** - Best single-serve | Rating: 4.0/5 | $49.99\n**Black+Decker 12-Cup** - Best large capacity | Rating: 3.9/5 | $24.99\n\n---\n\n## Best Single-Serve Coffee Maker\n\n### Top Pick: Keurig K-Elite\n![Keurig K-Elite](https://source.unsplash.com/random/400x300/?keurig,coffee)\n\n**Rating: 4.3/5** | **Price: $149.99**\n\n**Why We Chose Keurig K-Elite:**\nConvenient single-serve system with strong coffee and iced beverage capabilities.\n\n**Key Features:**\n- Strong brew\n- Iced coffee setting\n- Large water reservoir\n- Multiple cup sizes\n\n**Pros:** Convenient, consistent, versatile\n**Cons:** Pods expensive, plastic waste\n\n### Other Top Picks\n\n**Nespresso Vertuo** - Best espresso | Rating: 4.2/5 | $199.99\n**Cuisinart SS-15** - Best thermal | Rating: 4.1/5 | $99.99\n\n---\n\n## Compare All Makers\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | Breville Barista Express | 4.8/5 | $699.95 | Espresso lovers |\n| Budget | Mr. Coffee Simple Brew | 4.1/5 | $19.99 | Basic coffee |\n| Single-Serve | Keurig K-Elite | 4.3/5 | $149.99 | Convenience |\n\n## Final Verdict\n\nBreville Barista Express delivers cafe-quality results, while Mr. Coffee offers reliable basics.\n\n*Updated: November 2024 | Tested 25+ models | 100+ hours of evaluation*",
          author: "Kitchen Appliance Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?coffee,makers,appliances",
          category: "Coffee Makers"
        },
        {
          title: "Best Gaming Monitors 2024",
          content: "# Best Gaming Monitors 2024\n\n## Our Methodology\n\nWe tested 35+ gaming monitors across frame rates, response times, and image quality over 180 hours.\n\n### How We Evaluated\n- **Performance**: Refresh rate and response time\n- **Image Quality**: Color accuracy and contrast\n- **Features**: Adaptive sync and connectivity\n- **Ergonomics**: Adjustability and comfort\n- **Value**: Performance vs. price\n\n---\n\n## Best Overall Gaming Monitor\n\n### Top Pick: ASUS ROG Swift PG279QM\n![ASUS ROG Swift](https://source.unsplash.com/random/400x300/?asus,monitor)\n\n**Rating: 4.8/5** | **Price: $599.99**\n\n**Why We Chose ASUS ROG Swift PG279QM:**\nExceptional 1440p gaming performance with excellent color accuracy and build quality.\n\n**Key Features:**\n- 144Hz refresh rate\n- 1ms response time\n- 1440p resolution\n- G-Sync Compatible\n\n**Pros:** Excellent performance, great colors, premium build\n**Cons:** Expensive, requires powerful GPU\n\n### Other Top Picks\n\n**Samsung Odyssey G7** - Best curved | Rating: 4.7/5 | $599.99\n**LG 27GP950-B** - Best 4K | Rating: 4.6/5 | $699.99\n\n---\n\n## Best Budget Gaming Monitor\n\n### Top Pick: Sceptre C345B-185RD\n![Sceptre Monitor](https://source.unsplash.com/random/400x300/?sceptre,monitor)\n\n**Rating: 4.2/5** | **Price: $199.99**\n\n**Why We Chose Sceptre C345B-185RD:**\nCurved 144Hz monitor that delivers solid gaming performance at an affordable price.\n\n**Key Features:**\n- 144Hz refresh rate\n- 1080p resolution\n- Curved VA panel\n- AMD FreeSync\n\n**Pros:** Affordable 144Hz, good for 1080p gaming\n**Cons:** Average color accuracy, TN panel\n\n### Other Top Picks\n\n**AOC C32V1** - Best value | Rating: 4.1/5 | $179.99\n**ViewSonic VX3276-4K** - Best 4K budget | Rating: 4.0/5 | $349.99\n\n---\n\n## Best 4K Gaming Monitor\n\n### Top Pick: Samsung UR59C\n![Samsung UR59C](https://source.unsplash.com/random/400x300/?samsung,4k,monitor)\n\n**Rating: 4.6/5** | **Price: $499.99**\n\n**Why We Chose Samsung UR59C:**\nExcellent 4K gaming monitor with 144Hz refresh rate and great color accuracy.\n\n**Key Features:**\n- 4K resolution\n- 144Hz refresh rate\n- Quantum Dot technology\n- HDR10 support\n\n**Pros:** True 4K at 144Hz, great colors, affordable\n**Cons:** Requires powerful GPU, 32-inch size\n\n### Other Top Picks\n\n**LG 32UN880-B** - Best color | Rating: 4.5/5 | $549.99\n**Acer EI322QUR** - Best IPS | Rating: 4.4/5 | $449.99\n\n---\n\n## Compare All Monitors\n\n| Category | Top Pick | Rating | Price | Best For |\n|----------|----------|--------|-------|----------|\n| Overall | ASUS ROG Swift PG279QM | 4.8/5 | $599.99 | 1440p gaming |\n| Budget | Sceptre C345B-185RD | 4.2/5 | $199.99 | 1080p gaming |\n| 4K | Samsung UR59C | 4.6/5 | $499.99 | High-end gaming |\n\n## Final Verdict\n\nASUS ROG Swift PG279QM leads for premium gaming, while Sceptre offers great budget value.\n\n*Updated: November 2024 | Tested 35+ monitors | 180+ hours of evaluation*",
          author: "Gaming Hardware Reviewer",
          image_url: "https://source.unsplash.com/random/800x600/?gaming,monitors,displays",
          category: "Gaming Monitors"
        },
        {
          title: "Travel Insurance Guide 2024",
          content: "# Travel Insurance Guide 2024\n\n## Key Takeaways\n\nTravel insurance can protect you from unexpected events that could derail your trip. Here's what you need to know:\n\n- **Trip Cancellation Coverage**: Protects against lost deposits if you must cancel\n- **Medical Emergency Coverage**: Pays for medical care abroad\n- **Trip Interruption Coverage**: Covers early returns due to covered events\n- **Baggage Loss Coverage**: Reimburses lost or stolen belongings\n\n## What Does Travel Insurance Cover?\n\nTravel insurance typically covers several major categories of risk:\n\n### Trip Cancellation and Interruption\n\nCovers non-refundable costs if you must cancel or interrupt your trip due to:\n- Illness or injury\n- Death in the family\n- Weather events\n- Travel advisories\n- Carrier bankruptcy\n\n### Medical Emergencies\n\nProvides coverage for:\n- Emergency medical care\n- Hospital stays\n- Medical evacuation\n- Trip delays due to medical issues\n- Dental emergencies\n\n### Baggage and Personal Belongings\n\nCovers:\n- Lost, stolen, or damaged baggage\n- Travel documents\n- Personal electronics\n- Clothing and toiletries\n\n### Travel Delays and Missed Connections\n\nCompensation for:\n- Missed flight connections\n- Extended hotel stays\n- Meal costs during delays\n- Emergency communications\n\n## Types of Travel Insurance\n\n### Single-Trip Insurance\n\nBest for one-time trips. Covers a specific journey with defined dates.\n\n**Pros:**\n- Lower cost for short trips\n- Tailored coverage for specific destinations\n- No annual commitment\n\n**Cons:**\n- Must purchase for each trip\n- Limited flexibility for date changes\n\n### Annual Multi-Trip Insurance\n\nIdeal for frequent travelers. Covers unlimited trips within a year.\n\n**Pros:**\n- Cost-effective for frequent travelers\n- Covers all trips automatically\n- Often includes cruise coverage\n\n**Cons:**\n- Higher upfront cost\n- May have trip length limits\n\n### Cancel for Any Reason (CFAR)\n\nProvides broader cancellation coverage beyond standard reasons.\n\n**Pros:**\n- Covers cancellation for any reason\n- Peace of mind for expensive trips\n- Includes pre-existing conditions\n\n**Cons:**\n- Significantly more expensive\n- Usually 75-90% reimbursement\n- Limited to first 24-48 hours\n\n## When Should You Buy Travel Insurance?\n\n### Best Time to Purchase\n\n- **Immediately after booking**: Locks in coverage before conditions change\n- **At least 2 weeks before departure**: Ensures coverage activation\n- **Before paying final payment**: Protects your investment\n\n### Latest You Can Buy\n\n- **Some policies allow purchase up to departure**\n- **Medical coverage often requires advance purchase**\n- **Check policy terms for specific deadlines**\n\n## How to Choose Travel Insurance\n\n### Assess Your Needs\n\nConsider:\n- **Trip cost**: Higher cost trips need more coverage\n- **Destination**: Risk factors vary by location\n- **Health**: Pre-existing conditions affect coverage\n- **Activities**: Adventure sports may need special coverage\n\n### Compare Coverage Limits\n\nLook for adequate limits in:\n- **Medical coverage**: $50,000+ for international travel\n- **Trip cancellation**: 100% of trip cost\n- **Baggage coverage**: $1,000+ per person\n- **Emergency evacuation**: $100,000+ coverage\n\n### Check Exclusions\n\nCommon exclusions include:\n- Pre-existing medical conditions\n- Adventure sports injuries\n- Alcohol-related incidents\n- War or terrorism\n- Normal pregnancy\n\n## Travel Insurance Costs\n\n### Average Costs by Trip Type\n\n| Trip Type | Average Cost | Percentage of Trip Cost |\n|-----------|--------------|-------------------------|\n| Domestic | $50-150 | 3-5% |\n| International | $150-500 | 5-8% |\n| Luxury/Adventure | $500+ | 8-12% |\n\n### Cost Factors\n\n- **Trip cost**: Higher trips cost more to insure\n- **Destination**: Riskier destinations cost more\n- **Age**: Older travelers pay more\n- **Coverage level**: More coverage costs more\n- **Deductibles**: Lower deductibles cost more\n\n## Top Travel Insurance Providers\n\n### Best Overall: Allianz\n\n**Rating: 4.8/5** | **Price: $150-400**\n\n**Why We Chose Allianz:**\nExcellent coverage with responsive claims service and comprehensive benefits.\n\n**Key Features:**\n- 24/7 emergency assistance\n- COVID-19 coverage options\n- Comprehensive medical coverage\n- Trip cancellation protection\n\n### Best Budget: Squaremouth\n\n**Rating: 4.5/5** | **Price: $80-250**\n\n**Why We Chose Squaremouth:**\nCompetitive pricing with good coverage and easy comparison tools.\n\n**Key Features:**\n- Multiple carrier options\n- Easy online purchase\n- Good customer service\n- Flexible cancellation options\n\n### Best for Adventure Travel: Travel Guard\n\n**Rating: 4.6/5** | **Price: $200-600**\n\n**Why We Chose Travel Guard:**\nSpecialized coverage for adventure activities and extreme sports.\n\n**Key Features:**\n- Adventure sports coverage\n- Extreme sports included\n- Medical evacuation coverage\n- Emergency assistance\n\n## Frequently Asked Questions\n\n### Do I Need Travel Insurance?\n\nWhile not always required, travel insurance is highly recommended for:\n- International trips\n- Expensive vacations\n- Trips during peak season\n- Travelers with health conditions\n- Adventure travel\n\n### What Does 'Pre-Existing Condition' Mean?\n\nA pre-existing condition is any medical issue you had before purchasing insurance, including:\n- Chronic illnesses\n- Recent injuries\n- Pregnancy\n- Mental health conditions\n\n### Can I Buy Insurance After Booking?\n\nYes, but:\n- Purchase as soon as possible after booking\n- Some coverage may be limited\n- Medical coverage often requires advance purchase\n- Costs may be higher\n\n### What's Covered for COVID-19?\n\nCoverage varies by policy and provider:\n- Trip cancellations due to COVID-19\n- Medical care for COVID-19 treatment\n- Quarantine expenses\n- Emergency evacuation\n\n### How Do I File a Claim?\n\n1. Contact your insurance provider immediately\n2. Document all expenses and incidents\n3. Submit claim form with supporting documents\n4. Follow up regularly on claim status\n5. Appeal if claim is denied\n\n## Final Thoughts\n\nTravel insurance provides essential protection for your travel investment. While it adds cost to your trip, the peace of mind and financial protection it offers is invaluable. Choose a policy that matches your trip type, destination, and personal needs.\n\n*Updated: November 2024 | Reviewed 25+ providers | 150+ hours of research*",
          author: "Travel Insurance Expert",
          image_url: "https://source.unsplash.com/random/800x600/?travel,insurance,protection",
          category: "Travel Insurance"
        }
      ];

      for (const article of sampleArticles) {
        await db.run(
          `INSERT INTO articles (title, content, author, image_url, category) VALUES (?, ?, ?, ?, ?)`,
          article.title,
          article.content,
          article.author,
          article.image_url,
          article.category
        );
      }
      console.log("Sample articles inserted into database.");
    }

    // Insert sample banking data if tables are empty
    const creditCardCount = await db.get(`SELECT COUNT(*) as count FROM credit_cards;`);
    if (creditCardCount.count === 0) {
      const sampleCreditCards = [
        {
          name: "Chase Sapphire Preferred",
          provider: "Chase",
          annual_fee: 95,
          apr: 24.99,
          rewards: "3x on travel, dining, and U.S. supermarkets",
          pros: "Excellent travel rewards, 5x on travel booked through Chase portal, no foreign transaction fees with Ultimate Rewards",
          cons: "Annual fee, complex redemption",
          link: "https://www.chase.com/personal/credit-cards/sapphire/preferred",
          image_url: "https://source.unsplash.com/random/400x300/?credit,card,chase"
        },
        {
          name: "Discover Cash Back",
          provider: "Discover",
          annual_fee: 0,
          apr: 26.99,
          rewards: "5% cash back in rotating categories, 1% on all other purchases",
          pros: "No annual fee, unlimited 5% categories, cash back match",
          cons: "Lower rewards on non-rotating purchases",
          link: "https://www.discover.com/credit-cards/cash-back/",
          image_url: "https://source.unsplash.com/random/400x300/?credit,card,discover"
        },
        {
          name: "Capital One Platinum Credit Card",
          provider: "Capital One",
          annual_fee: 0,
          apr: 26.99,
          rewards: "1.5% cash back on all purchases",
          pros: "No annual fee, automatic credit line increases, simple rewards",
          cons: "Low rewards rate",
          link: "https://www.capitalone.com/credit-cards/platinum/",
          image_url: "https://source.unsplash.com/random/400x300/?credit,card,capitalone"
        }
      ];

      for (const card of sampleCreditCards) {
        await db.run(
          `INSERT INTO credit_cards (name, provider, annual_fee, apr, rewards, pros, cons, link, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          card.name, card.provider, card.annual_fee, card.apr, card.rewards, card.pros, card.cons, card.link, card.image_url
        );
      }
      console.log("Sample credit cards inserted into database.");
    }

    const savingsCount = await db.get(`SELECT COUNT(*) as count FROM savings_accounts;`);
    if (savingsCount.count === 0) {
      const sampleSavings = [
        {
          name: "Ally High-Yield Savings Account",
          provider: "Ally",
          apy: 4.25,
          minimum_deposit: 0,
          monthly_fee: 0,
          pros: "High APY, no minimum balance, no monthly fees",
          cons: "No physical branches",
          link: "https://www.ally.com/bank/savings-account/",
          image_url: "https://source.unsplash.com/random/400x300/?savings,account,ally"
        },
        {
          name: "Marcus by Goldman Sachs High-Yield Savings",
          provider: "Goldman Sachs",
          apy: 4.30,
          minimum_deposit: 0,
          monthly_fee: 0,
          pros: "Competitive APY, FDIC insured, no fees",
          cons: "No checking account integration",
          link: "https://www.marcus.com/us/en/savings/high-yield-savings",
          image_url: "https://source.unsplash.com/random/400x300/?savings,account,marcus"
        },
        {
          name: "Capital One 360 Performance Savings",
          provider: "Capital One",
          apy: 4.10,
          minimum_deposit: 0,
          monthly_fee: 0,
          pros: "High APY, no fees, easy to open",
          cons: "Limited ATM access",
          link: "https://www.capitalone.com/bank/savings-accounts/performance-savings/",
          image_url: "https://source.unsplash.com/random/400x300/?savings,account,capitalone"
        }
      ];

      for (const account of sampleSavings) {
        await db.run(
          `INSERT INTO savings_accounts (name, provider, apy, minimum_deposit, monthly_fee, pros, cons, link, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          account.name, account.provider, account.apy, account.minimum_deposit, account.monthly_fee, account.pros, account.cons, account.link, account.image_url
        );
      }
      console.log("Sample savings accounts inserted into database.");
    }

    const checkingCount = await db.get(`SELECT COUNT(*) as count FROM checking_accounts;`);
    if (checkingCount.count === 0) {
      const sampleChecking = [
        {
          name: "Ally Interest Checking Account",
          provider: "Ally",
          monthly_fee: 0,
          atm_fees: 0,
          overdraft_protection: "Available",
          pros: "No monthly fees, no minimum balance, interest earning",
          cons: "No physical branches",
          link: "https://www.ally.com/bank/checking-account/",
          image_url: "https://source.unsplash.com/random/400x300/?checking,account,ally"
        },
        {
          name: "Capital One Platinum Checking",
          provider: "Capital One",
          monthly_fee: 0,
          atm_fees: 0,
          overdraft_protection: "Available",
          pros: "No fees, earns interest, mobile app",
          cons: "No overdraft fees but may decline transactions",
          link: "https://www.capitalone.com/bank/checking-accounts/platinum-checking/",
          image_url: "https://source.unsplash.com/random/400x300/?checking,account,capitalone"
        },
        {
          name: "Discover Cashback Debit",
          provider: "Discover",
          monthly_fee: 0,
          atm_fees: 0,
          overdraft_protection: "Available",
          pros: "Cash back rewards, no fees, FDIC insured",
          cons: "Limited ATM network",
          link: "https://www.discover.com/credit-cards/debit/",
          image_url: "https://source.unsplash.com/random/400x300/?checking,account,discover"
        }
      ];

      for (const account of sampleChecking) {
        await db.run(
          `INSERT INTO checking_accounts (name, provider, monthly_fee, atm_fees, overdraft_protection, pros, cons, link, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          account.name, account.provider, account.monthly_fee, account.atm_fees, account.overdraft_protection, account.pros, account.cons, account.link, account.image_url
        );
      }
      console.log("Sample checking accounts inserted into database.");
    }

    const cdCount = await db.get(`SELECT COUNT(*) as count FROM cds;`);
    if (cdCount.count === 0) {
      const sampleCDs = [
        {
          name: "Ally 12-Month High-Yield CD",
          provider: "Ally",
          apy: 4.50,
          term_months: 12,
          minimum_deposit: 0,
          early_withdrawal_penalty: "60 days of interest",
          pros: "High APY, no minimum deposit, flexible terms",
          cons: "Early withdrawal penalty",
          link: "https://www.ally.com/bank/cd/",
          image_url: "https://source.unsplash.com/random/400x300/?cd,ally"
        },
        {
          name: "Discover 12-Month CD",
          provider: "Discover",
          apy: 4.40,
          term_months: 12,
          minimum_deposit: 2500,
          early_withdrawal_penalty: "3 months of interest",
          pros: "Competitive APY, bump-up option",
          cons: "Minimum deposit required",
          link: "https://www.discover.com/banking/cd/",
          image_url: "https://source.unsplash.com/random/400x300/?cd,discover"
        },
        {
          name: "Capital One 12-Month CD",
          provider: "Capital One",
          apy: 4.25,
          term_months: 12,
          minimum_deposit: 0,
          early_withdrawal_penalty: "3 months of interest",
          pros: "No minimum deposit, competitive rates",
          cons: "Penalty for early withdrawal",
          link: "https://www.capitalone.com/bank/cds/",
          image_url: "https://source.unsplash.com/random/400x300/?cd,capitalone"
        }
      ];

      for (const cd of sampleCDs) {
        await db.run(
          `INSERT INTO cds (name, provider, apy, term_months, minimum_deposit, early_withdrawal_penalty, pros, cons, link, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          cd.name, cd.provider, cd.apy, cd.term_months, cd.minimum_deposit, cd.early_withdrawal_penalty, cd.pros, cd.cons, cd.link, cd.image_url
        );
      }
      console.log("Sample CDs inserted into database.");
    }

    const aiToolsCount = await db.get(`SELECT COUNT(*) as count FROM ai_tools;`);
    if (aiToolsCount.count === 0) {
      const sampleAITools = [
        // AI Writing Tools
        {
          category: "ai_writing",
          name: "ChatGPT",
          description: "Advanced language model for generating human-like text, answering questions, and assisting with writing tasks.",
          pros: "Versatile, easy to use, handles multiple languages, free tier available",
          cons: "Can produce inaccurate information, limited customization",
          link: "https://chat.openai.com/",
          image_url: "https://source.unsplash.com/random/400x300/?chatgpt,ai,writing",
          rating: 4.8,
          pricing: "Free tier, Plus: $20/month",
          best_for: "General writing, brainstorming, research"
        },
        {
          category: "ai_writing",
          name: "Jasper",
          description: "AI writing assistant specialized in marketing copy, blog posts, and creative content.",
          pros: "Specialized for marketing, high-quality output, templates available",
          cons: "Expensive, learning curve for advanced features",
          link: "https://www.jasper.ai/",
          image_url: "https://source.unsplash.com/random/400x300/?jasper,ai,writing",
          rating: 4.6,
          pricing: "Creator: $39/month, Teams: $99/month",
          best_for: "Marketing copy, blog writing, social media content"
        },
        {
          category: "ai_writing",
          name: "Copy.ai",
          description: "AI-powered copywriting tool for generating marketing content, ads, and product descriptions.",
          pros: "User-friendly interface, fast generation, affordable",
          cons: "Limited advanced features, occasional repetitive output",
          link: "https://www.copy.ai/",
          image_url: "https://source.unsplash.com/random/400x300/?copy,ai,writing",
          rating: 4.4,
          pricing: "Free trial, Pro: $49/month",
          best_for: "Marketing copy, email campaigns, product descriptions"
        },
        // AI Image Generators
        {
          category: "ai_image",
          name: "DALL-E 3",
          description: "Advanced AI image generation tool that creates realistic images from text descriptions.",
          pros: "High-quality images, understands complex prompts, integrated with ChatGPT",
          cons: "Requires ChatGPT Plus subscription, usage limits",
          link: "https://openai.com/dall-e-3/",
          image_url: "https://source.unsplash.com/random/400x300/?dalle,ai,image",
          rating: 4.9,
          pricing: "Included with ChatGPT Plus: $20/month",
          best_for: "Creative projects, marketing visuals, concept art"
        },
        {
          category: "ai_image",
          name: "Midjourney",
          description: "AI-powered image generation tool known for artistic and creative outputs.",
          pros: "Artistic style, community-driven, high creativity",
          cons: "Discord-based interface, requires subscription for unlimited use",
          link: "https://www.midjourney.com/",
          image_url: "https://source.unsplash.com/random/400x300/?midjourney,ai,image",
          rating: 4.7,
          pricing: "Basic: $10/month, Standard: $30/month",
          best_for: "Artistic images, illustrations, creative designs"
        },
        {
          category: "ai_image",
          name: "Stable Diffusion",
          description: "Open-source AI image generation model, accessible through various interfaces.",
          pros: "Free and open-source, highly customizable, community support",
          cons: "Requires technical knowledge, can be resource-intensive",
          link: "https://stability.ai/",
          image_url: "https://source.unsplash.com/random/400x300/?stable,diffusion,ai",
          rating: 4.5,
          pricing: "Free (open-source), paid APIs available",
          best_for: "Custom image generation, research, advanced users"
        },
        // AI Code Assistants
        {
          category: "ai_coding",
          name: "GitHub Copilot",
          description: "AI-powered code completion tool that suggests code snippets and functions.",
          pros: "Integrates with IDEs, understands context, speeds up coding",
          cons: "Requires GitHub subscription, can suggest incorrect code",
          link: "https://github.com/features/copilot",
          image_url: "https://source.unsplash.com/random/400x300/?github,copilot,ai",
          rating: 4.6,
          pricing: "$10/month or $100/year",
          best_for: "Software development, code completion, debugging"
        },
        {
          category: "ai_coding",
          name: "Tabnine",
          description: "AI code assistant that provides intelligent code completions across multiple languages.",
          pros: "Supports many languages, learns from codebase, privacy-focused",
          cons: "Free tier limitations, occasional inaccurate suggestions",
          link: "https://www.tabnine.com/",
          image_url: "https://source.unsplash.com/random/400x300/?tabnine,ai,coding",
          rating: 4.4,
          pricing: "Free tier, Pro: $12/month",
          best_for: "Code completion, productivity, team collaboration"
        },
        // AI Chatbots
        {
          category: "ai_chatbots",
          name: "Claude",
          description: "Advanced AI chatbot known for helpful and truthful responses.",
          pros: "Balanced responses, good at analysis, long context window",
          cons: "Slower than some competitors, limited integrations",
          link: "https://claude.ai/",
          image_url: "https://source.unsplash.com/random/400x300/?claude,ai,chatbot",
          rating: 4.7,
          pricing: "Free tier, Pro: $20/month",
          best_for: "Conversational AI, research, creative writing"
        },
        // AI Productivity Tools
        {
          category: "ai_productivity",
          name: "Notion AI",
          description: "AI-powered workspace tool for note-taking, project management, and content creation.",
          pros: "Integrated with Notion, versatile uses, improves productivity",
          cons: "Requires Notion subscription, AI features are add-on",
          link: "https://www.notion.so/product/ai",
          image_url: "https://source.unsplash.com/random/400x300/?notion,ai,productivity",
          rating: 4.5,
          pricing: "Plus: $8/user/month (with AI)",
          best_for: "Note-taking, project management, content creation"
        }
      ];

      for (const tool of sampleAITools) {
        await db.run(
          `INSERT INTO ai_tools (category, name, description, pros, cons, link, image_url, rating, pricing, best_for) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          tool.category, tool.name, tool.description, tool.pros, tool.cons, tool.link, tool.image_url, tool.rating, tool.pricing, tool.best_for
        );
      }
      console.log("Sample AI tools inserted into database.");
    }

    // Your other initialization code here...

    const DOMAIN = 'localhost'; // Replace
    const HOST = '0.0.0.0'; // Replace with your desired host
    const PORT = process.env.PORT || 3002;

    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, 'ssl/private.key')),
      cert: fs.readFileSync(path.join(__dirname, 'ssl/certificate.crt')),
    };

    // const server = https.createServer(httpsOptions, app);
    const server = http.createServer(app);

    
    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server Running in Docker at http://localhost:${PORT}/`);
    });
    
    

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

initializeDBAndServer();

app.use(cors());
app.use(express.json());

// Define your routes and other middleware here...


// Define your routes and other middleware here...


// ... Previous code ...



app.get("/mobiles", async (req, res) => {
  try {
    const tableName = "mobiles";
    const getDataQuery = `
        SELECT
          name,
          image_public_id,
          description,
          new_id,
          price,
          brand,
          currys_price,
          amazon_link,
          currys_link
        FROM
          ${tableName};
      `;

    const data = await db.all(getDataQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
      brand: item.brand,
      currys_price: item.currys_price,
      amazon_link: item.amazon_link,
      currys_link: item.currys_link
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/mobiles/:brand", async (req, res) => {
  try {
    const { brand } = req.params;

    // Ensure that the brand name corresponds to an existing table
    const validBrands = ['apple', 'samsung', 'xiaomi', 'oneplus','google', 'motorola' /* add other valid brand names */];
    if (!validBrands.includes(brand.toLowerCase())) {
      return res.status(400).json({ error: "Invalid brand" });
    }

    const getDataByBrandQuery = `
      SELECT
        name,
        image_public_id,
        description,
        new_id,
        price
      FROM
        ${brand.toLowerCase()}  -- assuming the table names match the brand names
      ORDER BY
        brand;
    `;

    const data = await db.all(getDataByBrandQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
      brand: brand.toLowerCase(),
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.get("/apple", async (req, res) => {
  try {
    const tableName = "apple";
    const getDataQuery = `
        SELECT
          name,
          image_public_id,
          description,
          new_id,
          price
        FROM
          ${tableName};
      `;

    const data = await db.all(getDataQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.get("/samsung", async (req, res) => {
  try {
    const tableName = "samsung";
    const getDataQuery = `
        SELECT
          name,
          image_public_id,
          description,
          new_id,
          price
        FROM
          ${tableName};
      `;

    const data = await db.all(getDataQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/xiaomi", async (req, res) => {
  try {
    const tableName = "xiaomi";
    const getDataQuery = `
        SELECT
          name,
          image_public_id,
          description,
          new_id,
          price
        FROM
          ${tableName};
      `;

    const data = await db.all(getDataQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/oneplus", async (req, res) => {
  try {
    const tableName = "oneplus";
    const getDataQuery = `
        SELECT
          name,
          image_public_id,
          description,
          new_id,
          price
        FROM
          ${tableName};
      `;

    const data = await db.all(getDataQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/google", async (req, res) => {
  try {
    const tableName = "google";
    const getDataQuery = `
        SELECT
          name,
          image_public_id,
          description,
          new_id,
          price
        FROM
          ${tableName};
      `;


    const data = await db.all(getDataQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/motorola", async (req, res) => {
  try {
    const tableName = "motorola";
    const getDataQuery = `
        SELECT
          name,
          image_public_id,
          description,
          new_id,
          price
        FROM
          ${tableName};
      `;

    const data = await db.all(getDataQuery);

    const transformedData = data.map((item) => ({
      name: item.name,
      img: cloudinary.url(item.image_public_id),
      description: item.description,
      new_id: item.new_id,
      price: item.price,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get("/mobiles", async (req, res) => {
//   try {
//     const tableName = "motorola";
//     const getDataQuery = `
//         SELECT
//           name,
//           image_public_id,
//           description,
//           new_id,
//           price
//         FROM
//           ${tableName};
//       `;

//     const data = await db.all(getDataQuery);

//     const transformedData = data.map((item) => ({
//       name: item.name,
//       img: cloudinary.url(item.image_public_id),
//       description: item.description,
//       new_id: item.new_id,
//       price: item.price,
//     }));

//     res.json(transformedData);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// app.listen(3002, () => {
//   console.log("Server Running at https://localhost:3002/");
// });


// app.get("/products", async (req, res) => {
//   try {
//     const getMobilesQuery = `
//       SELECT
//         *
//       FROM
//         mobiles;
//     `;
//     const mobiles = await db.all(getMobilesQuery);
//     res.json(mobiles);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// app.get("/products", async (req, res) => {
//   try {
//     // Fetch deals from GSM Arena
//     const deals = await gsmarena.deals.getDeals();
//     res.json(deals);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/mobiles", async (req, res) => {
//   try {
//     // Fetch deals from GSM Arena
//     const devices = await gsmarena.catalog.getBrand('google-phones-107');
//     res.json(devices);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/brands", async (req, res) => {
//   try {
//     // Fetch deals from GSM Arena
//     const one = await gsmarena.catalog.getBrands();
//     res.json(one);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// app.get("/products/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params; // Extract the productId from the request parameters.
//     console.log(productId)
//     const device = await gsmarena.catalog.getDevice(productId);
//     console.log(device);
//     res.json(device);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// const cachedData = {};

// app.get("/products/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     console.log(productId);

//     if (cachedData[productId]) {
//       // If the data for this productId is already in the cache, return it
//       console.log("Data found in cache.");
//       return res.json(cachedData[productId]);
//     }

//     const device = await gsmarena.catalog.getDevice(productId);
//     console.log(device);

//     // Call initializePhonespecTable to create or update the table
//     await initializePhonespecTable(device);

//     // Cache the data for future use
//     cachedData[productId] = device;

//     res.json(device);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// async function initializePhonespecTable(device) {
//   try {
//     // You can call this function when you want to create or update the table
//     await 
//     createTableAndAddDataForPhonespec([device]); // Wrap the 'device' in an array for consistency with your existing code
//     console.log("Table created and data inserted into the database for phonespec.");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }











// app.get("/new", async (req, res) => {
//   const searchTerm = 'apple iphone 14'; // Replace with the desired term
// try {
//   // const { productId } = req.params; // Extract the productId from the request parameters.
//   //     console.log(productId)
//   const device = await gsmarena.catalog.getDevice('apple_iphone_13_pro_max-11089');
//   console.log(device);
// } catch (error) {
//   console.error('Error:', error);
// }
// });




// Articles routes

// GET /articles - Get all articles
app.get("/articles", async (req, res) => {
  try {
    const getArticlesQuery = `
      SELECT * FROM articles ORDER BY published_date DESC;
    `;
    const articles = await db.all(getArticlesQuery);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /articles/:id - Get a specific article
app.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getArticleQuery = `
      SELECT * FROM articles WHERE id = ?;
    `;
    const article = await db.get(getArticleQuery, id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /articles - Create a new article
app.post("/articles", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const insertArticleQuery = `
      INSERT INTO articles (title, content, author) VALUES (?, ?, ?);
    `;
    const result = await db.run(insertArticleQuery, title, content, author || null);
    res.status(201).json({ id: result.lastID, message: "Article created successfully" });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /articles/:id - Update an article
app.put("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const updateArticleQuery = `
      UPDATE articles SET title = ?, content = ?, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;
    `;
    const result = await db.run(updateArticleQuery, title, content, author || null, id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({ message: "Article updated successfully" });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /articles/:id - Delete an article
app.delete("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteArticleQuery = `
      DELETE FROM articles WHERE id = ?;
    `;
    const result = await db.run(deleteArticleQuery, id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", async (req, res) => {
  try {
    // Fetch deals from GSM Arena
    const deals = await gsmarena.deals.getDeals();
    res.json(deals);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Banking routes
app.get("/credit-cards", async (req, res) => {
  try {
    const getDataQuery = `SELECT * FROM credit_cards ORDER BY annual_fee ASC;`;
    const data = await db.all(getDataQuery);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/savings-accounts", async (req, res) => {
  try {
    const getDataQuery = `SELECT * FROM savings_accounts ORDER BY apy DESC;`;
    const data = await db.all(getDataQuery);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/checking-accounts", async (req, res) => {
  try {
    const getDataQuery = `SELECT * FROM checking_accounts ORDER BY monthly_fee ASC;`;
    const data = await db.all(getDataQuery);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cds", async (req, res) => {
  try {
    const getDataQuery = `SELECT * FROM cds ORDER BY apy DESC;`;
    const data = await db.all(getDataQuery);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Best banking overview
app.get("/banking/best", async (req, res) => {
  try {
    const creditCards = await db.all(`SELECT * FROM credit_cards ORDER BY annual_fee ASC LIMIT 3;`);
    const savingsAccounts = await db.all(`SELECT * FROM savings_accounts ORDER BY apy DESC LIMIT 3;`);
    const checkingAccounts = await db.all(`SELECT * FROM checking_accounts ORDER BY monthly_fee ASC LIMIT 3;`);
    const cds = await db.all(`SELECT * FROM cds ORDER BY apy DESC LIMIT 3;`);

    res.json({
      credit_cards: creditCards,
      savings_accounts: savingsAccounts,
      checking_accounts: checkingAccounts,
      cds: cds
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// AI Tools routes
app.get("/ai-tools", async (req, res) => {
  try {
    const getDataQuery = `SELECT * FROM ai_tools ORDER BY category, rating DESC;`;
    const data = await db.all(getDataQuery);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/ai-tools/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const getDataQuery = `SELECT * FROM ai_tools WHERE category = ? ORDER BY rating DESC;`;
    const data = await db.all(getDataQuery, category);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/ai-tools/best", async (req, res) => {
  try {
    const categories = ['ai_writing', 'ai_image', 'ai_coding', 'ai_chatbots', 'ai_productivity'];
    const result = {};

    for (const category of categories) {
      const tools = await db.all(`SELECT * FROM ai_tools WHERE category = ? ORDER BY rating DESC LIMIT 3;`, category);
      result[category] = tools;
    }

    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Tech Tools Categories API
app.get("/tech-tools/categories", async (req, res) => {
  try {
    const categories = await db.all(`SELECT DISTINCT category FROM ai_tools ORDER BY category;`);
    res.json(categories);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get single tool by ID
app.get("/tech-tools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tool = await db.get(`SELECT * FROM ai_tools WHERE id = ?;`, id);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    res.json(tool);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new tech tool (Admin)
app.post("/tech-tools", async (req, res) => {
  try {
    const { category, name, description, pros, cons, link, image_url, rating, pricing, best_for } = req.body;
    
    if (!category || !name || !description) {
      return res.status(400).json({ error: "Category, name, and description are required" });
    }

    const result = await db.run(
      `INSERT INTO ai_tools (category, name, description, pros, cons, link, image_url, rating, pricing, best_for) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      category, name, description, pros || null, cons || null, link || null, 
      image_url || null, rating || null, pricing || null, best_for || null
    );

    res.status(201).json({ id: result.lastID, message: "Tool created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update tech tool (Admin)
app.put("/tech-tools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, description, pros, cons, link, image_url, rating, pricing, best_for } = req.body;

    const existingTool = await db.get(`SELECT id FROM ai_tools WHERE id = ?;`, id);
    if (!existingTool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    const result = await db.run(
      `UPDATE ai_tools SET 
       category = ?, name = ?, description = ?, pros = ?, cons = ?, 
       link = ?, image_url = ?, rating = ?, pricing = ?, best_for = ?
       WHERE id = ?;`,
      category, name, description, pros || null, cons || null, link || null,
      image_url || null, rating || null, pricing || null, best_for || null, id
    );

    res.json({ message: "Tool updated successfully", changes: result.changes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete tech tool (Admin)
app.delete("/tech-tools/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingTool = await db.get(`SELECT id FROM ai_tools WHERE id = ?;`, id);
    if (!existingTool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    const result = await db.run(`DELETE FROM ai_tools WHERE id = ?;`, id);
    res.json({ message: "Tool deleted successfully", changes: result.changes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Compare tools by IDs
app.post("/tech-tools/compare", async (req, res) => {
  try {
    const { toolIds } = req.body;
    
    if (!toolIds || !Array.isArray(toolIds) || toolIds.length === 0) {
      return res.status(400).json({ error: "Tool IDs array is required" });
    }

    const placeholders = toolIds.map(() => '?').join(',');
    const tools = await db.all(`SELECT * FROM ai_tools WHERE id IN (${placeholders}) ORDER BY rating DESC;`, ...toolIds);
    
    res.json(tools);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search tools
app.get("/tech-tools/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const searchQuery = `%${query}%`;
    
    const tools = await db.all(
      `SELECT * FROM ai_tools 
       WHERE name LIKE ? OR description LIKE ? OR category LIKE ? OR best_for LIKE ?
       ORDER BY rating DESC;`,
      searchQuery, searchQuery, searchQuery, searchQuery
    );
    
    res.json(tools);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// const fetchDeviceDetails = async (id) => {
//   try {
//     const response = await axios.get(`/products/${id}`); // Adjust the URL as needed
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching device details:', error);
//     throw error;
//   }
// };





// // Import the gsmarena-scraper library
// const gsmarena = require('gsmarena-scraper');

// app.get('/catalog/:brand', async (req, res) => {
//   const { brand } = req.params;
//   try {
//     // Fetch mobile phones for the specified brand using the gsmarena.catalog library
//     const devices = await gsmarena.catalog.getBrand(brand);

//     // Check if the result is empty or null
//     if (!devices || devices.length === 0) {
//       res.status(404).json({ error: 'No data found for the specified brand' });
//     } else {
//       res.json(devices);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// Define an API route to get a list of all mobile phone brands
// app.get('/catelog', async (req, res) => {
//   try {
//     // Fetch all mobile phone brands using the gsmarena.catalog library
//     const brands = await gsmarena.catalog.getBrands();
//     res.json(brands);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

