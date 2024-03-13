import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Use the full URI to ensure correct endpoint is targeted
});

// Middleware that attaches the token to requests
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from local storage
  const token = localStorage.getItem('id_token');
  
  // Log the token for debugging purposes
  console.log('Token:', token); 

  // Log headers before adding token for debugging purposes
  console.log('Headers before adding token:', headers); 

  // Attach the token to the request headers if it exists
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Attach token if available
    },
  };
});

// Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine authLink with httpLink
  cache: new InMemoryCache(),
});

// Exporting Apollo Provider and Apollo Client
export { ApolloProvider, client };
