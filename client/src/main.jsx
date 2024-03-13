// main.jsx
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './utils/apollo'; // Adjust this path if necessary
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks />
      }, {
        path: '/saved',
        element: <SavedBooks />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
