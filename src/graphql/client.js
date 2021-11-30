import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { storageUtils } from '../utils';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
const uri = "https://nfood-api.southeastasia.cloudapp.azure.com/api/v1/graphql";
const uriSocket = "ws://nfood-api.southeastasia.cloudapp.azure.com/api/v1/graphql";

const httpLink = createHttpLink({
  uri
});

// https://github.com/apollographql/apollo-client/issues/3967
const wsLink = new WebSocketLink({
  uri: uriSocket,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => { 
      const token = await storageUtils.getString('token');
      return {
        Authorization: token ? token : ''
      }
    } 
  },
});

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

const authLink = setContext(async (_, { headers}) => {
  const token = await storageUtils.getString('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache({
    typePolicies: {

    },
  }),
});

export default client;
