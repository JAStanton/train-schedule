import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';

import * as colors from './constants/colors';
import createStore from './lib/store';
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
    const client = await createStore();

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
