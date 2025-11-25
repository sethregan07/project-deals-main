const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "mydatabase2.db");

const initializeArticlesDB = async () => {
  let db = null;

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

    // Clear existing data and reinsert with new schema
    await db.exec(`DELETE FROM articles;`);
      const sampleArticles = [
        {
          title: "The Future of Mobile Technology",
          content: "Mobile technology continues to evolve at a rapid pace. From 5G networks to foldable screens, the smartphone industry is pushing boundaries. In this article, we explore the latest trends and what they mean for consumers and developers alike. The integration of AI and machine learning is transforming how we interact with our devices, making them smarter and more intuitive. As we look ahead, innovations like augmented reality and advanced biometric security will redefine the mobile experience.",
          author: "Tech Analyst",
          image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
          category: "Technology"
        },
        {
          title: "Best Deals on Smartphones in 2024",
          content: "Finding the best smartphone deals can save you hundreds of dollars. This comprehensive guide covers current promotions from major retailers, seasonal sales, and tips for getting the most value for your money. We analyze pricing trends across different brands and help you identify the sweet spots for purchasing. Whether you're looking for flagship devices or budget-friendly options, timing your purchase correctly can make a significant difference in your overall cost.",
          author: "Deals Expert",
          image_url: "https://images.unsplash.com/photo-1580894742597-87d793ddaf26?w=800&q=80",
          category: "Deals"
        },
        {
          title: "How to Choose the Right Smartphone",
          content: "With so many options available, choosing the right smartphone can be overwhelming. Consider factors like battery life, camera quality, processing power, and your budget. This guide helps you make an informed decision by breaking down the key specifications and their real-world impact. We also discuss the importance of software updates, ecosystem compatibility, and long-term support from manufacturers. Making the right choice ensures your device will serve you well for years to come.",
          author: "Product Reviewer",
          image_url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
          category: "Tutorial"
        },
        {
          title: "Sustainable Technology: Eco-Friendly Gadgets",
          content: "The tech industry is increasingly focusing on sustainability. From recycled materials to energy-efficient designs, manufacturers are working to reduce their environmental impact. This article explores the latest developments in green technology and how consumers can make more environmentally conscious choices. We examine the lifecycle of electronic devices and discuss initiatives aimed at reducing e-waste and promoting circular economy principles in the tech sector.",
          author: "Environmental Tech Writer",
          image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
          category: "Technology"
        },
        {
          title: "Mobile Photography Tips and Tricks",
          content: "Modern smartphones have incredible camera capabilities. Learn how to take professional-quality photos with your mobile device through expert tips and techniques. We cover composition, lighting, editing apps, and advanced features like night mode and computational photography. Whether you're a beginner or experienced photographer, these insights will help you capture stunning images with your smartphone.",
          author: "Photography Expert",
          image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
          category: "Tutorial"
        },
        {
          title: "Gaming Consoles: Past, Present, and Future",
          content: "The evolution of gaming consoles has been remarkable. From the early days of Pong to today's powerful machines capable of photorealistic graphics, we've seen incredible technological advancements. This article traces the history of gaming hardware and looks ahead to emerging technologies like cloud gaming and VR integration. We discuss how console manufacturers are adapting to changing consumer preferences and the rise of mobile gaming.",
          author: "Gaming Historian",
          image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
          category: "Gaming"
        },
        {
          title: "The Rise of Wearable Technology",
          content: "Wearable devices have become an integral part of our daily lives. From fitness trackers to smartwatches, these gadgets are constantly monitoring our health and habits. This comprehensive guide explores the current state of wearable technology, emerging trends, and what the future holds. We examine the impact on healthcare, productivity, and personal wellness, while discussing privacy concerns and data security implications.",
          author: "Wearables Specialist",
          image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
          category: "Technology"
        },
        {
          title: "Building a Home Smart Home System",
          content: "Creating a smart home doesn't have to be complicated or expensive. This step-by-step guide walks you through setting up a basic smart home system, from choosing the right devices to integrating them seamlessly. We cover popular platforms like Google Home, Amazon Alexa, and Apple HomeKit, and provide tips for maximizing compatibility and minimizing frustration. Whether you're a tech novice or enthusiast, this guide will help you automate your home effectively.",
          author: "Smart Home Expert",
          image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          category: "Tutorial"
        },
        {
          title: "Cybersecurity in the Age of IoT",
          content: "As more devices connect to the internet, cybersecurity becomes increasingly critical. This article explores the unique security challenges posed by IoT devices and provides practical advice for protecting your connected home or office. We discuss common vulnerabilities, best practices for secure configuration, and the importance of regular updates. Understanding these risks is the first step toward building a more secure digital ecosystem.",
          author: "Security Analyst",
          image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
          category: "Security"
        },
        {
          title: "The Impact of 5G on Mobile Applications",
          content: "The rollout of 5G networks is transforming mobile applications in profound ways. Faster speeds, lower latency, and increased bandwidth are enabling new types of apps and services. This article examines how developers are leveraging 5G capabilities to create more immersive and responsive experiences. We look at industries like gaming, healthcare, and autonomous vehicles, and discuss the challenges of developing for this new connectivity paradigm.",
          author: "Mobile Developer",
          image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
          category: "Development"
        },
        {
          title: "Sustainable Tech: Reducing E-Waste",
          content: "Electronic waste is a growing environmental concern. This article explores innovative approaches to reducing e-waste through better design, repairability, and recycling programs. We highlight companies leading the charge in sustainable technology and discuss consumer choices that can minimize environmental impact. From modular smartphones to take-back programs, there are many ways to extend the life of our electronic devices and reduce our ecological footprint.",
          author: "Environmental Engineer",
          image_url: "https://images.unsplash.com/photo-1532996122724-e3bc053efa83?w=800&q=80",
          category: "Environment"
        },
        {
          title: "AI and Machine Learning in Everyday Apps",
          content: "Artificial intelligence is no longer just for research labs—it's powering features in apps we use every day. This article demystifies AI and ML, explaining how they're being used in everything from photo editing to language translation. We discuss the benefits, limitations, and ethical considerations of integrating AI into consumer applications. Understanding these technologies helps users make informed decisions about the tools they choose.",
          author: "AI Researcher",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
          category: "AI"
        },
        {
          title: "The Future of Remote Work Technology",
          content: "Remote work is here to stay, and technology is evolving to support it. This comprehensive guide explores the tools and platforms that enable effective remote collaboration. From video conferencing to project management software, we cover the essential technologies for distributed teams. We also discuss emerging trends like virtual offices and the importance of work-life balance in a remote-first world.",
          author: "Remote Work Consultant",
          image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
          category: "Productivity"
        },
        {
          title: "Blockchain Beyond Cryptocurrency",
          content: "While blockchain is famous for powering cryptocurrencies, its potential applications extend far beyond digital money. This article explores how blockchain technology is being used in supply chain management, voting systems, and digital identity verification. We discuss the benefits of decentralization and immutability, while addressing scalability challenges and regulatory considerations. Understanding blockchain's broader applications is key to appreciating its transformative potential.",
          author: "Blockchain Developer",
          image_url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
          category: "Blockchain"
        },
        {
          title: "Quantum Computing: The Next Frontier",
          content: "Quantum computing promises to revolutionize computation by solving problems that are currently intractable. This article explains the basics of quantum mechanics as they apply to computing, and explores current developments in the field. We discuss potential applications in drug discovery, materials science, and cryptography, while addressing the challenges of building stable quantum systems. The race to achieve quantum supremacy is heating up, with implications for security and scientific research.",
          author: "Quantum Physicist",
          image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
          category: "Science"
        },
        {
          title: "The Evolution of Social Media Platforms",
          content: "Social media has transformed how we communicate and consume information. This historical overview traces the development of major platforms from early forums to today's algorithm-driven networks. We examine the impact on society, business, and politics, while discussing current trends like short-form video and decentralized social networks. Understanding this evolution helps us navigate the complex landscape of online social interaction.",
          author: "Social Media Analyst",
          image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
          category: "Social Media"
        },
        {
          title: "Augmented Reality in Education",
          content: "Augmented reality is opening new possibilities for education. This article explores how AR technology is being integrated into classrooms to create more engaging and effective learning experiences. We look at successful implementations, from interactive textbooks to virtual field trips, and discuss the challenges of adoption. AR has the potential to make education more accessible and personalized for students worldwide.",
          author: "Education Technologist",
          image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
          category: "Education"
        },
        {
          title: "The Future of Electric Vehicles",
          content: "Electric vehicles are reshaping the automotive industry. This comprehensive guide covers current EV technology, charging infrastructure, and market trends. We analyze the environmental benefits, economic considerations, and technological challenges facing widespread EV adoption. From battery technology to autonomous driving integration, EVs represent a significant shift in transportation that will impact energy, economy, and urban planning.",
          author: "Automotive Engineer",
          image_url: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&q=80",
          category: "Automotive"
        },
        {
          title: "Cloud Computing: Scaling Applications",
          content: "Cloud computing has become essential for modern application development. This guide covers the major cloud platforms, deployment strategies, and best practices for scalability. We discuss serverless architecture, containerization, and the benefits of cloud-native development. Understanding cloud computing is crucial for developers building applications that can handle millions of users and scale dynamically.",
          author: "Cloud Architect",
          image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
          category: "Cloud"
        },
        {
          title: "The Rise of Voice Assistants",
          content: "Voice technology is becoming ubiquitous in our daily lives. This article explores the evolution of voice assistants from simple command responders to sophisticated AI companions. We examine the technology behind speech recognition and natural language processing, and discuss privacy implications. From smart speakers to voice-enabled applications, understanding this technology is key to designing the next generation of human-computer interaction.",
          author: "Voice Tech Specialist",
          image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
          category: "AI"
        },
        {
          title: "Sustainable Software Development",
          content: "The environmental impact of software is often overlooked. This article discusses how developers can reduce the carbon footprint of their applications through efficient coding practices, optimized algorithms, and mindful resource usage. We explore the concept of green software engineering and provide practical tips for building more sustainable digital products. As the tech industry grows, so does its responsibility to minimize environmental impact.",
          author: "Green Developer",
          image_url: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&q=80",
          category: "Sustainability"
        },
        {
          title: "The Future of Web Development",
          content: "Web development continues to evolve rapidly. This comprehensive overview covers emerging technologies like WebAssembly, progressive web apps, and new JavaScript frameworks. We discuss the shift toward component-based architecture and the importance of performance optimization. Understanding these trends is essential for developers looking to stay ahead in the ever-changing landscape of web technology.",
          author: "Web Developer",
          image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
          category: "Web Development"
        },
        {
          title: "Data Privacy in the Digital Age",
          content: "As data becomes the new oil, privacy concerns are paramount. This article examines current data protection regulations, emerging privacy technologies, and best practices for handling user data responsibly. We discuss encryption, anonymization techniques, and the balance between personalization and privacy. In an era of increasing surveillance, understanding data privacy is crucial for both consumers and businesses.",
          author: "Privacy Expert",
          image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
          category: "Privacy"
        },
        {
          title: "The Internet of Things Revolution",
          content: "IoT devices are connecting our physical world to the digital realm. This article explores the current state of IoT technology, from smart homes to industrial applications. We discuss connectivity standards, security challenges, and the potential for IoT to transform industries. As billions of devices come online, understanding IoT is essential for navigating our increasingly connected world.",
          author: "IoT Engineer",
          image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
          category: "IoT"
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

      console.log("Sample articles inserted successfully.");

  } catch (error) {
    console.error("Error initializing articles database:", error);
  } finally {
    if (db) {
      await db.close();
    }
  }
};

// Run the initialization
initializeArticlesDB();