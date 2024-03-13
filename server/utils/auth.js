const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Adjusted for GraphQL context
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req; // No modifications if there's no token
    }

    try {
      const { data } = jwt.verify(token, secret, { expiresIn: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // return the request object so it can be passed to the resolver as context
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
