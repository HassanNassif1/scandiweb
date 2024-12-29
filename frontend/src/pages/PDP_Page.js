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
      isAddToCartDisabled=false,
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
            <button className="prev-button" onClick={handlePrevImage}>&#10094;</button>
            <button className="next-button" onClick={handleNextImage}>&#10095;</button>
          </div>
        </div>
        <div className="product-info">
          <h2 className="product-name-pdp" data-testid="product-name">{product.name}</h2>  {/* Added data-testid */}
          {renderAttributes}
          <p className="attribute-name">Price:</p>
          <p className="price-value" data-testid="product-price">{currencySymbol}{convertedPrice}</p>  {/* Added data-testid */}
      
          <div className='Button-Container'>
          <button
  className={`add-to-cart-button ${isAddToCartDisabled ? 'disabled' : ''}`}
  data-testid="add-to-cart"
  onClick={handleAddToCartClick}
  disabled={isAddToCartDisabled} // Check if this is set correctly in your state/props
>
  ADD TO CART
</button>

</div>



          <p  className="product-description"data-testid="product-description">{product.description}</p>
        </div>
      </div>
    );
  }
}

export default PDP_Page;
