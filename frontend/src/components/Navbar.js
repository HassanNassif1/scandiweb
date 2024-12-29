import React, { Component } from "react";
import { gql } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import withRouter from '../navigation/withRouter.js';

import { withApollo } from '@apollo/react-hoc';
import iconCart from '../assets/th.png'
import greenShoppingImage from '../assets/greenshopping.jpg'
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import { toast } from 'react-toastify';
import ProductCart_Attributes from "../pages/ProductCart_Attributes.js";
import CurrencySelector from '../pages/CurrencySelector'; // Adjust the path as necessary
import { CurrencyContext } from "../CurrencyContext/CurrencyProvider.js";
import { CategoryContext } from '../CategoryContext/CategoryContext.js';
const override = css`
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  border-width: 100px;
  border-color: green;place
`;





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


class Navbar extends Component {
  static contextType = CurrencyContext; // Define context type
  constructor(props) {
    super(props);
    // Fetch the active category from localStorage
    const activeCategory = localStorage.getItem('activeCategory') || null;

    this.state = {

      loadingCart: false,
      categories: [],
      isPlaceOrderDisabled: false,
      isLocalhost: window.location.hostname === 'localhost',

      isCartOpen: false,
      activeCategory: null, // Set it to localStorage value
      totalPrice: localStorage.getItem('totalprice'),
      cartItemsCount: 0,
      totalQuantity: 0,
      cartHeight: 'auto',
      loadingOrder: false,
      cartItems: [],
      isLoadingCategories: true,
      currencies: [],
      selectedCurrency: null,
      categoryProducts: []
    };
  }
  FETCH_CURRENCIES = gql`
  query {
    currencies {
      id
      label
      symbol
    }
  }
`;
  PLACE_ORDER = gql`
mutation CreateOrder(
  $productId: Int!,
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
  FETCH_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
  `;

  componentDidMount() {
    // Load cart data from localStorage
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];

    // Calculate the total price based on cart data
    const totalPrice = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('beforeeeeeeeeeeeeeeeee', totalPrice)
    // Update state with the cart data and the calculated total price
    localStorage.setItem('totalprice', totalPrice);
    this.setState({

      cartItems: cartData,
      totalPrice: localStorage.getItem('totalprice'),
      cartItemsCount: cartData.length,
      totalQuantity: cartData.reduce((total, item) => total + item.quantity, 0),
      isCartOpen: true

    });
  }

  fetchCurrencies = async () => {
    try {
      const response = await this.props.client.query({ query: this.FETCH_CURRENCIES });
      const { currencies } = response.data;

      this.setState({
        currencies,
        selectedCurrency: currencies.length > 0 ? currencies[0] : null // Set default currency
      });
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };
  setActiveCategory = (categoryId) => {
    // Store the active category in localStorage and update state
    localStorage.setItem('activeCategory', categoryId);
    this.setState({ activeCategory: categoryId });
  };
  fetchCategories = async () => {
    try {
      this.setState({ isLoadingCategories: true });
      const response = await this.props.client.query({ query: this.FETCH_CATEGORIES });
      const { categories } = response.data;
      console.log(response.data, 'dataaaaaaaaaaa');
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
    // this.calculateCartTotal();
    this.fetchCurrencies();
  }







  loadCartItems = () => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    this.setState({ cartItems: cartData }, this.checkCartItems);
  };
  calculateTotalPrice = () => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    return cartData.reduce((total, item) => total + item.price * item.quantity, 0);
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
      this.setState({ totalQuantity: 0 });
      localStorage.setItem('totalprice', 0);

      return;
    }

    const totalPrice = cartData.reduce((total, item) => total + (item.totalPrice || (item.price * item.quantity)), 0);
    localStorage.setItem('totalprice', totalPrice);
    const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
    this.setState({ totalQuantity });
  };


  placeOrder = async () => {
    console.log("placeOrder called");
    this.setState({ loadingOrder: true });

    try {
      const { client } = this.props;
      const cartData = JSON.parse(localStorage.getItem('cart'));
      console.log("Cart data:", cartData); // Log the cart data to ensure it's correct

      if (!cartData || cartData.length === 0) {
        toast.error('No items in the cart');
        this.setState({ loadingOrder: false });
        return;
      }

      // Check for missing attributes and select the first available option if missing
      const hasInvalidItem = cartData.some((item) => {
        console.log("Checking item:", item);
        if (!item.attributes || item.attributes.length === 0) return false;

        let isMissingAttributes = false;

        // Check for missing required attributes
        if (item.attributes.some(attr => attr.name === 'Capacity' && !item.selectedCapacity)) {
          // If Capacity is missing, select the first available option (if any)
          const capacityAttr = item.attributes.find(attr => attr.name === 'Capacity');
          if (capacityAttr && !item.selectedCapacity) {
            item.selectedCapacity = capacityAttr.value; // Select the first available value
          }
          isMissingAttributes = !item.selectedCapacity; // Mark as missing if still no selected value
        }

        if (item.attributes.some(attr => attr.name === 'Touch ID in keyboard' && !item.selectedWithTouchID)) {
          // If Touch ID is missing, select the first available option (if any)
          const touchIDAttr = item.attributes.find(attr => attr.name === 'Touch ID in keyboard');
          if (touchIDAttr && !item.selectedWithTouchID) {
            item.selectedWithTouchID = touchIDAttr.value; // Select the first available value
          }
          isMissingAttributes = !item.selectedWithTouchID; // Mark as missing if still no selected value
        }

        if (item.attributes.some(attr => attr.name === 'With USB 3 ports' && !item.selectedWithUSB3Ports)) {
          // If USB 3 Ports is missing, select the first available option (if any)
          const usbPortAttr = item.attributes.find(attr => attr.name === 'With USB 3 ports');
          if (usbPortAttr && !item.selectedWithUSB3Ports) {
            item.selectedWithUSB3Ports = usbPortAttr.value; // Select the first available value
          }
          isMissingAttributes = !item.selectedWithUSB3Ports; // Mark as missing if still no selected value
        }

        if (item.attributes.some(attr => attr.name === 'Size' && !item.selectedSize)) {
          // If Size is missing, select the first available option (if any)
          const sizeAttr = item.attributes.find(attr => attr.name === 'Size');
          if (sizeAttr && !item.selectedSize) {
            item.selectedSize = sizeAttr.value; // Select the first available value
          }
          isMissingAttributes = !item.selectedSize; // Mark as missing if still no selected value
        }

        if (item.attributes.some(attr => attr.name === 'Color' && !item.selectedColor)) {
          // If Color is missing, select the first available option (if any)
          const colorAttr = item.attributes.find(attr => attr.name === 'Color');
          if (colorAttr && !item.selectedColor) {
            item.selectedColor = colorAttr.value; // Select the first available value
          }
          isMissingAttributes = !item.selectedColor; // Mark as missing if still no selected value
        }

        return isMissingAttributes;
      });

      // Notify the user if any item has missing attributes
      if (hasInvalidItem) {
        toast.error('Some items have missing required attributes. Please check the cart.');
        this.setState({ loadingOrder: false });
        return;
      }

      // Group items by name and attributes
      const groupedItems = cartData.reduce((acc, item) => {
        console.log("Grouping item:", item); // Log each item before grouping

        if (!acc[item.name]) {
          acc[item.name] = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: 0,
            attributes: [], // Initialize the attributes array here
          };
        }

        // Ensure all required attributes are included in the item
        if (item.selectedColor) {
          console.log(`Adding color attribute: ${item.selectedColor}`);
          acc[item.name].attributes.push({ name: 'Color', value: item.selectedColor });
        }

        if (item.selectedSize) {
          console.log(`Adding size attribute: ${item.selectedSize}`);
          acc[item.name].attributes.push({ name: 'Size', value: item.selectedSize });
        }

        if (item.selectedCapacity) {
          console.log(`Adding capacity attribute: ${item.selectedCapacity}`);
          acc[item.name].attributes.push({ name: 'Capacity', value: item.selectedCapacity });
        }

        if (item.selectedWithUSB3Ports) {
          console.log(`Adding USB 3 ports attribute: ${item.selectedWithUSB3Ports}`);
          acc[item.name].attributes.push({ name: 'With USB 3 ports', value: item.selectedWithUSB3Ports });
        }

        if (item.selectedWithTouchID) {
          console.log(`Adding Touch ID attribute: ${item.selectedWithTouchID}`);
          acc[item.name].attributes.push({ name: 'Touch ID in keyboard', value: item.selectedWithTouchID });
        }

        acc[item.name].quantity += item.quantity || 1;
        return acc;
      }, {});

      console.log("Grouped items:", groupedItems); // Check the final grouped items

      // Send mutation for each grouped item
      for (const itemName in groupedItems) {
        const item = groupedItems[itemName];
        const attributesString = JSON.stringify(item.attributes);

        // Log before mutation
        console.log("Sending mutation for item:", item);
        console.log("Attributes being sent:", attributesString); // Log the final attributes string

        await client.mutate({
          mutation: this.PLACE_ORDER,
          variables: {
            productId: item.id,
            productName: item.name,
            description: item.description,
            totalAmount: item.price * item.quantity,
            attributes: attributesString,
            quantity: item.quantity,
          },
        });
      }

      // Clear cart and reset state
      localStorage.removeItem('cart');
      localStorage.setItem('totalprice', 0);
      this.setState({ cartItems: [], totalQuantity: 0 });

      toast.success('Your Order has been saved successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred while placing your order. Please try again.');
    } finally {
      this.setState({ loadingOrder: false });
    }
  };










  generateUniqueKey(item) {
    return `${item.id}-${item.selectedColor || 'noColor'}-${item.selectedSize || 'noSize'}-${item.selectedWithUSB3Ports || 'noUSB3'}-${item.selectedWithTouchID || 'noTouchID'}-${item.selectedCapacity || 'noCapacity'}`;
  }


  removeDuplicates = (cartData) => {
    const uniqueItems = new Map();

    cartData.forEach(item => {
      const key = this.generateUniqueKey(item); // Ensure capacity is part of the key

      if (uniqueItems.has(key)) {
        // Treat each product with different capacity as a separate item
        uniqueItems.set(key, item); // We replace the item, but adjust this to add quantities if necessary.
      } else {
        uniqueItems.set(key, { ...item });
      }
    });

    return Array.from(uniqueItems.values());
  };



  updateCartState = (updatedCartData) => {
    const updatedTotalPrice = updatedCartData.reduce((total, item) => total + (item.price * item.quantity), 0);
    const updatedTotalQuantity = updatedCartData.reduce((total, item) => total + item.quantity, 0);

    // Update the state with the new cart data, total price, and quantity
    this.setState({
      parsedCartData: updatedCartData,
      totalPrice: updatedTotalPrice,
      totalQuantity: updatedTotalQuantity,
    });
  };
  incrementQuantity = (item) => {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];

    const uniqueKey = this.generateUniqueKey(item);
    const existingItemIndex = cartData.findIndex(cartItem => this.generateUniqueKey(cartItem) === uniqueKey);

    if (existingItemIndex !== -1) {
      cartData[existingItemIndex].quantity += 1;
      cartData[existingItemIndex].totalPrice = cartData[existingItemIndex].price * cartData[existingItemIndex].quantity;
    }

    // Ensure no duplicate items are present (make sure removeDuplicates returns a valid array)
    cartData = this.removeDuplicates(cartData);

    // Check if cartData is valid before proceeding
    if (!Array.isArray(cartData)) {
      console.error('cartData is not an array', cartData);
      return;
    }

    // Update localStorage and state
    localStorage.setItem('cart', JSON.stringify(cartData));
    this.setState(prevState => {
      const updatedTotalQuantity = prevState.totalQuantity + 1;
      return {
        cartItems: cartData,
        totalQuantity: updatedTotalQuantity,
      };
    }, () => {
      this.calculateTotalPrice(cartData); // Pass cartData to calculate total price

      requestAnimationFrame(() => {
        this.updateCartHeight();
        const iconCounter = document.querySelector('.item-bubble-count');
        if (iconCounter) {
          iconCounter.textContent = cartData.reduce((total, item) => total + item.quantity, 0).toString();
        }
      });
    });
  };

  // Make sure `removeDuplicates` returns a valid array
  removeDuplicates = (cartData) => {
    // Assuming you want to remove duplicate items based on a unique key
    const seen = new Set();
    return cartData.filter(item => {
      const key = this.generateUniqueKey(item);
      if (seen.has(key)) {
        return false;
      } else {
        seen.add(key);
        return true;
      }
    });
  };

  // Recalculate total price after cart update
  calculateTotalPrice = (cartData) => {
    if (!Array.isArray(cartData)) {
      console.error('cartData is not an array in calculateTotalPrice', cartData);
      return;
    }

    let totalPrice = 0;
    cartData.forEach(item => {
      totalPrice += item.totalPrice || (item.price * item.quantity); // Ensure we use the correct value
    });

    // Update the total price in localStorage and state
    localStorage.setItem('totalprice', totalPrice.toFixed(2));
    this.setState({
      totalPrice: totalPrice // Update total price in state for UI
    });
  };


  decrementQuantity = (item) => {
    // Get current cart data from localStorage
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];

    // Generate a unique key for the item to locate it in the cart
    const generateUniqueKey = (item) => {
      return `${item.id}-${item.selectedColor || 'none'}-${item.selectedSize || 'none'}-${item.selectedCapacity || 'none'}-${item.selectedWithUSB3Ports || 'none'}-${item.selectedWithTouchID || 'none'}`;
    };

    const uniqueKey = generateUniqueKey(item);

    // Find the index of the item in the cart based on the unique key
    const existingItemIndex = cartData.findIndex(cartItem => generateUniqueKey(cartItem) === uniqueKey);

    if (existingItemIndex !== -1) {
      const existingItem = cartData[existingItemIndex];

      // Decrement the quantity, ensuring it doesn't go below 1
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        // Remove the item if the quantity is 1 or less
        cartData.splice(existingItemIndex, 1);
      }

      // Update the cart in localStorage
      localStorage.setItem('cart', JSON.stringify(cartData));

      // Recalculate the total price after updating the cart
      this.calculateTotalPrice(cartData);  // Recalculate total price with updated cart data

      // Update state to trigger re-render with updated cart
      this.setState({
        cartItems: cartData
      });
    }
  };

  // Recalculate total price
  calculateTotalPrice = (cartData) => {
    let totalPrice = 0;

    // Iterate through the cart and calculate the total price
    cartData.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    // Update the total price in localStorage
    localStorage.setItem('totalprice', totalPrice.toFixed(2));

    // Ensure the UI reflects the updated price
    this.setState({
      totalPrice: totalPrice // Update total price in state for UI
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
      // this.calculateCartTotal();
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
      // this.calculateCartTotal();
      this.updateCartHeight();
    });
  }












  handleCategoryClick = (categoryName) => {
    const { handleCategoryClick } = this.props;  // Access the handleCategoryClick function passed from ProductList

    // Call handleCategoryClick from props to update categoryName in ProductList
    handleCategoryClick(categoryName);
  };


  handleCapacityChange(item, newCapacity) {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueKey = this.generateUniqueKey(item);

    const updatedCart = cartData.map(cartItem => {
      if (this.generateUniqueKey(cartItem) === uniqueKey) {
        return { ...cartItem, selectedCapacity: newCapacity }; // Update selectedCapacity
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

  handleUSB3Change(item, newUSB3Value) {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueKey = this.generateUniqueKey(item);

    const updatedCart = cartData.map(cartItem => {
      if (this.generateUniqueKey(cartItem) === uniqueKey) {
        return { ...cartItem, selectedWithUSB3Ports: newUSB3Value }; // Update selectedWithUSB3Ports
      }
      return cartItem;
    });

    const finalCart = this.removeDuplicates(updatedCart);

    localStorage.setItem('cart', JSON.stringify(finalCart));
    this.setState({ cartItems: finalCart }, () => {
      // this.calculateCartTotal();
      this.updateCartHeight();
    });
  }

  handleTouchIDChange(item, newTouchIDValue) {
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueKey = this.generateUniqueKey(item);

    const updatedCart = cartData.map(cartItem => {
      if (this.generateUniqueKey(cartItem) === uniqueKey) {
        return { ...cartItem, selectedWithTouchID: newTouchIDValue }; // Update selectedWithTouchID
      }
      return cartItem;
    });

    const finalCart = this.removeDuplicates(updatedCart);

    localStorage.setItem('cart', JSON.stringify(finalCart));
    this.setState({ cartItems: finalCart }, () => {
      // this.calculateCartTotal();
      this.updateCartHeight();
    });
  }

  render() {
    // Modify generateCartItemId to consider all attributes (size, color, etc.)
    const generateCartItemId = (item) => {
      console.log("Item attributes:", item.attributes);

      const findAttributeByName = (name) => item.attributes.find(attr => attr.name === name)?.value || 'none';

      return `${item.id}-${item.selectedColor || findAttributeByName('Color')}-${item.selectedSize || findAttributeByName('Size')}-${item.selectedCapacity || findAttributeByName('Capacity')}-${item.selectedWithUSB3Ports || findAttributeByName('With USB 3 ports')}-${item.selectedWithTouchID || findAttributeByName('Touch ID in keyboard')}`;
    };





    const { selectedCurrency } = this.context;
    const { categories, activeCategoryName } = this.props;
    const { isPlaceOrderDisabled, loadingOrder, currencies, isCartOpen, isLoadingCategories } = this.state;

    const cartData = localStorage.getItem('cart');
    const parsedCartData = cartData ? JSON.parse(cartData) : [];

    // Generate unique cart items and combine products with the same attributes
    const uniqueCartItems = parsedCartData.reduce((acc, currentItem) => {
      const itemId = generateCartItemId(currentItem); // Generate unique key based on product ID and selected attributes
      const existingItemIndex = acc.findIndex(item => generateCartItemId(item) === itemId); // Look for an existing product with the same key

      if (existingItemIndex === -1) {
        // If not found, add the product to the accumulator
        acc.push({ ...currentItem });
      } else {
        // If found, combine the quantities
        acc[existingItemIndex].quantity += currentItem.quantity;
      }

      return acc;
    }, []);

    console.log("Combined Products in Cart:", uniqueCartItems); // Log combined cart items to the console

    // Check if it's on a product detail page (PDP) or product list page (PLP)
    const isPDP = window.location.pathname.startsWith('/product/') && window.location.search.toLowerCase().includes('categoryName');
    const isPL = window.location.pathname === '/';

    // Extract category from the URL on PDP
    const urlParams = new URLSearchParams(window.location.search);
    const categoryNameFromURL = urlParams.get('categoryName')?.toLowerCase();

    // If we are on PDP, ensure the active category comes from the URL
    const activeCategory = isPDP && categoryNameFromURL ? categoryNameFromURL : activeCategoryName;

    // Handle loading categories better (don't block UI on PDP)
    if (isLoadingCategories) {
      return <div></div>;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      if (isPDP) {
        return <div></div>;
      }
      return <div>.</div>;
    }

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
            <div data-testid="cart-overlay" aria-hidden={!isCartOpen} className={`cart-box ${isPL ? 'cart-box' : ''} ${isPDP ? 'pdp-cart-style' : ''} ${isCartOpen ? 'bg-white p-4 shadow-lg' : ''}`}>
              {uniqueCartItems.length > 0 ? (
                <div className="products-container">
                  <div className="mybag-quantity-wrapper">
                    <p className="mybag">My Bag,</p>
                    <p className="quantity-bag" data-testid="cart-item-count">{uniqueCartItems.length} items</p>
                  </div>
                  <ul>

                    {uniqueCartItems.map((item) => {
                      const priceClass = item.name === 'Nike Air Huarache Le' ? 'product-price-cart-exception' : 'product-price-cart';
                      const imageSrc = typeof item.image === 'string' ? JSON.parse(item.image)[0] : item.image[0];
                      const parsedAttributes = typeof item.attributes === 'string' ? JSON.parse(item.attributes || '[]') : item.attributes;
                      const convertedPrice = this.context.convertPrice(item.price);

                      return (
                        <div className="product-div" key={generateCartItemId(item)}>
                          <div className="product-cart-box">
                            <img className="cart-item-image" src={imageSrc} alt={item.name} />
                            <div className="cart-item-details">
                              <div className="cart-details-box">
                                <p className="product-name-cart">{item.name}</p>
                                <p className={item.name === 'Nike Air Huarache Le' ? 'product-price-cart-exception' : 'product-price-cart'}>
                                  {convertedPrice} {selectedCurrency.symbol}
                                </p>

                                {parsedAttributes && (
                                  <ProductCart_Attributes
                                    attributes={parsedAttributes}
                                    selectedColor={item.selectedColor}
                                    selectedSize={item.selectedSize}
                                    selectedWithUSB3Ports={item.selectedWithUSB3Ports}
                                    selectedWithTouchID={item.selectedWithTouchID}
                                    selectedCapacity={item.selectedCapacity}
                                    productId={item.id}
                                  />
                                )}

                                <div className="inc-dec">
                                  <div className={`quantity-controls ${item.name === 'AirTag' ? 'quantity-controls-Exception' : item.name === 'iMac 2021' ? 'quantity-controls-height-exception' : ''}`}>
                                    <button
                                      data-testid="cart-item-amount-increase"
                                      className="quantity-button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        this.incrementQuantity(item);
                                      }}
                                    >
                                      +
                                    </button>
                                    <span className="quantity-value" data-testid="cart-item-amount">{item.quantity}</span>
                                    <button
                                      data-testid="cart-item-amount-decrease"
                                      className="quantity-button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        this.decrementQuantity(item);
                                      }}
                                    >
                                      −
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <p className="totalValueContainer">
                      <span><b>Total:</b></span>
                      <span data-testid="cart-total">{this.context.convertPrice(localStorage.getItem('totalprice'))} {this.context.selectedCurrency.symbol}</span>
                    </p>

                    <div className="Place-Order-Container">
                      <button
                        id="1"
                        onClick={(e) => {
                          e.preventDefault();
                          this.placeOrder();
                        }}
                        disabled={uniqueCartItems.length === 0 || isPlaceOrderDisabled}
                        className="Place-Order"
                        style={{
                          opacity: uniqueCartItems.length === 0 ? 0.5 : 1,
                          pointerEvents: uniqueCartItems.length === 0 ? 'none' : 'auto',
                        }}
                      >
                        Place Order
                      </button>
                    </div>
                  </ul>
                </div>
              ) : (
                <>
                  <p>No items in the cart</p>
                  <div className="Place-Order-Container">
                    <button
                      id="1"
                      onClick={(e) => {
                        e.preventDefault();
                        this.placeOrder();
                      }}
                      disabled={uniqueCartItems.length === 0 || isPlaceOrderDisabled}
                      className={`Place-Order ${uniqueCartItems.length === 0 || isPlaceOrderDisabled ? 'disabled' : ''}`}
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Navbar */}
        {!isLoadingCategories && categories.length > 0 && (
          <nav className="categories-navbar">
            <ul className="categories-list" data-testid="category-list">
              {categories.map((category) => {
                const isActive = activeCategory === category.name.toLowerCase();
                return (
                  <a key={category.id}
                    href={`/${category.name.toLowerCase()}`}
                    className={`category ${isActive ? 'active' : ''}`}
                    data-testid={isActive ? "active-category-link" : "category-link"}
                    onClick={(e) => {
                      e.preventDefault();
                      this.handleCategoryClick(category.name); // Handle category click
                    }}
                  >
                    {category.name}
                  </a>
                );
              })}
            </ul>

            <img src={greenShoppingImage} alt="Shop Icon" className="green-shopping-image" />
            {currencies.length > 0 && (
              <CurrencySelector
                currencies={currencies}
                selectedCurrency={this.context.selectedCurrency}
                onCurrencyChange={(selected) => {
                  this.context.setSelectedCurrency(selected);
                }}
              />
            )}

            <div className="cart-icon" onClick={this.toggleCart} data-testid="cart-btn">
              <img className="cart-icon" src={iconCart} alt="Cart" />
              <span className="item-count-bubble">{uniqueCartItems.length}</span>
            </div>
          </nav>
        )}
      </div>
    );
  }


















}

export default withRouter(withApollo(Navbar));