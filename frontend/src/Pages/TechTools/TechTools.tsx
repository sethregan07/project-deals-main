import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface TechTool {
  id: number;
  category: string;
  name: string;
  description: string;
  pros: string;
  cons: string;
  link: string;
  image_url: string;
  rating: number;
  pricing: string;
  best_for: string;
}

interface CategoryData {
  [category: string]: TechTool[];
}

const TechTools: React.FC = () => {
  const [toolsData, setToolsData] = useState<CategoryData>({});
  const [allTools, setAllTools] = useState<TechTool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBestTools();
    fetchCategories();
  }, []);

  const fetchBestTools = async () => {
    try {
      const response = await axios.get('http://localhost:3002/ai-tools/best');
      setToolsData(response.data);
      
      // Flatten all tools for search functionality
      const allToolsList = Object.values(response.data).flat() as TechTool[];
      setAllTools(allToolsList);
    } catch (error) {
      console.error('Error fetching best tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3002/tech-tools/categories');
      const categoryList = response.data.map((cat: any) => cat.category);
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleToolClick = (id: number) => {
    navigate(`/tech-tool/${id}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/tech-tools/${category}`);
  };

  const handleCompare = () => {
    navigate('/tech-tools/compare');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Best Tech Tools & Software</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', height: '100%' }}>
              <div style={{ height: '200px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div style={{ height: '60px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div style={{ height: '20px', width: '60%', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1a1a1a' }}>
          Best Tech Tools & Software
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Expert reviews and comparisons of the best technology tools for developers, designers, and businesses
        </p>
      </div>

      {/* Search and Filter Section */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e1e5e9', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryName(cat)}
              </option>
            ))}
          </select>
          <button
            onClick={handleCompare}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Compare Tools
          </button>
        </div>
      </div>

      {/* Category Sections */}
      {searchQuery || selectedCategory ? (
        // Show filtered results
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1a1a1a' }}>
            {searchQuery && `Search Results for "${searchQuery}"`}
            {selectedCategory && !searchQuery && `${formatCategoryName(selectedCategory)} Tools`}
            {searchQuery && selectedCategory && ` - ${formatCategoryName(selectedCategory)}`}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredTools.map((tool) => (
              <div key={tool.id} style={{ border: '1px solid #e1e5e9', borderRadius: '12px', padding: '1.5rem', height: '100%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={() => handleToolClick(tool.id)}>
                {tool.image_url && (
                  <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>{tool.name}</h3>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: '16px', fontSize: '0.875rem', fontWeight: '500' }}>
                      {formatCategoryName(tool.category)}
                    </span>
                  </div>
                </div>
                <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>{tool.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    Rating: {tool.rating ? `${tool.rating}/5` : 'Not rated'}
                  </span>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    {tool.pricing || 'Pricing not available'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Best for: {tool.best_for}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {filteredTools.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '3rem 0', fontSize: '1.1rem' }}>
              No tools found matching your criteria.
            </p>
          )}
        </div>
      ) : (
        // Show category sections
        Object.entries(toolsData).map(([category, tools]) => (
          <div key={category} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1a1a1a' }}>{formatCategoryName(category)}</h2>
              <button 
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#1976d2',
                  border: '1px solid #1976d2',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
                onClick={() => handleCategoryClick(category)}
              >
                View All {formatCategoryName(category)} Tools
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {tools.map((tool) => (
                <div key={tool.id} style={{ border: '1px solid #e1e5e9', borderRadius: '12px', padding: '1.5rem', height: '100%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={() => handleToolClick(tool.id)}>
                  {tool.image_url && (
                    <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>{tool.name}</h3>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: '16px', fontSize: '0.875rem', fontWeight: '500' }}>
                        {formatCategoryName(tool.category)}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>{tool.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      Rating: {tool.rating ? `${tool.rating}/5` : 'Not rated'}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      {tool.pricing || 'Pricing not available'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Best for: {tool.best_for}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TechTools;
