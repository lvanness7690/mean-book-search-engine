import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { searchGoogleBooks } from '../utils/API'; // This remains as your API call method

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK, {
    update(cache, { data: { saveBook } }) {
      cache.modify({
        fields: {
          me(existingMeRefs = {}) {
            const newBookRef = cache.writeFragment({
              data: saveBook,
              fragment: gql`
                fragment NewBook on Book {
                  id
                  bookId
                  authors
                  description
                  title
                  image
                  link
                }
              `,
            });
            return {
              ...existingMeRefs,
              savedBooks: [...existingMeRefs.savedBooks, newBookRef],
            };
          },
        },
      });
    },
  });

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  // handleFormSubmit: unchanged, continues to use searchGoogleBooks()

  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` array
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    try {
      await saveBook({
        variables: { input: bookToSave },
      });
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (e) {
      console.error(e);
    }
  };

  // JSX for rendering the search input, book list, etc., remains the same
};

export default SearchBooks;
