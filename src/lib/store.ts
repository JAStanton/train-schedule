import ApolloClient from 'apollo-boost';
import AsyncStorage from '@react-native-community/async-storage';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

import resolvers from '../resolvers';

export default async function createStore() {
  const cache = new InMemoryCache();

  try {
    await persistCache({
      cache,
      storage: AsyncStorage,
    });
  } catch (error) {
    console.error('Error restoring Apollo cache', error);
  }

  return new ApolloClient({ resolvers, cache });
}
