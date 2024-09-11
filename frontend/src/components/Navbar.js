import React, { Component } from "react";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import withRouter from '../withRouter.js';
import { withApollo } from '@apollo/react-hoc';
import iconCart from '../images/th.png'
import greenShoppingImage from '../images/greenshopping.jpg'
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import { toast } from 'react-toastify';
const override = css`
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  border-width: 100px;
  border-color: green;
`;
const ProductAttributes = ({ attributes, selectedColor, selectedSize, handleColorClick, handleSizeClick }) => {
  const getPriority = (name) => {
    if (name === "Capacity") return 1;
    if (name === "Color") return 2;
    if (name === "Size") return 3;
    return 4;
  };

  const sortedAttributes = attributes.slice().sort((a, b) => getPriority(a.name) - getPriority(b.name));
  const renderedAttributes = new Set();

  return (
    <div className="product-attributes">
      <div className="attribute-container">
        {sortedAttributes.map((attribute, index) => {
          if (renderedAttributes.has(attribute.name)) {
            return null;
          }

          renderedAttributes.add(attribute.name);

          return (
            <div key={index} className="attribute-item">
              {attribute.name === "Color" && (
                <>
                  <p className="attribute-label">Color:</p>
                  <div className="attribute-values">
                    {attributes
                      .filter(attr => attr.name === "Color")
                      .map((attr, idx) => (
                        <div
                          key={idx}
                          className={`selected-size-color ${attr.value === selectedColor ? 'active' : ''}`}
                          style={{
                            backgroundColor: attr.value,
                            border: `1px solid ${attr.value === selectedColor ? '#5ECE7B' : 'transparent'}`,
                          }}
                          title={`${attr.name}: ${attr.value}`}
                          onClick={() => handleColorClick(attr.value)}
                        />
                      ))}
                  </div>
                </>
              )}

              {attribute.name === "Size" && (
                <>
                  <p className="attribute-label">Size:</p>
                  <div className="attribute-values">
                    {attributes
                      .filter(attr => attr.name === "Size")
                      .map((attr, idx) => (
                        <div
                          key={idx}
                          className={`selected-size-cart ${attr.value === selectedSize ? 'active' : ''}`}
                          onClick={() => handleSizeClick(attr.value)}
                        >
                          {attr.value}
                        </div>
                      ))}
                  </div>
                </>
              )}

              {attribute.name !== "Color" && attribute.name !== "Size" && (
                <p>{`${attribute.name}: ${attribute.value}`}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};



const adjustCartHeight = () => {
  const cartContainer = document.querySelector('.cart-box');
  if (cartContainer) {
    // Recalculate and set the height of the cart container
    const cartHeight = cartContainer.scrollHeight; // Use scrollHeight to include content
    cartContainer.style.height = `${cartHeight}px`;
  }
};
const updateQuantity = (item, increment) => {
  // Existing logic for updating quantities
  increment ? this.incrementQuantity(item) : this.decrementQuantity(item);

  // Adjust cart height after updating quantities
  adjustCartHeight();
};
const PLACE_ORDER = gql`
mutation CreateOrder(
  $productId: ID!,
  $productName: String!,
  $description: String!,
  $totalAmount: Float!,
  $attributes: String!,
  $quantity: Int!
) {
  createOrder(
    product_id: $productId,
    product_name: $productName,
    description: $description,
    total_amount: $totalAmount,
    attributes: $attributes,
    quantity: $quantity
  ) {
    id
    product_id
    product_name
    description
    total_amount
    attributes
    quantity
  }
}
`;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedColors: new Set(), // Track all selected colors
      selectedSizes: new Set(),  // Track all selected sizes
      loadingCart: false,
      categories: [],
      isPlaceOrderDisabled: false,
      isCartOpen: false,
      activeCategory: localStorage.getItem('activeCategory') || null,
      totalPrice: 0,
      cartItemsCount: 0,
      totalQuantity: 0,
      cartHeight: 'auto',
      loadingOrder: false, // Add this state
      cartItems: [],
      isLoadingCategories: false
    };
    // Bind methods if not using arrow functions
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.incrementQuantity = this.incrementQuantity.bind(this);
    this.decrementQuantity = this.decrementQuantity.bind(this);
  }
 
  

  FETCH_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
  `;
  fetchCategories = async () => {
    try {
      this.setState({ isLoadingCategories: true });
      const response = await this.props.client.query({ query: this.FETCH_CATEGORIES });
      const { categories } = response.data;
      this.setState({ categories, isLoadingCategories: false });
    } catch (error) {
      console.log('error');
      this.setState({ isLoadingCategories: false });
    }
  };
  updateCartHeight = () => {
    // Avoid frequent DOM access; use a ref instead if possible
    const cartContainer = document.querySelector('.cart-box');
    if (cartContainer) {
      const cartHeight = cartContainer.scrollHeight; // Use scrollHeight to include content
      this.setState({ cartHeight: `${cartHeight}px` });
    }
  };
  
  
  
  checkCartItems = () => {
    const { cartItems } = this.state;
    let hasZeroQuantity = false;

    cartItems.forEach(item => {
      if (item.quantity === 0) {
        hasZeroQuantity = true;
      }
    });

    this.setState({ isPlaceOrderDisabled: hasZeroQuantity });
  };

  componentDidMount() {
    this.loadCartItems();
    this.checkCartItems();
    this.fetchCategories();
    this.calculateCartTotal();
  }
  
  
  
  loadCartItems = () => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    this.setState({ cartItems: cartData }, this.checkCartItems);
  };
  calculateCartTotal = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cartItems.reduce((total, item) => total + (item.totalPrice || (item.price * item.quantity)), 0);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    this.setState({ cartItems, totalPrice, totalQuantity });
  };


  toggleCart = async () => {
    // Set loading state without delay
    this.setState({ loadingCart: true });
  
    // Directly toggle cart visibility without delay
    this.setState(prevState => ({
      isCartOpen: !prevState.isCartOpen,
      loadingCart: false
    }));
  };
  
  calculateTotalPrice = () => {
    const cartData = JSON.parse(localStorage.getItem('cart'));
    if (!cartData) {
      this.setState({ totalPrice: 0, totalQuantity: 0 });
      return;
    }
    const totalPrice = cartData.reduce((total, item) => total + (item.totalPrice || (item.price * item.quantity)), 0);
    const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
    this.setState({ totalPrice, totalQuantity });
  };


  placeOrder = async () => {
    this.setState({ loadingOrder: true }); // Start loading
  
    try {
      const { client } = this.props;
      const cartData = JSON.parse(localStorage.getItem('cart'));
  
      if (!cartData || cartData.length === 0) {
        toast.error('No items in the cart');
        this.setState({ loadingOrder: false }); // Stop loading
        return;
      }
  
      // Check if any item is missing required attributes (color, size, or specific ones)
      const hasMissingAttributes = cartData.some(item => {
        // Determine if attributes are missing
        const attributes = item.attributes ? JSON.parse(item.attributes) : [];
        const hasRequiredAttributes = item.selectedColor || item.selectedSize || 
          attributes.some(attr => attr.name === 'Capacity' || attr.name === 'With USB 3 ports' || attr.name === 'Options to select');
    
        return !(item.selectedColor || item.selectedSize || hasRequiredAttributes);
      });
  
      if (hasMissingAttributes) {
        toast.error('Please complete the selection process before placing the order.');
        this.setState({ loadingOrder: false }); // Stop loading
        return;
      }
  
      // Group items by name
      const groupedItems = cartData.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: 0,
            attributes: []
          };
        }
        acc[item.name].quantity += item.quantity || 1;
  
        // Ensure color and size are included in attributes
        if (item.selectedColor) {
          acc[item.name].attributes.push({ name: 'Color', value: item.selectedColor });
        }
        if (item.selectedSize) {
          acc[item.name].attributes.push({ name: 'Size', value: item.selectedSize });
        }
  
        if (item.attributes) {
          const parsedAttributes = JSON.parse(item.attributes);
          parsedAttributes.forEach(attr => {
            if (attr.name === 'Capacity' || attr.name === 'With USB 3 ports' || attr.name === 'NO' || attr.name === '') {
              acc[item.name].attributes.push(attr);
            }
          });
        }
        return acc;
      }, {});
  
      // Place order for each grouped item
      for (const itemName in groupedItems) {
        const item = groupedItems[itemName];
  
        const attributesString = JSON.stringify(item.attributes);
        await client.mutate({
          mutation: PLACE_ORDER,
          variables: {
            productId: item.id,
            productName: item.name,
            description: item.description,
            totalAmount: item.price * item.quantity,
            attributes: attributesString,
            quantity: item.quantity
          },
        });
      }
  
      // Clear the cart
      localStorage.removeItem('cart');
      this.setState({ cartItems: [], totalPrice: 0, totalQuantity: 0 }); // Resetting cart and total state
      console.log('Order placed successfully');
  
      // Show toast message for success and disappear after timeout
      toast.success('Your Order has been saved successfully!', {
        autoClose: 2000, // 2000 milliseconds (2 seconds)
      });
  
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred while placing your order. Please try again.');
    } finally {
      this.setState({ loadingOrder: false }); // Stop loading in case of success or error
    }
  };
  
  
  
  
  
  generateUniqueKey(item) {
    return `${item.id}-${item.selectedColor || 'noColor'}-${item.selectedSize || 'noSize'}`;
  }
  
  
  
  

 
  removeDuplicates = (cartData) => {
    const uniqueItems = new Map();

    cartData.forEach(item => {
      const key = this.generateUniqueKey(item);
      if (uniqueItems.has(key)) {
        uniqueItems.get(key).quantity += item.quantity;
        uniqueItems.get(key).totalPrice = uniqueItems.get(key).price * uniqueItems.get(key).quantity;
      } else {
        uniqueItems.set(key, item);
      }
    });

    return Array.from(uniqueItems.values());
  };
  
  incrementQuantity = (item) => {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueKey = this.generateUniqueKey(item);

    const existingItemIndex = cartData.findIndex(cartItem => this.generateUniqueKey(cartItem) === uniqueKey);

    if (existingItemIndex !== -1) {
      cartData[existingItemIndex].quantity += 1;
      cartData[existingItemIndex].totalPrice = cartData[existingItemIndex].price * cartData[existingItemIndex].quantity;
    }

    cartData = this.removeDuplicates(cartData);

    localStorage.setItem('cart', JSON.stringify(cartData));
    this.setState(prevState => ({
      cartItems: cartData,
      totalQuantity: prevState.totalQuantity + 1
    }), () => {
      this.calculateTotalPrice();
      requestAnimationFrame(() => {
        this.updateCartHeight();
        const iconCounter = document.querySelector('.item-bubble-count');
        if (iconCounter) {
          iconCounter.textContent = cartData.reduce((total, item) => total + item.quantity, 0).toString();
        }
      });
    });
  };

  decrementQuantity = (item) => {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueKey = this.generateUniqueKey(item);

    const existingItemIndex = cartData.findIndex(cartItem => this.generateUniqueKey(cartItem) === uniqueKey);

    if (existingItemIndex !== -1) {
      cartData[existingItemIndex].quantity -= 1;

      if (cartData[existingItemIndex].quantity <= 0) {
        cartData.splice(existingItemIndex, 1);
      } else {
        cartData[existingItemIndex].totalPrice = cartData[existingItemIndex].price * cartData[existingItemIndex].quantity;
      }
    }

    cartData = this.removeDuplicates(cartData);

    localStorage.setItem('cart', JSON.stringify(cartData));
    this.setState(prevState => ({
      cartItems: cartData,
      totalQuantity: prevState.totalQuantity - 1
    }), () => {
      this.calculateTotalPrice();
      requestAnimationFrame(() => {
        this.updateCartHeight();
        const iconCounter = document.querySelector('.item-bubble-count');
        if (iconCounter) {
          iconCounter.textContent = cartData.reduce((total, item) => total + item.quantity, 0).toString();
        }
      });
    });
  };

  handleColorChange(item, newColor) {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueKey = this.generateUniqueKey(item);

    const updatedCart = cartData.map(cartItem => {
      if (this.generateUniqueKey(cartItem) === uniqueKey) {
        return { ...cartItem, selectedColor: newColor };
      }
      return cartItem;
    });

    const finalCart = this.removeDuplicates(updatedCart);

    localStorage.setItem('cart', JSON.stringify(finalCart));
    this.setState({ cartItems: finalCart }, () => {
      this.calculateCartTotal();
      this.updateCartHeight();
    });
  }

  handleSizeChange(item, newSize) {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueKey = this.generateUniqueKey(item);

    const updatedCart = cartData.map(cartItem => {
      if (this.generateUniqueKey(cartItem) === uniqueKey) {
        return { ...cartItem, selectedSize: newSize };
      }
      return cartItem;
    });

    const finalCart = this.removeDuplicates(updatedCart);

    localStorage.setItem('cart', JSON.stringify(finalCart));
    this.setState({ cartItems: finalCart }, () => {
      this.calculateCartTotal();
      this.updateCartHeight();
    });
  }
  
  
  
 
  
  
  
  
  




 

  handleCategoryClick = (categoryId) => {
    const { navigate } = this.props;
  
  
  
    this.setState({ activeCategory: categoryId }, () => {
      localStorage.setItem('activeCategory', categoryId);
      navigate(`/category/${categoryId}`);
     
      window.location.reload();
    });
  };
  

  render() {
    const { isPlaceOrderDisabled, loadingOrder } = this.state;
    const { categories, activeCategory, isCartOpen, totalPrice, cartHeight, totalQuantity, cartItems, isLoadingCategories } = this.state;
    const cartData = localStorage.getItem('cart');
    const parsedCartData = cartData ? JSON.parse(cartData) : [];
  
    return (
      <div className={isCartOpen ? 'background-overlay' : ''}>
        {loadingOrder && (
          <div className="order-loading-overlay">
            <div className="order-loading-content">
              <ClipLoader color="#5ECE7B" loading={loadingOrder} css={override} size={100} />
              <p>Please wait...</p>
            </div>
          </div>
        )}
  
        {isCartOpen && (
          <div className="cart-container">
            <div className="cart-box" style={{ height: cartHeight }}>
              {parsedCartData.length > 0 ? (
                <div className='products-container'>
                  <div className='mybag-quantity-wrapper'>
                    <p className='mybag'>My Bag,</p>
                    <p className='quantity-bag'>{parsedCartData.length} items</p>
                  </div>
                  <ul>
                    {parsedCartData.map(item => (
                      <div className='product-div' key={item.id}>
                        <div className="product-cart-box">
                          <img className='cart-item-image' src={JSON.parse(item.image)[0]} alt={item.name} />
                          <div className="cart-item-details">
                            <div className='cart-details-box'>
                              <p className='product-name-cart'>{item.name}</p>
                              <p className='product-price-cart'>${item.price}</p>
                              {item.attributes && (
                                <div>
                                  <ProductAttributes
                                    attributes={JSON.parse(item.attributes || '[]')}
                                    selectedColor={item.selectedColor}
                                    selectedSize={item.selectedSize}
                                    handleColorClick={(newColor) => this.handleColorChange(item, newColor)}
                                    handleSizeClick={(newSize) => this.handleSizeChange(item, newSize)}
                                  />
                                </div>
                              )}
                              <div className='inc-dec'>
                                <div className="quantity-controls">
                                  <button
                                    className="quantity-button"
                                    onClick={(e) => { e.stopPropagation(); this.incrementQuantity(item); }}
                                  >
                                    +
                                  </button>
                                  <span className="quantity-value">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="quantity-button"
                                    onClick={(e) => { e.stopPropagation(); this.decrementQuantity(item); }}
                                  >
                                    −
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
  
                    <p className="totalValueContainer">
                      <span><b>Total:</b></span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </p>
                    <div className='Place-Order-Container'>
                      <button
                        id='1'
                        onClick={(e) => { e.preventDefault(); this.placeOrder() }}
                        disabled={isPlaceOrderDisabled}
                        className="Place-Order"
                        style={{
                          opacity: totalQuantity === 0 ? 0.5 : 1,
                          pointerEvents: totalQuantity === 0 ? 'none' : 'auto'
                        }}
                      >
                        Place Order
                      </button>
                    </div>
                  </ul>
                </div>
              ) : (
                <p>No items in the cart</p>
              )}
            </div>
          </div>
        )}
        {/* Main Navbar */}
        <nav className="categories-navbar">
          <ul className="categories-list">
            {/* Cart Icon */}
            {isLoadingCategories ? (
              <div className="loading-spinner-container">
                <ClipLoader color="#5ECE7B" loading={true} css={override} size={100} />
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  className={`category ${activeCategory === category.id ? 'active' : ''}`}
                  to={`/category/${category.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleCategoryClick(category.id);
                  }}
                >
                  {category.name}
                </Link>
              ))
            )}
          </ul>
          <img src={greenShoppingImage} alt="Shop Icon" className="green-shopping-image" />
          <div className="cart-icon" onClick={this.toggleCart}>
            <img className="cart-icon" src={iconCart} alt="Cart" />
            <span className="item-count-bubble">
              {cartItems.length}
            </span>
          </div>
        </nav>
      </div>
    );
  }
  




}

export default withRouter(withApollo(Navbar));