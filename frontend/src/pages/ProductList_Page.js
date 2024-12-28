import React from 'react';
import { Link } from "react-router-dom";
import iconCart from '../assets/icon.png';
import { toast } from 'react-toastify';

// Utility function to convert string to kebab-case
const toKebabCase = (str) => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with dashes
    .replace(/[^\w-]+/g, '');  // Remove non-alphanumeric characters (except dashes)
};

class ProductList_Page extends React.Component {
  render() {
    const { products, categoryName, handleProductBoxClick, selectedCurrency } = this.props;
    const capitalizeFirstLetter = (str) => {
      if (str.length === 0) return str; // If the string is empty, return it as is
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    
    return (
      <div className="category-page">
        <div className='category-name-container'>
        <h2 className='category-name'>{categoryName ? `${capitalizeFirstLetter(categoryName)}` : 'All'}</h2>

        </div>
        <div className="products-container">
        <div className="products-wrapper">
  {products.map(product => (
    <div
      className="product-box"
      key={product.id}
      data-testid={`product-${toKebabCase(product.name)}`}
    >
  <Link to={`/product/${product.id}?categoryName=${categoryName}`} style={{ textDecoration: 'none', color: 'inherit' }}> 
     <img
          className={`product-image ${!product.in_stock ? 'greyed-out' : ''}`}
          src={JSON.parse(product.image)[0]}
          alt={product.name}
        />
        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <div className={`product-price ${!product.in_stock ? 'price-out-of-stock' : ''}`}>
            {selectedCurrency.symbol}{product.convertedPrice}
          </div>
        </div>
      </Link>
      {!product.in_stock && (
        <div className="out-of-stock">OUT OF STOCK</div>
      )}
      <img
        className="icon-image"
        src={iconCart}
        alt="Quick Shop"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the link click
          handleProductBoxClick(product); // Handle quick add to cart
        }}
      />
    </div>
  ))}
</div>


        </div>
      </div>
    );
  }
}

export default ProductList_Page;
