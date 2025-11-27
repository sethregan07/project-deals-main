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

const TechToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<TechTool | null>(null);
  const [relatedTools, setRelatedTools] = useState<TechTool[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchToolDetails(parseInt(id));
    }
  }, [id]);

  const fetchToolDetails = async (toolId: number) => {
    try {
      // Fetch the specific tool
      const toolResponse = await axios.get(`http://localhost:3002/tech-tools/${toolId}`);
      setTool(toolResponse.data);

      // Fetch related tools from the same category
      if (toolResponse.data.category) {
        const relatedResponse = await axios.get(`http://localhost:3002/ai-tools/category/${toolResponse.data.category}`);
        setRelatedTools(relatedResponse.data.filter((t: TechTool) => t.id !== toolId).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching tool details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleRelatedToolClick = (toolId: number) => {
    navigate(`/tech-tool/${toolId}`);
  };

  const handleCompareClick = () => {
    navigate('/tech-tools/compare', { state: { selectedToolId: tool?.id } });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ height: '200px', backgroundColor: '#f0f0f0', borderRadius: '8px', marginBottom: '2rem' }} />
        <div style={{ height: '40px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '0.5rem', width: '60%' }} />
        <div style={{ height: '100px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ height: '150px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
          <div style={{ height: '150px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1>Tool not found</h1>
        <p>The tool you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/tech-tools')} style={{ padding: '0.5rem 1rem', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Back to Tools
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem', alignItems: 'center' }}>
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              marginRight: '1rem'
            }}>
              {formatCategoryName(tool.category)}
            </span>
            {tool.rating && (
              <span style={{ color: '#ffa500', fontWeight: '500' }}>
                ★ {tool.rating.toFixed(1)}
              </span>
            )}
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
            {tool.name}
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {tool.description}
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            {tool.pricing && (
              <span style={{ color: '#4caf50', fontWeight: '600', fontSize: '1.1rem' }}>
                {tool.pricing}
              </span>
            )}
            {tool.best_for && (
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                Best for: {tool.best_for}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {tool.link && (
              <a 
                href={tool.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  display: 'inline-block'
                }}
              >
                Visit Website
              </a>
            )}
            <button 
              onClick={handleCompareClick}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: 'white', 
                color: '#1976d2', 
                border: '2px solid #1976d2',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Compare
            </button>
          </div>
        </div>

        {tool.image_url && (
          <div style={{ height: '400px', overflow: 'hidden', borderRadius: '12px' }}>
            <img 
              src={tool.image_url} 
              alt={tool.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* Pros and Cons Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {tool.pros && (
          <div style={{ backgroundColor: '#f8fff8', padding: '1.5rem', borderRadius: '12px', border: '1px solid #4caf50' }}>
            <h3 style={{ color: '#4caf50', marginBottom: '1rem', fontSize: '1.3rem' }}>Pros</h3>
            <div style={{ color: '#333', lineHeight: '1.6' }}>
              {tool.pros.split('\n').map((pro, index) => (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  ✓ {pro.trim()}
                </div>
              ))}
            </div>
          </div>
        )}

        {tool.cons && (
          <div style={{ backgroundColor: '#fff8f8', padding: '1.5rem', borderRadius: '12px', border: '1px solid #f44336' }}>
            <h3 style={{ color: '#f44336', marginBottom: '1rem', fontSize: '1.3rem' }}>Cons</h3>
            <div style={{ color: '#333', lineHeight: '1.6' }}>
              {tool.cons.split('\n').map((con, index) => (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  ✗ {con.trim()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a1a' }}>
            Related {formatCategoryName(tool.category)} Tools
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {relatedTools.map((relatedTool) => (
              <div 
                key={relatedTool.id}
                style={{ 
                  border: '1px solid #e1e5e9', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  backgroundColor: '#fff'
                }}
                onClick={() => handleRelatedToolClick(relatedTool.id)}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                {relatedTool.image_url && (
                  <div style={{ height: '150px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
                    <img 
                      src={relatedTool.image_url} 
                      alt={relatedTool.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1a1a1a' }}>
                  {relatedTool.name}
                </h4>
                
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {relatedTool.description.length > 100 ? 
                    `${relatedTool.description.substring(0, 100)}...` : 
                    relatedTool.description
                  }
                </p>

                {relatedTool.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#ffa500' }}>★</span>
                    <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{relatedTool.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechToolDetail;
