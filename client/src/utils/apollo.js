// src/utils/apollo.js
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: '/graphql', // Adjust if your GraphQL server endpoint differs
});

// Middleware that attaches the token to requests
const authLink = setContext((_, { headers }) => {
  // Assume the token is stored in localStorage for this example
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { ApolloProvider, client };
