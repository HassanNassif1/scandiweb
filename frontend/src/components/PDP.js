import React, { Component } from 'react';
import withRouter from '../navigation/withRouter';
import { gql } from '@apollo/client';
import { withApollo } from '@apollo/react-hoc';
import { useNavigate } from 'react-router-dom';
import { CurrencyContext } from '../CurrencyContext/CurrencyProvider';
import { CartContext } from '../Cart/CartContext';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import PDP_Page from '../pages/PDP_Page';
import PDP_Attributes from '../pages/PDP_Attributes';

const override = css`
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  border-width: 100px;
  border-color: green;
`;

const FETCH_PRODUCT = gql`
  query GetProduct($id: Int!) {
    productById(id: $id) {
      id
      name
      category_id
      description
      in_stock
      brand
      price
      attributes {
        name
        value
      }
      image
      category {
        id
        name
      }
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

class PDP extends Component {
  static contextType = CurrencyContext;

  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      dummyState: false,
      selectedImageIndex: 0,
      cartItems: [],
      selectedColor: null,
      selectedSize: null,
      selectedCapacity: null,
      selectedWithUSB3Ports: null,
      selectedWithTouchID: null,
      product: null,
      categories: [],
      loading: true,
      loadingCategories: true,
      error: null,
      errorCategories: null,
    };
  }
  // Function to toggle cart visibility
  toggleCart = () => {
    this.setState((prevState) => ({
      isCartOpen: !prevState.isCartOpen,
    }));
  };

  componentDidMount() {
    const { client } = this.props;
    const { productId } = this.props.params;
    const productIdInt = parseInt(productId, 10);

    if (!isNaN(productIdInt)) {
      client
        .query({ query: FETCH_PRODUCT, variables: { id: productIdInt } })
        .then(({ data }) => this.setState({ product: data.productById, loading: false }))
        .catch((error) => this.setState({ error, loading: false }));
    } else {
      this.setState({ loading: false });
    }

    client
      .query({ query: FETCH_CATEGORIES })
      .then(({ data }) => this.setState({ categories: data.categories, loadingCategories: false }))
      .catch((error) => this.setState({ errorCategories: error, loadingCategories: false }));
  }

  handleImageClick = (index) => {
    this.setState({ selectedImageIndex: index });
  };
  handlePrevImage = () => {
    this.setState((prevState) => {
      const images = Array.isArray(this.state.product.image)
        ? this.state.product.image
        : JSON.parse(this.state.product.image || '[]');
      const newIndex =
        (prevState.selectedImageIndex - 1 + images.length) % images.length; // Wrap around using modulo
      return { selectedImageIndex: newIndex };
    });
  };
  
  handleNextImage = () => {
    this.setState((prevState) => {
      const images = Array.isArray(this.state.product.image)
        ? this.state.product.image
        : JSON.parse(this.state.product.image || '[]');
      const newIndex = (prevState.selectedImageIndex + 1) % images.length; // Wrap around using modulo
      return { selectedImageIndex: newIndex };
    });
  };
  
  
  


  convertPrice = (price) => {
    const { selectedCurrency, currencyRates } = this.context;
    const rate = currencyRates[selectedCurrency.label] || 1;
    return (price * rate).toFixed(2);
  };
  isAddToCartDisabled = () => {
    const { selectedSize, selectedColor, selectedCapacity, selectedWithUSB3Ports, selectedWithTouchID, product } = this.state;

    // If the product or its attributes are not yet loaded, disable the button
    if (!product || !product.attributes) return true;

    const hasSize = product.attributes.some(attr => attr.name === "Size");
    const hasColor = product.attributes.some(attr => attr.name === "Color");
    const hasCapacity = product.attributes.some(attr => attr.name === "Capacity");
    const hasUSB3ports = product.attributes.some(attr => attr.name === "With USB 3 ports");
    const hasTouchID = product.attributes.some(attr => attr.name === "Touch ID in keyboard");

    // Disable the button if any of the required attributes are not selected
    return (
      (hasSize && !selectedSize) ||
      (hasColor && !selectedColor) ||
      (hasCapacity && !selectedCapacity) ||
      (hasUSB3ports && !selectedWithUSB3Ports) ||
      (hasTouchID && !selectedWithTouchID)
    );
  };

  handleAddToCart = (product) => {
    const { selectedColor, selectedSize, selectedCapacity, selectedWithUSB3Ports, selectedWithTouchID } = this.state;

    // Ensure attributes are parsed if they're in string format
    let attributes = product.attributes;
    if (typeof attributes === 'string') {
      attributes = JSON.parse(attributes);
    }

    // Check if the product is in stock
    if (!product.in_stock) {
      toast.error('This product is out of stock and cannot be added to the cart.');
      return;
    }

    // Check if all required attributes are selected
    const hasSize = attributes.some(attr => attr.name === "Size");
    const hasColor = attributes.some(attr => attr.name === "Color");
    const hasCapacity = attributes.some(attr => attr.name === "Capacity");
    const hasUSB3ports = attributes.some(attr => attr.name === "With USB 3 ports");
    const hasTouchID = attributes.some(attr => attr.name === "Touch ID in keyboard");

    // If any necessary attribute is missing, show an error
    if (
      (hasSize && !selectedSize) ||
      (hasColor && !selectedColor) ||
      (hasCapacity && !selectedCapacity) ||
      (hasTouchID && !selectedWithTouchID) ||
      (hasUSB3ports && !selectedWithUSB3Ports)
    ) {
      toast.error('Please complete the selection process before adding to the cart.');
      return;
    }
    const navbarComponent = document.querySelector('.categories-navbar');
    if (navbarComponent) {
      // Find the cart icon button in the navbar
      const toggleCartButton = navbarComponent.querySelector('.cart-icon');
      if (toggleCartButton) {
        // Simulate a click on the cart icon to open the cart
        toggleCartButton.click();

        // Show a success toast message
        toast.success(`${product.name} has been added to your cart!`, {
          autoClose: 5000,
        });
      }
    }
    // Calculate product price
    const productPrice = product.price * 1; // Assuming quantity is 1

    // Update total price in state
    this.setState(prevState => {
      const updatedTotalPrice = prevState.totalPrice + productPrice;
      return { totalPrice: updatedTotalPrice };
    });

    // Add product to cart
    const productCopy = {
      ...product,
      selectedColor,
      selectedSize,
      selectedCapacity,
      selectedWithUSB3Ports,
      selectedWithTouchID,
      quantity: 1,
      productPrice,
    };

    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    cartData.push(productCopy);
    localStorage.setItem('cart', JSON.stringify(cartData));

    // Update cart total price in localStorage
    const updatedTotalPrice = cartData.reduce((total, item) => total + item.productPrice, 0);
    localStorage.setItem('totalprice', updatedTotalPrice);

    // Show success message
    toast.success(`${product.name} has been added to your cart!`, { autoClose: 5000 });

    // Directly toggle cart open after adding item to cart
    this.setState({ isCartOpen: true });
  };



  // Example of the toggleCart method (adjust as per your requirements)
  toggleCart = () => {
    this.setState(prevState => ({
      isCartOpen: !prevState.isCartOpen,
    }));
  };





  render() {
    const {
      selectedImageIndex,
      selectedColor,
      selectedSize,
      selectedCapacity,
      selectedWithUSB3Ports,
      selectedWithTouchID,
      product,
      categories,
      loading,
      loadingCategories,
      error,
      errorCategories,
    } = this.state;
  
    // Show loading spinner if data is being fetched
    if (loading || loadingCategories) {
      return (
        <div className="loading-spinner-container">
          <ClipLoader color="#5ECE7B" loading={true} css={override} size={100} />
        </div>
      );
    }
  
    // Handle errors for fetching product or categories
    if (error) {
      return <p>Error fetching product details: {error.message}</p>;
    }
  
    if (errorCategories) {
      return <p>Error fetching categories: {errorCategories.message}</p>;
    }
  
    // If no product found, show a message
    if (!product) {
      return <p>No product found.</p>;
    }
  
    // Parse the product images (assuming the images are stored as a JSON string)
    const images = Array.isArray(product.image)
    ? product.image
    : typeof product.image === 'string'
    ? JSON.parse(product.image)
    : [];
    console.log('Images:', images);
    console.log('Selected Image Index:', selectedImageIndex);
      
  
    // If images are not available, show a message
    if (images.length === 0) {
      return <p>No images available for this product.</p>;
    }
  
    return (
      <>
        {/* Navbar component */}
        <Navbar
          categories={categories}
          activeCategoryName={product.category.name.toLowerCase()}
          handleCategoryClick={(categoryId) => this.props.navigate(`/${categoryId.toLowerCase()}`)}
          isCartOpen={this.state.isCartOpen} // Pass the cart state
          toggleCart={this.toggleCart} // Pass the toggleCart function
        />
  
        {/* PDP Page */}
        <PDP_Page
          product={product}
          images={images}
          selectedImageIndex={selectedImageIndex}
          handlePrevImage={this.handlePrevImage}
          handleImageClick={this.handleImageClick}
          handleNextImage={this.handleNextImage}
          handleAddToCartClick={() => this.handleAddToCart(product)}
          renderAttributes={
            <PDP_Attributes
              attributes={product.attributes}
              selectedColor={selectedColor}
              setSelectedColor={(color) => this.setState({ selectedColor: color })}
              selectedSize={selectedSize}
              setSelectedSize={(size) => this.setState({ selectedSize: size })}
              selectedCapacity={selectedCapacity}
              setSelectedCapacity={(capacity) => this.setState({ selectedCapacity: capacity })}
              selectedWithUSB3Ports={selectedWithUSB3Ports}
              setSelectedWithUSB3Ports={(usb) => this.setState({ selectedWithUSB3Ports: usb })}
              selectedWithTouchID={selectedWithTouchID}
              setSelectedWithTouchID={(touchID) => this.setState({ selectedWithTouchID: touchID })}
            />
          }
          convertedPrice={this.convertPrice(product.price)} // Convert price based on currency context
          currencySymbol={this.context.selectedCurrency.symbol} // Show the correct currency symbol
          isAddToCartDisabled={this.isAddToCartDisabled()} // Check if Add to Cart button should be disabled
        />
      </>
    );
  }
  
  


}

export default withRouter(withApollo(PDP));
