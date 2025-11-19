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
        published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if table is empty
    const articleCount = await db.get(`SELECT COUNT(*) as count FROM articles;`);

    if (articleCount.count === 0) {
      const sampleArticles = [
        {
          title: "The Future of Mobile Technology",
          content: "Mobile technology continues to evolve at a rapid pace. From 5G networks to foldable screens, the smartphone industry is pushing boundaries. In this article, we explore the latest trends and what they mean for consumers and developers alike. The integration of AI and machine learning is transforming how we interact with our devices, making them smarter and more intuitive. As we look ahead, innovations like augmented reality and advanced biometric security will redefine the mobile experience.",
          author: "Tech Analyst"
        },
        {
          title: "Best Deals on Smartphones in 2024",
          content: "Finding the best smartphone deals can save you hundreds of dollars. This comprehensive guide covers current promotions from major retailers, seasonal sales, and tips for getting the most value for your money. We analyze pricing trends across different brands and help you identify the sweet spots for purchasing. Whether you're looking for flagship devices or budget-friendly options, timing your purchase correctly can make a significant difference in your overall cost.",
          author: "Deals Expert"
        },
        {
          title: "How to Choose the Right Smartphone",
          content: "With so many options available, choosing the right smartphone can be overwhelming. Consider factors like battery life, camera quality, processing power, and your budget. This guide helps you make an informed decision by breaking down the key specifications and their real-world impact. We also discuss the importance of software updates, ecosystem compatibility, and long-term support from manufacturers. Making the right choice ensures your device will serve you well for years to come.",
          author: "Product Reviewer"
        },
        {
          title: "Sustainable Technology: Eco-Friendly Gadgets",
          content: "The tech industry is increasingly focusing on sustainability. From recycled materials to energy-efficient designs, manufacturers are working to reduce their environmental impact. This article explores the latest developments in green technology and how consumers can make more environmentally conscious choices. We examine the lifecycle of electronic devices and discuss initiatives aimed at reducing e-waste and promoting circular economy principles in the tech sector.",
          author: "Environmental Tech Writer"
        },
        {
          title: "Mobile Photography Tips and Tricks",
          content: "Modern smartphones have incredible camera capabilities. Learn how to take professional-quality photos with your mobile device through expert tips and techniques. We cover composition, lighting, editing apps, and advanced features like night mode and computational photography. Whether you're a beginner or experienced photographer, these insights will help you capture stunning images with your smartphone.",
          author: "Photography Expert"
        }
      ];

      for (const article of sampleArticles) {
        await db.run(
          `INSERT INTO articles (title, content, author) VALUES (?, ?, ?)`,
          article.title,
          article.content,
          article.author
        );
      }

      console.log("Sample articles inserted successfully.");
    } else {
      console.log("Articles table already contains data.");
    }

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