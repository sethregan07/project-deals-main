import React, { useState, useEffect } from 'react';

// Sample product data
const products = [
  { id: 1, name: 'Product 1', category: 'Category 1', price: 20 },
  { id: 2, name: 'Product 2', category: 'Category 2', price: 30 },
  { id: 3, name: 'Product 3', category: 'Category 1', price: 25 },
  // Add more products here
];

function CatelogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  // Simulate fetching product data from an API
  useEffect(() => {
    // In a real application, you would make an API request here
    setTimeout(() => {
      setFilteredProducts(products);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle category filter changes
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category === category);
      setFilteredProducts(filtered);
    }
    setSelectedCategory(category);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '700', marginBottom: '1.25rem' }}>
        Product Catalog
      </h1>
      <div style={{ backgroundColor: '#fff', border: '1px solid #e1e5e9', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.875rem', marginRight: '0.625rem' }}>
            Filter by Category:
          </label>
          <select 
            id="category" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          >
            <option value="All">All</option>
            <option value="Category1">Category 1</option>
            <option value="Category2">Category 2</option>
            {/* Add more category options */}
          </select>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #3498db', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={{ backgroundColor: '#fff', border: '1px solid #e1e5e9', borderRadius: '8px', padding: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.3125rem' }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: '0.875rem', marginTop: '0.3125rem' }}>
                  Category: {product.category}
                </p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.3125rem' }}>
                  Price: ${product.price}
                </p>
                {/* You can add more product details here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatelogPage;
