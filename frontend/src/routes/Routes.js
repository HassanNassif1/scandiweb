import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductList from '../components/ProductList';
import PDP from '../components/PDP';
import Navbar from '../components/Navbar'; 
import { CartProvider } from '../Cart/CartContext';
// Correct import for the default export
import CurrencyProvider from '../CurrencyContext/CurrencyProvider';
 // Adjust the import path as necessary
import { CategoryProvider } from '../CategoryContext/CategoryContext';
const App = () => {
  return (
    <CurrencyProvider> {/* Wrap with CurrencyProvider */}
      <CartProvider>
        <CategoryProvider> {/* Wrap with CategoryProvider */}
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
            <Route path="/:categoryName" element={<ProductList />} />

              <Route path="/" element={<ProductList />} />
              <Route path="/product/:productId" element={<PDP />} />
              <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to home for unknown routes */}
            </Routes>
          </Router>
        </CategoryProvider>
      </CartProvider>
    </CurrencyProvider>
  );
};

export default App;
