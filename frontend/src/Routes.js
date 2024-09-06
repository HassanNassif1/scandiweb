import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriesPage from './components/CategoriesPage';
import ProductDetailPage from './components/ProductDetailPage';
import Navbar from './components/Navbar'; 
import { CartProvider } from './Cart/CartContext';

const App = () => {
  return (
    <CartProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }} // Ensure a high z-index
      />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/category/:categoryId" element={<CategoriesPage />} />
          <Route path="/" element={<CategoriesPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
         
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
