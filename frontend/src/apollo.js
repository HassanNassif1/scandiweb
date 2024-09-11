import { ApolloClient, InMemoryCache } from '@apollo/client';


const client = new ApolloClient({
    uri: 'https://hassan-nassif.site/graphql',
    cache: new InMemoryCache(),
  });
  

export default client;
