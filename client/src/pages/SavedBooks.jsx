import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await removeBook({
        variables: { bookId },
        update: cache => {
          const { me } = cache.readQuery({ query: GET_ME });
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...me, savedBooks: me.savedBooks.filter(book => book.bookId !== bookId) }},
          });
        }
      });

      if (error) {
        throw new Error('something went wrong!');
      }

      // Upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {/* Your component JSX, mapping through userData.savedBooks to display them */}
    </>
  );
};

export default SavedBooks;
