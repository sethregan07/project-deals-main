import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const TechToolsCompare: React.FC = () => {
  const [allTools, setAllTools] = useState<TechTool[]>([]);
  const [selectedTools, setSelectedTools] = useState<TechTool[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchAllTools();
    
    // Check if a tool was passed from detail page
    if (location.state?.selectedToolId) {
      fetchToolForComparison(location.state.selectedToolId);
    }
  }, [location.state]);

  const fetchAllTools = async () => {
    try {
      const response = await axios.get('http://localhost:3002/ai-tools/all');
      setAllTools(response.data);
    } catch (error) {
      console.error('Error fetching all tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchToolForComparison = async (toolId: number) => {
    try {
      const response = await axios.get(`http://localhost:3002/tech-tools/${toolId}`);
      setSelectedTools([response.data]);
    } catch (error) {
      console.error('Error fetching tool for comparison:', error);
    }
  };

  const handleToolSelect = (tool: TechTool) => {
    if (selectedTools.length < 3) {
      if (!selectedTools.find(t => t.id === tool.id)) {
        setSelectedTools([...selectedTools, tool]);
      }
    }
  };

  const handleRemoveTool = (toolId: number) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  const handleCompare = async () => {
    if (selectedTools.length >= 2) {
      try {
        const toolIds = selectedTools.map(t => t.id);
        const response = await axios.post('http://localhost:3002/tech-tools/compare', { toolIds });
        // The response should be the same as selectedTools but ordered by rating
        setSelectedTools(response.data);
      } catch (error) {
        console.error('Error comparing tools:', error);
      }
    }
  };

  const handleClearAll = () => {
    setSelectedTools([]);
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Loading comparison tools...</h1>
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
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Compare Tech Tools
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Select up to 3 tools to compare their features, pricing, and specifications
        </p>
      </div>

      {/* Selected Tools Section */}
      {selectedTools.length > 0 && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Selected Tools ({selectedTools.length}/3)</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {selectedTools.length >= 2 && (
                <button
                  onClick={handleCompare}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Compare Now
                </button>
              )}
              <button
                onClick={handleClearAll}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {selectedTools.map((tool) => (
              <div
                key={tool.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid #e1e5e9'
                }}
              >
                <span>{tool.name}</span>
                <button
                  onClick={() => handleRemoveTool(tool.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {selectedTools.length >= 2 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a1a' }}>
            Comparison Results
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e1e5e9', fontWeight: '600' }}>Feature</th>
                  {selectedTools.map((tool) => (
                    <th key={tool.id} style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e1e5e9', fontWeight: '600', minWidth: '200px' }}>
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9', fontWeight: '500' }}>Category</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
                      {formatCategoryName(tool.category)}
                    </td>
                  ))}
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9', fontWeight: '500' }}>Rating</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
                      {tool.rating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#ffa500' }}>★</span>
                          <span>{tool.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9', fontWeight: '500' }}>Pricing</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
                      {tool.pricing || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9', fontWeight: '500' }}>Best For</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
                      {tool.best_for || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9', fontWeight: '500' }}>Description</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
                      {tool.description.length > 100 ? 
                        `${tool.description.substring(0, 100)}...` : 
                        tool.description
                      }
                    </td>
                  ))}
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9', fontWeight: '500' }}>Pros</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
                      {tool.pros ? (
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                          {tool.pros.split('\n').slice(0, 2).map((pro, index) => (
                            <div key={index} style={{ marginBottom: '0.25rem' }}>
                              ✓ {pro.trim()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9', fontWeight: '500' }}>Cons</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} style={{ padding: '1rem', borderBottom: '1px solid #e1e5e9' }}>
                      {tool.cons ? (
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                          {tool.cons.split('\n').slice(0, 2).map((con, index) => (
                            <div key={index} style={{ marginBottom: '0.25rem' }}>
                              ✗ {con.trim()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Tools Selection */}
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a1a' }}>
          All Tools
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {allTools.map((tool) => {
            const isSelected = selectedTools.find(t => t.id === tool.id);
            const canSelect = selectedTools.length < 3 && !isSelected;
            
            return (
              <div
                key={tool.id}
                style={{
                  border: isSelected ? '2px solid #1976d2' : '1px solid #e1e5e9',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: canSelect ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  backgroundColor: isSelected ? '#f3f8ff' : '#fff',
                  opacity: canSelect || isSelected ? 1 : 0.6
                }}
                onClick={() => canSelect && handleToolSelect(tool)}
                onMouseOver={(e) => {
                  if (canSelect) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  if (canSelect) e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1a1a1a' }}>
                    {tool.name}
                  </h3>
                  {isSelected && (
                    <span style={{ color: '#1976d2', fontSize: '1.2rem' }}>✓</span>
                  )}
                </div>
                
                <span style={{ 
                  backgroundColor: '#e3f2fd', 
                  color: '#1976d2', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '16px', 
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>
                  {formatCategoryName(tool.category)}
                </span>

                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {tool.description.length > 100 ? 
                    `${tool.description.substring(0, 100)}...` : 
                    tool.description
                  }
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {tool.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ color: '#ffa500' }}>★</span>
                      <span style={{ fontSize: '0.9rem' }}>{tool.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {tool.pricing && (
                    <span style={{ color: '#4caf50', fontSize: '0.8rem', fontWeight: '500' }}>
                      {tool.pricing}
                    </span>
                  )}
                </div>

                {canSelect && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#1976d2', fontWeight: '500' }}>
                    Click to add to comparison
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechToolsCompare;
