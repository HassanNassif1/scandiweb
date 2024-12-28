import { ApolloClient, InMemoryCache } from '@apollo/client';


const client = new ApolloClient({
  uri: 'https://scandiweb.hassan-nassif.site/backend-app/graphql.php',
  cache: new InMemoryCache(),
  fetchOptions: {
    cache: 'no-store', // Disable cache for the request
  },
});

export default client;
