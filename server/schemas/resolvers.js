const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models'); // Adjust this path as needed
const { signToken } = require('../utils/auth'); // Assuming you have a utility for JWT

const resolvers = {
  Query: {
    // Get the current user
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    // User login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);
      return { token, user };
    },

    // Add a new user (addUser mutation should be implemented)

    // Save a book
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        try {
          // Find the user by ID and update their savedBooks array
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $push: { savedBooks: input } },
            { new: true }
          ).populate('savedBooks');

          return updatedUser;
        } catch (error) {
          // Handle any errors
          throw new Error('Failed to save the book.');
        }
      }
      throw new AuthenticationError('You need to be logged in to save a book.');
    },

    // Remove a book
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        try {
          // Find the user by ID and update their savedBooks array
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          ).populate('savedBooks');

          return updatedUser;
        } catch (error) {
          // Handle any errors
          throw new Error('Failed to remove the book.');
        }
      }
      throw new AuthenticationError('You need to be logged in to remove a book.');
    },
  },
};

module.exports = resolvers;
