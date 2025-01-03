import React, { Component } from 'react';

class PDP_Page extends Component {
  render() {
    const {
      product,
      images,
      selectedImageIndex,
      handlePrevImage,
      handleNextImage,
      handleAddToCartClick,
      renderAttributes,
      handleImageClick,
      isAddToCartDisabled = false,
      convertedPrice,
      currencySymbol,
    } = this.props;

    if (!product) {
      return <p>No product data available.</p>;
    }

    return (
      <div className="product-detail" data-testid="product-detail">
        <div className="product-images-container" data-testid="product-gallery">
          <div className="thumbnail-container">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={product.name}
                className={`thumbnail ${index === selectedImageIndex ? 'selected' : ''}`}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
          <div className="main-image-container">
            <img src={images[selectedImageIndex]} alt={product.name} className="main-image" />
            <button className="prev-button" onClick={handlePrevImage}>
              <svg className='previous-arrow' width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.96873 1.16618L1.53955 8.58748L8.96873 16.0088" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="next-button" onClick={handleNextImage}>
              <svg className='next-arrow' width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.09158L8.5 8.58363L1 16.0757" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="product-info">
          <h2 className="product-name-pdp" data-testid="product-name">{product.name}</h2>
          {renderAttributes}
          <p className="attribute-name" style={{ textTransform: 'uppercase' }}>Price:</p> {/* Price label in uppercase */}
          <p className="price-value" data-testid="product-price">{currencySymbol}{convertedPrice}</p>

          <div className='Button-Container'>
            <button
              className={`add-to-cart-button ${isAddToCartDisabled ? 'disabled' : ''}`}
              data-testid="add-to-cart"
              onClick={handleAddToCartClick}
              disabled={isAddToCartDisabled}
            >
              ADD TO CART
            </button>
          </div>

          <p className="product-description" data-testid="product-description">{product.description}</p>
        </div>
      </div>
    );
  }
}

export default PDP_Page;
