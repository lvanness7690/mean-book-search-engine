import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';

const SavedBooks = () => {
  const { loading, data, error } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      cache.modify({
        fields: {
          me(existingMeRefs, { readField }) {
            return {
              ...existingMeRefs,
              savedBooks: existingMeRefs.savedBooks.filter(
                (bookRef) => readField('bookId', bookRef) !== removeBook.bookId
              ),
            };
          },
        },
      });
    },
  });

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
      });
      removeBookId(bookId); // Update localStorage
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">Error loading your saved books!</Alert>;

  return (
    <Container>
      <h2>{userData.savedBooks?.length ? `Viewing ${userData.savedBooks.length} saved book(s):` : 'You have no saved books!'}</h2>
      <Row xs={1} md={2} lg={3} className="g-3">
        {userData.savedBooks?.map((book) => (
          <Col key={book.bookId}>
            <Card>
              <Card.Img variant="top" src={book.image} alt={`The cover for ${book.title}`} />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text>{book.description}</Card.Text>
                <Button variant="danger" onClick={() => handleDeleteBook(book.bookId)}>
                  Remove from Saved
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;
