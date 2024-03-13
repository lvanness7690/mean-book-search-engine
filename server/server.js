const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth'); // Assuming you have an authentication middleware
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Use port 3001 by default for local development

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware // Ensure that your authentication middleware is correctly defined
  });

  await server.start();
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve static assets from the client build folder
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // Catch-all route handler to serve the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });

  // Start the server
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on port ${PORT}`));
  });
}

startApolloServer(typeDefs, resolvers);
