import { supabase } from './supabaseClient.js';

const sampleArticles = [
  {
    id: 1,
    title: "The Future of AI in Technology",
    content: "Artificial Intelligence is revolutionizing the way we live and work. From machine learning algorithms to neural networks, AI is becoming an integral part of our daily lives. This comprehensive article explores the latest developments in AI technology and their potential impact on various industries.",
    author: "John Doe",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    category: "Technology",
    published_date: "2024-11-30T10:00:00Z",
    created_at: "2024-11-30T10:00:00Z",
    updated_at: "2024-11-30T10:00:00Z",
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions for 2024",
    content: "As the world moves towards renewable energy sources, innovative solutions are emerging to combat climate change. Solar, wind, and hydroelectric power are leading the charge in creating a sustainable future.",
    author: "Jane Smith",
    image_url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
    category: "Environment",
    published_date: "2024-11-29T14:30:00Z",
    created_at: "2024-11-29T14:30:00Z",
    updated_at: "2024-11-29T14:30:00Z",
  },
  {
    id: 3,
    title: "The Rise of Remote Work Culture",
    content: "The pandemic accelerated the adoption of remote work, and now companies are embracing flexible work arrangements. This article discusses the benefits, challenges, and best practices for successful remote work implementation.",
    author: "Mike Johnson",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    category: "Business",
    published_date: "2024-11-28T09:15:00Z",
    created_at: "2024-11-28T09:15:00Z",
    updated_at: "2024-11-28T09:15:00Z",
  },
  {
    id: 4,
    title: "Advancements in Quantum Computing",
    content: "Quantum computing represents the next frontier in computational power. This article delves into recent breakthroughs and their potential applications in cryptography, drug discovery, and complex problem-solving.",
    author: "Sarah Wilson",
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    category: "Science",
    published_date: "2024-11-27T16:45:00Z",
    created_at: "2024-11-27T16:45:00Z",
    updated_at: "2024-11-27T16:45:00Z",
  },
  {
    id: 5,
    title: "The Impact of 5G Technology",
    content: "5G networks are transforming connectivity and enabling new technologies. From IoT devices to autonomous vehicles, 5G is paving the way for innovations that were previously impossible.",
    author: "David Brown",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    category: "Technology",
    published_date: "2024-11-26T11:20:00Z",
    created_at: "2024-11-26T11:20:00Z",
    updated_at: "2024-11-26T11:20:00Z",
  },
];

const sampleCategories = [
  { category: "Technology", count: 5 },
  { category: "Science", count: 3 },
  { category: "Business", count: 2 },
  { category: "Environment", count: 2 },
  { category: "Health", count: 1 },
];

async function insertSampleData() {
  try {
    console.log('Inserting sample articles...');
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .insert(sampleArticles)
      .select();

    if (articlesError) {
      console.error('Error inserting articles:', articlesError);
    } else {
      console.log('Articles inserted successfully:', articlesData);
    }

    console.log('Inserting sample categories...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(sampleCategories)
      .select();

    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
    } else {
      console.log('Categories inserted successfully:', categoriesData);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the insertion
insertSampleData();
