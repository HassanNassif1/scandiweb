import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useCart } from '../Cart/CartContext';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import withRouter from '../withRouter';
import { toast } from 'react-toastify';

const override = css`
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  border-width: 100px;
  border-color: green;
`;

const FETCH_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      in_stock
      brand
      price
      attributes
      image
      category_id
    }
  }
`;

const FETCH_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

const useCartHook = () => {
  const { addToCart, placeOrder } = useCart();

  const addProductToCart = (product) => {
    let cartData = getCart();
    let existingProduct = cartData.find(item => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor);
  
    if (existingProduct) {
      // Increment quantity if the product already exists
      existingProduct.quantity += product.quantity || 1;
    } else {
      // Set quantity and price for a new product
      product.quantity = product.quantity || 1;
      product.productPrice = product.productPrice || (product.price * product.quantity);
      cartData.push(product);
    }
  
    addToCart(product);
   
    localStorage.setItem('cart', JSON.stringify(cartData));
  };
  
  

  const placeOrderToDatabase = async () => {
    const cartData = getCart();
    try {
      for (const item of cartData) {
        await placeOrder({
          productId: item.id,
          productName: item.name,
          description: item.description,
          totalAmount: item.price * item.quantity,
          attributes: JSON.stringify(item.attributes),
          quantity: item.quantity
        });
      }
      localStorage.removeItem('cart');
      console.log('Order placed successfully');
      toast.success('Your Order has been saved successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  };

  return { addProductToCart };
};

const ProductDetailPageContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // State to track total price
  const navigate = useNavigate();
  const { productId } = useParams();

  const { loading: loadingProduct, error: errorProduct, data: dataProduct } = useQuery(FETCH_PRODUCT, {
    variables: { id: productId },
    skip: !productId,
  });
  const { loading: loadingCategories, error: errorCategories, data: dataCategories } = useQuery(FETCH_CATEGORIES);
  const { addProductToCart } = useCartHook();

  useEffect(() => {
    if (selectedCategory) {
      navigate(`/category/${selectedCategory}`);
    }
  }, [selectedCategory, navigate]);

  const handleAddToCart = (product) => {
    const { selectedColor, selectedSize, selectedCapacity, selectedWithUSB3Ports } = product;
    const imageUrl = JSON.parse(product.image || '[]')[0];
    const quantity = 1; // Start with quantity 1

    const productPrice = product.price * quantity; // Calculate product price
    setTotalPrice(prevTotalPrice => prevTotalPrice + productPrice); // Update total price in state

    addProductToCart({
      ...product,
      selectedColor,
      selectedSize,
      selectedCapacity,
      selectedWithUSB3Ports,
      imageUrl,
      quantity,
    });

    const navbarComponent = document.querySelector('.categories-navbar');
    if (navbarComponent) {
      const toggleCartButton = navbarComponent.querySelector('.cart-icon');
      if (toggleCartButton) {
        toggleCartButton.click();
      }
    }

    console.log("Item added to cart:", product);
  };

  if (loadingProduct || loadingCategories) {
    return (
      <div className="loading-spinner-container">
        <ClipLoader color="#5ECE7B" loading={true} css={override} size={100} />
      </div>
    );
  }

  if (errorProduct) {
    return <p>Error fetching product details: {errorProduct.message}</p>;
  }

  if (errorCategories) {
    return <p>Error fetching categories: {errorCategories.message}</p>;
  }

  const product = dataProduct.product;
  const categories = dataCategories.categories;

  return (
    <ProductDetailPage
      product={product}
      handleAddToCart={handleAddToCart}
      setTotalPrice={setTotalPrice} // Pass setTotalPrice as prop
    />
  );
};


const ProductDetailPage = ({ product, handleAddToCart,setTotalPrice  }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [selectedWithUSB3Ports, setSelectedWithUSB3Ports] = useState(null);
  

  const handlePrevImage = () => {
    const images = JSON.parse(product.image || '[]');
    setSelectedImageIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    const images = JSON.parse(product.image || '[]');
    setSelectedImageIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    console.log('Selected color:', color);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    const attributes = JSON.parse(product.attributes || '[]');
    const selectedAttribute = attributes.find(attribute => attribute.name === "Size" && attribute.value === size);
    console.log('Selected size:', selectedAttribute ? selectedAttribute.value : null);
  };
  const handleCapacityClick = (capacity) => {
    setSelectedCapacity(capacity);
  };
  
  const handleWithUSB3PortsClick = (withUSB3Ports) => {
    setSelectedWithUSB3Ports(withUSB3Ports);
  };
  const handleAddToCartClick = () => {
    const attributes = JSON.parse(product.attributes || '[]');
    const hasSize = attributes.some(attr => attr.name === "Size");
    const hasColor = attributes.some(attr => attr.name === "Color");
  
    // If the product has size or color attributes, ensure they are selected
    if ((hasSize && !selectedSize) || (hasColor && !selectedColor)) {
      toast.error('Please select all required attributes before adding to cart.');
      return;
    }
  
    // Set default quantity to 1
    const quantity = 1;
  
    // Calculate product price
    const productPrice = product.price * quantity;
    <ClipLoader color="#5ECE7B" loading={true} css={override} size={100} />
    window.location.reload();
    // Add product to cart with correct quantity
    handleAddToCart({
      ...product,
      selectedColor,
      selectedSize,
      selectedCapacity,
      selectedWithUSB3Ports,
      quantity,
      productPrice // Ensure productPrice is passed
    });
  
    // Update total price
    setTotalPrice(prevTotalPrice => prevTotalPrice + productPrice);
  };
  
  
  
  

  const renderAttributes = () => {
    const attributes = JSON.parse(product.attributes || '[]');

    return (
      <div>
        <h3>Attributes:</h3>
        <div className="attribute-container">
          {attributes.map((attribute, index) => (
            <div key={index} className="attribute-item">
              {attribute.name === "Color" ? (
                <div
                  className={`attribute-box ${attribute.value === selectedColor ? 'active' : ''}`}
                  style={{
                    backgroundColor: attribute.value,
                    border: `2.5px solid ${attribute.value === selectedColor ? '#5ECE7B' : 'transparent'}`,
                  }}
                  title={`${attribute.name}: ${attribute.value}`}
                  onClick={() => handleColorClick(attribute.value)}
                />
              ) : attribute.name === "Size" ? (
                <div
                  className={`size-box ${attribute.value === selectedSize ? 'active' : ''}`}
                  onClick={() => handleSizeClick(attribute.value)}
                >
                  {attribute.value}
                </div>
              ) : (
                <p>{`${attribute.name}: ${attribute.value}`}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const images = JSON.parse(product.image || '[]');

  return (
    <div className="product-detail">
      <div className="product-images-container">
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
        <h2>{product.name}</h2>
        {product.attributes && renderAttributes()}
        <p>Price: {product.price}</p>
        <div className='add-to-cart-container'>
        <button className='add-to-cart-button' onClick={handleAddToCartClick}>Add to Cart</button>
        </div>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default withRouter(ProductDetailPageContainer);
