import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Routes from './routes/Routes';
import reportWebVitals from './reportWebVitals';
import client from './apollo/apollo';
import "./App.css";
import './style/CategoriesNavbar.css';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
