import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { withApollo } from 'react-apollo';

import * as colors from './constants/colors';
import * as queries from './queries/queries';
import * as database from './lib/database';
import { PickUserPreferences, Schedule } from './scenes';
import TrainSchedule from './lib/schedule';
import Navigation from './navigation';

type State = {
  loaded: boolean;
  client: any;
};

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
});

export default class Main extends Component<{}, State> {
  state = { loaded: false, client: null };

  async componentDidMount() {
    const cache = new InMemoryCache();

    try {
      await persistCache({
        cache,
        storage: AsyncStorage,
      });
    } catch (error) {
      console.error('Error restoring Apollo cache', error);
    }

    const client = new ApolloClient({
      resolvers: {
        Mutation: {
          chooseStation: (_root, { stationType, stationName }, { cache, getCacheKey }) => {
            const id = getCacheKey({ __typename: 'User', id: 1 });

            const fragment = gql`
              fragment station on User {
                preferences {
                  origin
                  destination
                  direction
                }
              }
            `;

            const preferences = cache.readFragment({ fragment, id });
            const data = {
              ...preferences,
              preferences: {
                ...preferences.preferences,
                [stationType.toLowerCase()]: stationName,
              },
            };

            cache.writeData({ id, data });
          },
        },
        Query: {
          stations: async root => {
            return await database.getRef('/stations');
          },
          schedule: async root => {
            const data = await database.getRef('/schedule');
            const foo = new TrainSchedule(data);
            return foo.transformed;
          },
          user: async root => {
            const data = await database.getUserPreferences();
            const origin = _.get(data, 'origin', '');
            const destination = _.get(data, 'destination', '');
            const direction = _.get(data, 'direction', '');

            return {
              __typename: 'User',
              id: 1,
              preferences: {
                __typename: 'UserPreferences',
                origin,
                destination,
                direction,
              },
            };
          },
        },
      },
      cache,
    });

    this.setState({
      client,
      loaded: true,
    });
  }

  render() {
    const { client, loaded } = this.state;
    if (!loaded) {
      return <View style={STYLES.root} />;
    }

    return (
      <ApolloProvider client={client}>
        <Navigation />
      </ApolloProvider>
    );
  }
}
