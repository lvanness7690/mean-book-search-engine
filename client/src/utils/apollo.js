import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define the GraphQL endpoint URI for local development and deployment
const graphqlUri = process.env.NODE_ENV === 'production'
  ? 'https://mern-book-search-engine-jv7d.onrender.com/graphql'
  : 'http://localhost:3001/graphql';

// Create an HTTP link to the GraphQL API
const httpLink = createHttpLink({
  uri: graphqlUri,
});

// Middleware that attaches the token to requests
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from local storage
  const token = localStorage.getItem('id_token');

  // Attach the token to the request headers if it exists
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Attach token if available
    },
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine authLink with httpLink
  cache: new InMemoryCache(),
});

// Export Apollo Provider and Apollo Client
export { ApolloProvider, client };
