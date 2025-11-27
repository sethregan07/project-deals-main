import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const TechToolsCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [tools, setTools] = useState<TechTool[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      fetchCategoryTools(category);
    }
  }, [category]);

  const fetchCategoryTools = async (categoryName: string) => {
    try {
      const response = await axios.get(`http://localhost:3002/ai-tools/category/${categoryName}`);
      setTools(response.data);
    } catch (error) {
      console.error('Error fetching category tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleToolClick = (id: number) => {
    navigate(`/tech-tool/${id}`);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Loading {formatCategoryName(category || '')} Tools...</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ height: '200px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div style={{ height: '60px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Best {formatCategoryName(category || '')} Tools
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Expert reviews and comparisons of the top {formatCategoryName(category || '').toLowerCase()} tools
        </p>
      </div>

      {tools.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#666' }}>No tools found in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              style={{ 
                border: '1px solid #e1e5e9', 
                borderRadius: '12px', 
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                backgroundColor: '#fff'
              }}
              onClick={() => handleToolClick(tool.id)}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {tool.image_url && (
                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
                  <img 
                    src={tool.image_url} 
                    alt={tool.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#1a1a1a' }}>
                  {tool.name}
                </h3>
                <span style={{ 
                  backgroundColor: '#e3f2fd', 
                  color: '#1976d2', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '16px', 
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {formatCategoryName(tool.category)}
                </span>
              </div>

              <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.5' }}>
                {tool.description.length > 150 ? 
                  `${tool.description.substring(0, 150)}...` : 
                  tool.description
                }
              </p>

              {tool.rating && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#ffa500' }}>★</span>
                    <span style={{ fontWeight: '500' }}>{tool.rating.toFixed(1)}</span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Rating</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                {tool.pricing && (
                  <span style={{ color: '#4caf50', fontWeight: '500', fontSize: '0.9rem' }}>
                    {tool.pricing}
                  </span>
                )}
                {tool.best_for && (
                  <span style={{ color: '#666', fontSize: '0.8rem', textAlign: 'right' }}>
                    Best for: {tool.best_for}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechToolsCategory;
