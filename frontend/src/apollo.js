import { ApolloClient, InMemoryCache } from '@apollo/client';


const client = new ApolloClient({
    uri: 'https://1hassan-nassif.site/graphql',
    cache: new InMemoryCache(),
  });
  

export default client;
