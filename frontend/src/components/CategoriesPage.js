import React, { Component } from "react";
import { gql } from "@apollo/client";
import { withApollo } from '@apollo/react-hoc';
import { Link } from "react-router-dom";
import iconCart from '../images/icon.png';
import { toast } from 'react-toastify';

class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categoryId: this.getCategoryId(),
      categoryName: '', // Added state variable to hold the category name,
      isAnimating: false, // Track animation state
      animationProduct: null, // Track the product being animated
    };
  }

  FETCH_PRODUCTS = gql`
    query {
      products {
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
      categories {
        id
        name
      }
    }
  `;
  
  FETCH_CATEGORY_NAME = gql`
    query categoryName($categoryId: ID!) {
      category(id: $categoryId) {
        name
      }
    }
  `;
  
  FETCH_PRODUCTS_BY_CATEGORY = gql`
    query productsByCategory($categoryId: ID!) {
      productsByCategory(category_id: $categoryId) {
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

  fetchProductsByCategory = async (categoryId) => {
    try {
      let response;
      if (categoryId === '1') {
        response = await this.props.client.query({
          query: gql`
            query {
              allProducts {
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
          `
        });
      } else {
        response = await this.props.client.query({
          query: this.FETCH_PRODUCTS_BY_CATEGORY,
          variables: { categoryId }
        });
      }
      const products = response.data.productsByCategory || response.data.allProducts;
      this.setState({ products, categoryId });
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  getCategoryId = () => {
    const path = window.location.pathname;
    const match = path.match(/\/category\/([^\/]+)/);
    return match ? match[1] : '1'; // Default to '1' if no category ID is found
  }
  
  fetchProducts = async () => {
    try {
      const response = await this.props.client.query({
        query: this.FETCH_PRODUCTS
      });
      const products = response.data.products;
      this.setState({ products });
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  fetchCategoryName = async (categoryId) => {
    try {
      const response = await this.props.client.query({
        query: this.FETCH_CATEGORY_NAME,
        variables: { categoryId }
      });
      const categoryName = response.data.category ? response.data.category.name : '';
      this.setState({ categoryName });
    } catch (error) {
      console.log('Error fetching category name:', error);
    }
  };

  componentDidMount() {
    const categoryId = this.getCategoryId();
    this.setState({ categoryId }, () => {
      if (categoryId === '1') {
        this.fetchProducts(); // Fetch all products if category ID is '1'
      } else {
        this.fetchProductsByCategory(categoryId);
        this.fetchCategoryName(categoryId); // Fetch category name
      }
    });
  }

  handleProductBoxClick = (product) => {
    if (!product.in_stock) {
      // Show a toast error message if the product is out of stock
      toast.error('This product is out of stock and cannot be added to the cart.');
      return;
    }else if(product.in_stock){
      window.location.reload(); // Uncomment if you need to reload the page
        // Show a toast success message with the product name
    toast.success(`${product.name} has been added to your cart!`, {
      autoClose: 2000, // Optionally set the autoClose timeout (2 seconds)
    });
    this.addToCart(product);
    // Optionally, reload the page after showing the toast (if needed)
    }
   
  
    // Add product to the cart
   
  
  
  }
  
  addToCart = (product, selectedColor, selectedSize) => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cartData.findIndex(item => 
      item.id === product.id && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
    );
  
    if (existingItemIndex > -1) {
      // Update quantity if item already exists in the cart
      cartData[existingItemIndex].quantity += 1;
      cartData[existingItemIndex].totalPrice = cartData[existingItemIndex].price * cartData[existingItemIndex].quantity;
    } else {
      // Add new item to the cart
      cartData.push({
        ...product, 
        quantity: 1, 
        totalPrice: product.price,
        selectedColor, 
        selectedSize
      });
    }
  
    localStorage.setItem('cart', JSON.stringify(cartData));
    this.updateCartIcon();
  }
  
  updateCartIcon = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const iconCounter = document.querySelector('.item-count-bubble');
    if (iconCounter) {
      iconCounter.textContent = cartItems.reduce((total, item) => total + item.quantity, 0).toString();
    }
  }

  render() {
    const { products, categoryName } = this.state;

    return (
      <div className="category-page">
        <h2>{categoryName}</h2>
        <div className="products-container">
          <div className="products-wrapper">
            {products.map(product => (
              <div className="product-box" key={product.id}>
                {product.in_stock ? (
                  <Link to={`/product/${product.id}?categoryId=${product.category_id}`}>
                    <img className='product-image' src={JSON.parse(product.image)[0]} alt={product.name} />
                  </Link>
                ) : (
                  <img className='product-image' src={JSON.parse(product.image)[0]} alt={product.name} />
                )}
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price"> ${product.price}</div>
                </div>
                {!product.in_stock && (
                  <div className="out-of-stock">OUT OF STOCK</div>
                )}
                <img 
                  className="icon-image" 
                  src={iconCart} 
                  alt="Icon" 
                  onClick={() => this.handleProductBoxClick(product)} // Handle quick add to cart
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(CategoryPage);
