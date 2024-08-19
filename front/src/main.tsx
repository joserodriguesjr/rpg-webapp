import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminPage from './pages/admin-page.tsx';
import ErrorPage from './pages/error-page.tsx';
import HomePage from './pages/home-page.tsx';
import DetailsPage from './pages/details-page.tsx';
import client from './api/apollo-client.ts';
import { ApolloProvider } from '@apollo/client';
import { GridMap } from './components/gridMap/gridMap.tsx';

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/admin',
        element: <AdminPage />,
      },
      {
        path: ':name',
        element: <DetailsPage />,
      },
      {
        path: '/battle/:name',
        element: <GridMap />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>,
);
