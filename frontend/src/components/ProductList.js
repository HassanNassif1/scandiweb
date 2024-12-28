import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { withApollo } from '@apollo/react-hoc';
import { toast } from 'react-toastify';
import ProductList_Page from '../pages/ProductList_Page';
import CurrencySelector from '../pages/CurrencySelector';
import { CurrencyContext } from '../CurrencyContext/CurrencyProvider';
import Navbar from './Navbar';  // Import Navbar

class ProductList extends Component {
  constructor(props) {
    super(props);

    // Get category name from the URL (if available)
    const categoryName = this.getCategoryNameFromUrl() || 'all';
    console.log('Initial categoryName:', categoryName);

    const savedTotalPrice = localStorage.getItem('totalprice') || 0;

    this.state = {
      products: [],
      categories: [],
      loading: true,
      error: null,
      categoryName,  // Set the initial categoryName from URL
      totalPrice: parseFloat(savedTotalPrice),
    };
  }

  // GraphQL queries
  FETCH_PRODUCTS = gql`
    query {
      products {
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
      }
      categories {
        id
        name
      }
    }
  `;

  FETCH_PRODUCTS_BY_CATEGORY = gql`
    query GetProductsByCategory($categoryName: String!) {
      productsByCategory(category_name: $categoryName) {
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
      }
      categories {
        id
        name
      }
    }
  `;

  // Get category name from URL
  getCategoryNameFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/([^/]+)/); // Capture the category from the URL
    if (match) {
      return decodeURIComponent(match[1]).toLowerCase(); // Decode and return in lowercase
    }
    return 'all'; // Default to 'all' if no category is found
  };
  
  // Fetch products based on the selected category
  fetchProducts = async () => {
    const { categoryName } = this.state;
  
    try {
      let response;
      if (categoryName === 'all') {
        response = await this.props.client.query({ query: this.FETCH_PRODUCTS });
      } else {
        response = await this.props.client.query({
          query: this.FETCH_PRODUCTS_BY_CATEGORY,
          variables: { categoryName },
        });
      }
  
      if (response.data) {
        const products = response.data.productsByCategory || response.data.products;
        this.setState({ products, loading: false });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      this.setState({ error: error.message, loading: false });
      toast.error('There was an error fetching the products: ' + error.message);
    }
  };

  componentDidMount() {
    this.fetchCategories(); // Fetch categories initially
    this.fetchProducts(); // Fetch products initially based on the category

    // Ensure the category is set correctly when the page reloads
    const categoryNameFromUrl = this.getCategoryNameFromUrl();
    if (categoryNameFromUrl && categoryNameFromUrl !== this.state.categoryName) {
      this.setState({ categoryName: categoryNameFromUrl });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Re-fetch products if categoryName changes
    if (prevState.categoryName !== this.state.categoryName) {
      this.fetchProducts(); // Fetch new products whenever categoryName changes
    }
  }

  fetchCategories = async () => {
    try {
      const response = await this.props.client.query({ query: this.FETCH_PRODUCTS });
      if (response.data) {
        const categories = response.data.categories || [];
        this.setState({ categories });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('There was an error fetching the categories.');
    }
  };

  handleCategoryClick = (categoryName) => {
    // Update state and URL when category is clicked
    this.setState({ categoryName: categoryName.toLowerCase() }, () => {
      // Update the URL with the new category
      window.history.pushState({}, "", `/${categoryName.toLowerCase()}`);
  
      // Fetch products for the selected category
      this.fetchProducts();
    });
  };
  
  handleProductBoxClick = (product) => {
    if (!product.in_stock) {
      toast.error('This product is out of stock and cannot be added to the cart.');
      return;
    }
  
    // Set the productId in localStorage for use in PDP or other components
    localStorage.setItem('productId', product.id);
  
    // Generate default attributes from product attributes
    const defaultAttributes = product.attributes.reduce((attributes, attribute) => {
      if (attribute.value && attribute.value.length > 0) {
        attributes[attribute.name] = attribute.value[0]; // Set default value for attributes
      }
      return attributes;
    }, {});
  
    // Call addToCart with the selected attributes
    this.addToCart(product, defaultAttributes);
  };
  
  

  addToCart = (product, selectedAttributes) => {
    // Fetch current cart data from localStorage
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Generate a unique product key based on product ID and selected attributes
    const productKey = `${product.id}-${JSON.stringify(selectedAttributes)}`;
  
    // Find if the product with the same ID and selected attributes already exists in the cart
    const existingProductIndex = cartData.findIndex(item =>
      `${item.id}-${JSON.stringify(item.selectedAttributes)}` === productKey
    );
  
    if (existingProductIndex > -1) {
      // If the product exists in the cart, increase the quantity and update the price
      const existingProduct = cartData[existingProductIndex];
      existingProduct.quantity += product.quantity || 1; // Add the new quantity
      existingProduct.productPrice = existingProduct.quantity * parseFloat(product.price); // Recalculate price
    } else {
      // If the product doesn't exist in the cart, add it as a new product
      const productPrice = parseFloat(product.price) * (product.quantity || 1); // Calculate the price based on quantity
      cartData.push({
        ...product,
        selectedAttributes,  // Store selected attributes
        quantity: product.quantity || 1,  // Ensure a default quantity of 1 if not provided
        productPrice,  // Store price for the product
      });
    }
  
    // Calculate the updated total price from all products in the cart
    let updatedTotalPrice = cartData.reduce((total, item) => total + (item.productPrice || 0), 0);
  
    // Ensure the total price is a valid number
    if (isNaN(updatedTotalPrice)) {
      updatedTotalPrice = 0;
    }
  
    // Store the updated cart data and total price in localStorage
    localStorage.setItem('cart', JSON.stringify(cartData));
    localStorage.setItem('totalprice', updatedTotalPrice.toFixed(2));
  
    // Update the state with the new total price
    this.setState({ totalPrice: updatedTotalPrice });
  
    // Update the cart icon
    this.updateCartIcon();
  
    // Show success toast message
    toast.success(`${product.name} has been added to your cart!`);
  };
  
  updateCartIcon = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const iconCounter = document.querySelector('.item-count-bubble');
    
    if (iconCounter) {
      // Calculate the total quantity of items in the cart
      const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
      iconCounter.textContent = totalQuantity.toString(); // Update the counter
    }
  };
  

  render() {
    const { products, categoryName, loading, categories } = this.state;
  
    if (loading) {
      return <div></div>; // You might want to add a loading spinner or indicator here
    }
  
    return (
      <CurrencyContext.Consumer>
        {({ selectedCurrency, setSelectedCurrency, currencyRates }) => (
          <>
            <Navbar
              categories={categories}
              activeCategoryName={categoryName}  // Pass the active category name
              handleCategoryClick={this.handleCategoryClick}  // Pass handleCategoryClick function as a prop
            />
  
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />
  
            <ProductList_Page
              products={products.map(product => ({
                ...product,
                convertedPrice: (product.price * (currencyRates[selectedCurrency.label] || 1)).toFixed(2),
              }))}
              categoryName={categoryName}
              selectedCurrency={selectedCurrency}
              handleProductBoxClick={this.handleProductBoxClick}
            />
          </>
        )}
      </CurrencyContext.Consumer>
    );
  }
  
}

export default withApollo(ProductList);  // Wrap this component with Apollo HOC
