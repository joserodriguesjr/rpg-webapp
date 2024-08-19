import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// import { onError } from '@apollo/client/link/error';
// import Cookies from 'js-cookie'
import { hostname, port } from './api';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  //   const authToken  = Cookies.get("secret__");
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Headers': 'Content-Type',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'POST,GET,PATCH,OPTIONS',
      //   authorization: `Bearer ${authToken}`
    },
  };
});

const httpLink = new HttpLink({
  uri: `http://${hostname}:${port}/graphql`,
  //   uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  credentials: 'include',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${hostname}:${port}/subscriptions`,
    // on: {
    //   closed: (socket) => {
    //     console.log(socket.readyState);
    //   },
    // },
  }),
);

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
//       ),
//     );

//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
    typePolicies: {
      Character: {
        fields: {
          virus: {
            merge: true,
          },
        },
      },
    },
  }),
  connectToDevTools: true,
  link: authLink.concat(splitLink),
});

export default client;
