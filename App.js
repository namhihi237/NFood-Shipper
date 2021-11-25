import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { ApolloProvider } from '@apollo/client/react';

import { client } from './src/graphql';

import Navigation from './src/navigations';
import {
  RecoilRoot,
  atom,
} from 'recoil';
const App = () => {
  return (
    <RecoilRoot>
      <ApolloProvider client={client}>
        <NativeBaseProvider>
          <Navigation />
        </NativeBaseProvider>
      </ApolloProvider>
    </RecoilRoot>
  );
};


export default App;
