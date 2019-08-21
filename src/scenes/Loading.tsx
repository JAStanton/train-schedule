import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';

import * as colors from '../constants/colors';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class Main extends Component {
  render() {
    return (
      <View style={STYLES.root}>
        <ActivityIndicator size='large' color={colors.FOREGROUND} />
      </View>
    );
  }
}
