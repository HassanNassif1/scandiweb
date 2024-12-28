import { ApolloClient, InMemoryCache } from '@apollo/client';


const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql.php',
  cache: new InMemoryCache(),
  fetchOptions: {
    cache: 'no-store', // Disable cache for the request
  },
});

export default client;
